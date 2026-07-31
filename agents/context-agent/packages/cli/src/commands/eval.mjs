/** Eval subcommands — route, dry-run, bootstrap, run (A/B/C), aggregate */
import fs from "node:fs";
import path from "node:path";
import {
  dryRunEval,
  formatDryRunReport,
  runBootstrap,
  formatBootstrapReport,
  runEval,
  aggregateResults,
  routeQuestionSemantic,
} from "@context-os/eval";
import { loadRoutingMap, routeQuestion, routingScores } from "../lib/router.mjs";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";

function parseEvalArgs(argv) {
  const sub = argv[0];
  const opts = {
    questions: "context-os/eval/questions.json",
    baseline: "context-os/eval/baseline-manifest.json",
    router: "keyword",
    condition: "both",
    iterations: 10_000,
    seed: 42,
    metric: "accuracy_delta_b_vs_a",
    out: null,
    dryRun: false,
    skipJudge: false,
    pilot: false,
    aggregateAfter: false,
    ids: null,
    filter: null,
  };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--questions" && argv[i + 1]) opts.questions = argv[++i];
    else if (a === "--baseline" && argv[i + 1]) opts.baseline = argv[++i];
    else if (a === "--router" && argv[i + 1]) opts.router = argv[++i];
    else if (a === "--condition" && argv[i + 1]) opts.condition = argv[++i];
    else if (a === "--out" && argv[i + 1]) opts.out = argv[++i];
    else if (a === "--ids" && argv[i + 1]) opts.ids = argv[++i].split(",");
    else if (a === "--filter" && argv[i + 1]) opts.filter = argv[++i];
    else if (a === "--iterations" && argv[i + 1]) opts.iterations = Number(argv[++i]);
    else if (a === "--seed" && argv[i + 1]) opts.seed = Number(argv[++i]);
    else if (a === "--metric" && argv[i + 1]) opts.metric = argv[++i];
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--skip-judge") opts.skipJudge = true;
    else if (a === "--pilot") opts.pilot = true;
    else if (a === "--aggregate") opts.aggregateAfter = true;
  }
  return { sub, opts };
}

export async function cmdEval(argv) {
  const { opts: global, rest: afterRoot } = parseGlobalFlags(argv);
  const { sub, opts } = parseEvalArgs(afterRoot);

  switch (sub) {
    case "route":
    case "routing":
      await evalRouting(global.root, opts.questions, opts.router);
      return;
    case "dry-run":
      await evalDryRun(global.root, opts);
      return;
    case "bootstrap":
      await evalBootstrap(afterRoot.slice(1), opts);
      return;
    case "run":
      await evalRun(global.root, opts);
      return;
    case "aggregate":
      await evalAggregate(afterRoot.slice(1));
      return;
    default:
      printEvalHelp();
  }
}

function printEvalHelp() {
  console.log(`context-os eval — routing, dry-run, bootstrap, full A/B run

Subcommands:
  route       Routing F1 on questions JSON (no LLM; semantic needs API)
  dry-run     Condition B context sizes per question (no API key)
  bootstrap   95% CI on paired.csv accuracy deltas
  run         A/B/C eval with LLM + judge (needs OPENAI_API_KEY)
  aggregate   results.json → paired.csv + summary.json

Examples:
  context-os eval route --questions context-os/eval/questions.json
  context-os eval dry-run --root .
  context-os eval run --dry-run --condition both --aggregate
  context-os eval run --condition ab --router keyword
  context-os eval aggregate context-os/eval/results/run-<id>
  context-os eval bootstrap experiments/oiloop/runs/run-*/paired.csv

Env (run): OPENAI_API_KEY, EVAL_MODEL, OPENAI_BASE_URL
`);
}

async function evalRouting(projectRoot, questionsRel, routerMode = "keyword") {
  const qPath = path.isAbsolute(questionsRel)
    ? questionsRel
    : path.join(projectRoot, questionsRel);

  if (!fs.existsSync(qPath)) {
    throw new Error(
      `Questions file not found: ${qPath}\nCopy context-os/eval/questions.stub.json → questions.json and add expected_cores.`
    );
  }

  const questions = JSON.parse(fs.readFileSync(qPath, "utf8"));
  const list = Array.isArray(questions) ? questions : questions.questions ?? [];
  const map = loadRoutingMap(projectRoot);

  let f1Sum = 0;
  let n = 0;
  const failures = [];

  for (const q of list) {
    const expected = q.expected_cores ?? [];
    const actual =
      routerMode === "semantic"
        ? await routeQuestionSemantic(q.question, {
            projectRoot,
            routingMap: map,
            keywordRoute: routeQuestion,
          })
        : routeQuestion(q.question, map);
    const scores = routingScores(expected, actual);
    f1Sum += scores.f1;
    n++;
    if (scores.f1 < 1) {
      failures.push({
        id: q.id ?? q.question_id,
        question: q.question,
        expected,
        actual,
        f1: scores.f1,
      });
    }
    if (routerMode === "semantic") {
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  const meanF1 = n ? f1Sum / n : 0;
  console.log(`Routing eval (${routerMode}): ${n} questions`);
  console.log(`  mean F1: ${meanF1.toFixed(3)}`);
  if (failures.length) {
    console.log(`  failures: ${failures.length}`);
    for (const f of failures.slice(0, 10)) {
      console.log(`    ${f.id}: expected [${f.expected}] got [${f.actual}] (F1=${f.f1.toFixed(2)})`);
    }
    if (failures.length > 10) console.log(`    ... +${failures.length - 10} more`);
    process.exitCode = 1;
  }
  console.log("OK — all routes match expected_cores");
}

async function evalDryRun(projectRoot, opts) {
  const qPath = path.isAbsolute(opts.questions)
    ? opts.questions
    : path.join(projectRoot, opts.questions);

  if (!fs.existsSync(qPath)) {
    throw new Error(`Questions file not found: ${qPath}`);
  }

  const manifest = loadManifest(projectRoot);
  const map = loadRoutingMap(projectRoot);

  const semanticRoute =
    opts.router === "semantic"
      ? (question) =>
          routeQuestionSemantic(question, {
            projectRoot,
            routingMap: map,
            keywordRoute: routeQuestion,
          })
      : undefined;

  const result = await dryRunEval({
    projectRoot,
    manifest,
    routingMap: map,
    questionsPath: qPath,
    routeQuestion,
    routeQuestionSemantic: semanticRoute,
    routerMode: opts.router,
  });

  console.log(formatDryRunReport(result));

  const failures = result.rows.filter((r) => r.context_chars === 0);
  if (failures.length) {
    for (const f of failures.slice(0, 5)) {
      console.log(`  zero: ${f.id} → [${f.routed_cores}]`);
    }
    process.exitCode = 1;
  }
}

async function evalBootstrap(restArgv, opts) {
  const pairedArg = restArgv.find((a) => !a.startsWith("-"));
  if (!pairedArg) {
    throw new Error("Usage: context-os eval bootstrap <paired.csv> [--iterations N] [--out file.json]");
  }

  const pairedPath = path.resolve(pairedArg);
  if (!fs.existsSync(pairedPath)) {
    throw new Error(`paired.csv not found: ${pairedPath}`);
  }

  const result = runBootstrap(pairedPath, {
    iterations: opts.iterations,
    seed: opts.seed,
    metric: opts.metric,
  });

  console.log(formatBootstrapReport(result));

  const outPath = opts.out ?? path.join(path.dirname(pairedPath), "bootstrap-ci.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`Wrote ${outPath}`);
}

async function evalRun(projectRoot, opts) {
  const manifest = loadManifest(projectRoot);
  const map = loadRoutingMap(projectRoot);

  const questionsPath = path.isAbsolute(opts.questions)
    ? opts.questions
    : path.join(projectRoot, opts.questions);
  const baselinePath = path.isAbsolute(opts.baseline)
    ? opts.baseline
    : path.join(projectRoot, opts.baseline);

  const semanticRoute =
    opts.router === "semantic"
      ? (question) =>
          routeQuestionSemantic(question, {
            projectRoot,
            routingMap: map,
            keywordRoute: routeQuestion,
          })
      : undefined;

  const result = await runEval({
    projectRoot,
    manifest,
    routingMap: map,
    routeQuestion: (q) => routeQuestion(q, map),
    routeQuestionSemantic: semanticRoute,
    routingScores,
    questionsPath,
    baselinePath,
    outDir: opts.out ? path.resolve(opts.out) : undefined,
    condition: opts.condition,
    router: opts.router,
    dryRun: opts.dryRun,
    skipJudge: opts.skipJudge,
    pilot: opts.pilot,
    ids: opts.ids,
    filter: opts.filter,
    onProgress: ({ questionId, condition, router }) => {
      console.log(`[${questionId}] condition ${condition} (router=${router}) …`);
    },
  });

  console.log(`Done. ${result.rows.length} rows → ${result.outDir}/results.csv`);

  if (opts.aggregateAfter || opts.dryRun) {
    const agg = aggregateResults(result.outDir);
    console.log(JSON.stringify(agg.summary, null, 2));
    console.log(`Wrote ${agg.mdPath}`);
  } else {
    console.log(`Next: context-os eval aggregate ${result.outDir}`);
  }
}

async function evalAggregate(restArgv) {
  const dirArg = restArgv.find((a) => !a.startsWith("-"));
  if (!dirArg) {
    throw new Error("Usage: context-os eval aggregate <results-dir>");
  }
  const resolved = path.resolve(dirArg);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Not found: ${resolved}`);
  }
  const agg = aggregateResults(resolved);
  console.log(JSON.stringify(agg.summary, null, 2));
  console.log(`Wrote ${agg.pairedPath}, ${agg.summaryPath}, ${agg.mdPath}`);
}
