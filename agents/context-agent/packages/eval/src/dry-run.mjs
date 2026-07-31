/** Dry-run eval: measure routed core context per question (no LLM for keyword/gold) */
import fs from "node:fs";
import { loadCoreContext } from "./core-context.mjs";

function readQuestions(questionsPath) {
  const raw = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  return Array.isArray(raw) ? raw : raw.questions ?? [];
}

function mean(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

async function resolveCoreIds(q, opts) {
  const mode = opts.routerMode ?? "keyword";
  if (mode === "gold" && q.expected_cores?.length) {
    return [...q.expected_cores];
  }
  if (mode === "semantic") {
    if (!opts.routeQuestionSemantic) {
      throw new Error("Semantic router not configured for dry-run");
    }
    return opts.routeQuestionSemantic(q.question);
  }
  return opts.routeQuestion(q.question, opts.routingMap);
}

/**
 * @param {object} opts
 * @param {string} opts.projectRoot
 * @param {object} opts.manifest
 * @param {function} opts.routeQuestion
 * @param {function} [opts.routeQuestionSemantic]
 * @param {object} opts.routingMap
 * @param {string} opts.questionsPath
 * @param {"gold"|"keyword"|"semantic"} [opts.routerMode]
 */
export async function dryRunEval(opts) {
  const questions = readQuestions(opts.questionsPath);
  const rows = [];
  let zeroContext = 0;

  for (const q of questions) {
    const coreIds = await resolveCoreIds(q, opts);
    const ctx = loadCoreContext(opts.projectRoot, coreIds, opts.manifest);
    if (ctx.chars === 0) zeroContext++;

    rows.push({
      id: q.id ?? q.question_id,
      question: q.question,
      expected_cores: q.expected_cores ?? [],
      routed_cores: coreIds,
      context_chars: ctx.chars,
      tokens_est: ctx.tokens_est,
      files: ctx.files,
    });
  }

  const chars = rows.map((r) => r.context_chars);
  const tokens = rows.map((r) => r.tokens_est);

  return {
    router_mode: opts.routerMode ?? "keyword",
    questions: rows.length,
    zero_context: zeroContext,
    mean_context_chars: mean(chars),
    mean_tokens_est: mean(tokens),
    min_tokens_est: Math.min(...tokens),
    max_tokens_est: Math.max(...tokens),
    rows,
  };
}

export function formatDryRunReport(result) {
  const lines = [
    `Dry-run (Condition B): ${result.questions} questions`,
    `  router: ${result.router_mode}`,
    `  mean context: ${result.mean_context_chars.toFixed(0)} chars · ~${result.mean_tokens_est.toFixed(0)} tokens`,
    `  range: ~${result.min_tokens_est}–${result.max_tokens_est} tokens`,
  ];
  if (result.zero_context > 0) {
    lines.push(`  warn: ${result.zero_context} questions with 0 context chars`);
  }
  return lines.join("\n");
}
