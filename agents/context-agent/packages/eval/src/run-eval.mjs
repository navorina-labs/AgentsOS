/** Portable A/B/C eval runner — A=baseline, B=cores, C=graph (optional) */
import fs from "node:fs";
import path from "node:path";
import { loadCoreContext } from "./core-context.mjs";
import { loadBaselineContext } from "./baseline-loader.mjs";
import { loadGraphContext, graphIndexExists } from "./graph-loader.mjs";
import { answerQuestion } from "./llm.mjs";
import { judgeAnswer } from "./judge.mjs";
import { writeCsv } from "./csv.mjs";

const CONDITION_PRESETS = {
  both: ["A", "B"],
  ab: ["A", "B"],
  abc: ["A", "B", "C"],
  all: ["A", "B", "C"],
  b: ["B"],
  a: ["A"],
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveConditions(condArg, projectRoot) {
  const key = condArg.toLowerCase();
  let conds = CONDITION_PRESETS[key] ?? [key.toUpperCase()];
  if (conds.includes("C") && !graphIndexExists(projectRoot)) {
    conds = conds.filter((c) => c !== "C");
  }
  return conds;
}

function readQuestions(questionsPath) {
  const bank = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  return {
    questions: Array.isArray(bank) ? bank : bank.questions ?? [],
    pilotIds: bank.pilot_ids ?? null,
  };
}

function filterQuestions(questions, opts) {
  let list = questions;
  if (opts.pilot && opts.pilotIds) {
    const set = new Set(opts.pilotIds);
    list = list.filter((q) => set.has(q.id));
  }
  if (opts.ids?.length) {
    const set = new Set(opts.ids);
    list = list.filter((q) => set.has(q.id));
  }
  if (opts.filter === "cross-cutting") {
    list = list.filter((q) => (q.expected_cores?.length ?? 0) > 1);
  }
  return list;
}

async function resolveCoreIds(question, routerMode, opts) {
  switch (routerMode) {
    case "gold":
      return question.expected_cores?.length
        ? [...question.expected_cores]
        : opts.routeQuestion(question.question, opts.routingMap);
    case "keyword":
      return opts.routeQuestion(question.question, opts.routingMap);
    case "semantic":
      if (!opts.routeQuestionSemantic) {
        throw new Error("Semantic router not configured");
      }
      return opts.routeQuestionSemantic(question.question);
    default:
      throw new Error(`Invalid router: ${routerMode}. Use: gold|keyword|semantic`);
  }
}

async function runOne(question, condition, context, opts, projectName) {
  const row = {
    question_id: question.id,
    domain: question.domain ?? "",
    condition,
    question: question.question,
    context_chars: context.chars,
    tokens_in_context_est: context.tokens_est,
    context_files: context.files?.join(";") ?? "",
    cores_used: context.coreIds?.join(";") ?? "",
  };

  if (opts.dryRun) {
    row.answer = "(dry-run)";
    row.latency_ms = 0;
    row.tokens_in = 0;
    row.tokens_out = 0;
    return row;
  }

  const ans = await answerQuestion(question.question, context.text, condition, projectName);
  row.answer = ans.content;
  row.latency_ms = ans.latency_ms;
  row.tokens_in = ans.tokens_in;
  row.tokens_out = ans.tokens_out;
  row.model = ans.model;

  if (!opts.skipJudge && question.gold?.length) {
    await sleep(300);
    const j = await judgeAnswer({
      question: question.question,
      gold: question.gold,
      answer: ans.content,
      projectName,
    });
    row.accuracy = j.accuracy;
    row.hallucination = j.hallucination;
    row.completeness = j.completeness;
    row.reasoning = j.reasoning;
    row.judge_notes = j.notes ?? "";
  }

  return row;
}

/**
 * @param {object} opts
 * @param {string} opts.projectRoot
 * @param {object} opts.manifest
 * @param {function} opts.routeQuestion
 * @param {function} opts.routingScores
 * @param {string} [opts.questionsPath]
 * @param {string} [opts.baselinePath]
 * @param {string} [opts.outDir]
 * @param {string} [opts.condition]
 * @param {string} [opts.router]
 * @param {boolean} [opts.dryRun]
 * @param {boolean} [opts.skipJudge]
 * @param {string[]} [opts.ids]
 * @param {boolean} [opts.pilot]
 * @param {string} [opts.filter]
 * @param {function} [opts.routeQuestionSemantic]
 * @param {function} [opts.onProgress]
 */
export async function runEval(opts) {
  const projectRoot = path.resolve(opts.projectRoot);
  const questionsPath =
    opts.questionsPath ?? path.join(projectRoot, "context-os/eval/questions.json");
  const baselinePath =
    opts.baselinePath ?? path.join(projectRoot, "context-os/eval/baseline-manifest.json");

  const { questions, pilotIds } = readQuestions(questionsPath);
  const filtered = filterQuestions(questions, {
    pilot: opts.pilot,
    pilotIds,
    ids: opts.ids,
    filter: opts.filter,
  });

  if (filtered.length === 0) {
    throw new Error("No questions matched filters");
  }

  const conditions = resolveConditions(opts.condition ?? "both", projectRoot);
  const routerMode = opts.router ?? "keyword";
  const projectName = opts.manifest.project ?? opts.manifest.description ?? "project";

  const outDir =
    opts.outDir ??
    path.join(projectRoot, "context-os/eval/results", `run-${Date.now()}`);
  fs.mkdirSync(outDir, { recursive: true });

  let baselineCtx = null;
  if (conditions.includes("A")) {
    if (!fs.existsSync(baselinePath)) {
      throw new Error(
        `Baseline manifest not found: ${baselinePath}\nCopy context-os/eval/baseline-manifest.stub.json`
      );
    }
    baselineCtx = loadBaselineContext(projectRoot, baselinePath);
    fs.writeFileSync(
      path.join(outDir, "context-a-meta.json"),
      JSON.stringify(
        {
          files: baselineCtx.files.length,
          chars: baselineCtx.chars,
          tokens_est: baselineCtx.tokens_est,
        },
        null,
        2
      )
    );
  }

  const rows = [];
  const routingLog = [];

  for (const q of filtered) {
    const coreIds = await resolveCoreIds(q, routerMode, opts);
    const coreCtx = loadCoreContext(projectRoot, coreIds, opts.manifest);

    if (q.expected_cores?.length) {
      const rs = opts.routingScores(q.expected_cores, coreIds);
      routingLog.push({
        question_id: q.id,
        expected: q.expected_cores,
        routed: coreIds,
        f1: Number(rs.f1.toFixed(3)),
      });
    }

    for (const cond of conditions) {
      let ctx;
      if (cond === "A") ctx = baselineCtx;
      else if (cond === "B") ctx = coreCtx;
      else if (cond === "C")
      ctx = loadGraphContext(projectRoot, q.question, { routedCoreIds: coreIds });
      else throw new Error(`Unknown condition: ${cond}`);

      opts.onProgress?.({ questionId: q.id, condition: cond, router: routerMode });

      try {
        const row = await runOne(q, cond, ctx, opts, projectName);
        if (cond === "B") {
          row.routed_cores = coreIds.join(";");
          row.router_mode = routerMode;
        }
        rows.push(row);
        fs.writeFileSync(
          path.join(outDir, `${q.id}-${cond}.md`),
          `# ${q.id} (${cond})\n\n## Answer\n\n${row.answer ?? row.error ?? ""}\n`
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        rows.push({ question_id: q.id, condition: cond, error: msg });
      }

      if (!opts.dryRun) {
        const pause = cond === "A" ? 20_000 : cond === "C" ? 3_000 : 800;
        await sleep(pause);
      }
    }
  }

  writeCsv(path.join(outDir, "results.csv"), rows);
  fs.writeFileSync(path.join(outDir, "results.json"), JSON.stringify(rows, null, 2));

  const routingF1 =
    routingLog.length > 0
      ? routingLog.reduce((s, r) => s + r.f1, 0) / routingLog.length
      : null;

  const meta = {
    run_at: new Date().toISOString(),
    project_root: projectRoot,
    questions: filtered.length,
    conditions,
    dry_run: !!opts.dryRun,
    skip_judge: !!opts.skipJudge,
    baseline_chars: baselineCtx?.chars ?? null,
    model: process.env.EVAL_MODEL ?? "gpt-4o-mini",
    router_mode: routerMode,
    router_mean_f1: routingF1 != null ? Number(routingF1.toFixed(3)) : null,
    routing: routingLog,
  };
  fs.writeFileSync(path.join(outDir, "run-meta.json"), JSON.stringify(meta, null, 2));

  return { outDir, rows, meta };
}
