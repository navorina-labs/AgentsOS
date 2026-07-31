#!/usr/bin/env node
/** CLI: portable A/B/C eval — requires OPENAI_API_KEY unless --dry-run */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runEval } from "../src/run-eval.mjs";
import { aggregateResults } from "../src/aggregate-results.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadRouter(projectRoot) {
  const mapPath = path.join(projectRoot, "context-os/router/routing-map.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

  function patternMatches(question, pattern) {
    const q = question.toLowerCase();
    const p = pattern.toLowerCase();
    if (/^[a-z0-9_:.+-]+$/i.test(p)) {
      const re = new RegExp(`(?<![a-z0-9])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9])`, "i");
      return re.test(q);
    }
    return q.includes(p);
  }

  function routeQuestion(question) {
    const scored = [];
    for (const route of map.routes) {
      let hits = 0;
      let maxLen = 0;
      for (const pattern of route.patterns) {
        if (patternMatches(question, pattern)) {
          hits++;
          maxLen = Math.max(maxLen, pattern.length);
        }
      }
      if (hits > 0) scored.push({ route, hits, maxLen });
    }
    scored.sort((a, b) => b.hits - a.hits || b.maxLen - a.maxLen);
    const fallback = map.fallback_core ?? "technical-core";
    if (scored.length === 0) return [fallback];
    const bestHits = scored[0].hits;
    const bestLen = scored[0].maxLen;
    const matched = new Set();
    for (const { route, hits, maxLen } of scored) {
      if (hits < bestHits) break;
      if (hits === bestHits && maxLen < bestLen) break;
      for (const core of route.cores) matched.add(core);
    }
    return [...matched];
  }

  function routingScores(expected, actual) {
    const exp = new Set(expected);
    const act = new Set(actual);
    let intersection = 0;
    for (const c of exp) {
      if (act.has(c)) intersection++;
    }
    const precision = act.size === 0 ? 0 : intersection / act.size;
    const recall = exp.size === 0 ? 1 : intersection / exp.size;
    const f1 =
      precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
    return { precision, recall, f1 };
  }

  return { map, routeQuestion, routingScores };
}

function parseArgs(argv) {
  const opts = {
    root: process.cwd(),
    condition: "both",
    router: "keyword",
    dryRun: false,
    skipJudge: false,
    pilot: false,
    aggregate: false,
    ids: null,
    filter: null,
    out: null,
    questions: null,
    baseline: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) opts.root = path.resolve(argv[++i]);
    else if (a === "--condition" && argv[i + 1]) opts.condition = argv[++i];
    else if (a === "--router" && argv[i + 1]) opts.router = argv[++i];
    else if (a === "--out" && argv[i + 1]) opts.out = argv[++i];
    else if (a === "--questions" && argv[i + 1]) opts.questions = argv[++i];
    else if (a === "--baseline" && argv[i + 1]) opts.baseline = argv[++i];
    else if (a === "--ids" && argv[i + 1]) opts.ids = argv[++i].split(",");
    else if (a === "--filter" && argv[i + 1]) opts.filter = argv[++i];
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--skip-judge") opts.skipJudge = true;
    else if (a === "--pilot") opts.pilot = true;
    else if (a === "--aggregate") opts.aggregate = true;
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: context-os-eval run [options]

Options:
  --root DIR           Project root (default: cwd)
  --condition both|ab|abc|all|a|b   Conditions (default: both = A+B)
  --router gold|keyword              B routing (default: keyword)
  --questions PATH     questions.json (default: context-os/eval/questions.json)
  --baseline PATH      baseline-manifest.json
  --out DIR            Results directory
  --ids Q01,Q02        Question subset
  --filter cross-cutting
  --pilot              Use pilot_ids from questions bank
  --dry-run            Context sizes only, no API
  --skip-judge         Answers only, no judge calls
  --aggregate          Run aggregate after eval

Env: OPENAI_API_KEY, EVAL_MODEL (default gpt-4o-mini), OPENAI_BASE_URL`);
      process.exit(0);
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);
  const manifestPath = path.join(opts.root, "context-os/manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`No context-os/manifest.json at ${opts.root}. Run: context-os init`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const { map, routeQuestion, routingScores } = loadRouter(opts.root);

  const result = await runEval({
    projectRoot: opts.root,
    manifest,
    routingMap: map,
    routeQuestion,
    routingScores,
    questionsPath: opts.questions,
    baselinePath: opts.baseline,
    outDir: opts.out,
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

  if (opts.aggregate || opts.dryRun) {
    const agg = aggregateResults(result.outDir);
    console.log(JSON.stringify(agg.summary, null, 2));
    console.log(`Wrote ${agg.mdPath}`);
  } else {
    console.log(`Next: context-os eval aggregate ${result.outDir}`);
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
