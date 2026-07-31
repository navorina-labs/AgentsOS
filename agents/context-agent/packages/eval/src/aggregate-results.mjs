/** Aggregate results.json → paired.csv + summary.json + SUMMARY.md */
import fs from "node:fs";
import path from "node:path";
import { readCsv, writeCsv } from "./csv.mjs";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function mean(vals) {
  const xs = vals.filter((v) => v !== null && v !== undefined);
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function pct(n) {
  if (n === null || n === undefined) return "—";
  return `${(n * 100).toFixed(1)}%`;
}

function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return typeof n === "number" ? n.toFixed(3) : String(n);
}

function rowMetrics(row) {
  return {
    accuracy: num(row.accuracy),
    latency: num(row.latency_ms),
    tokens_in: num(row.tokens_in),
    context_chars: num(row.context_chars),
    tokens_est: num(row.tokens_in_context_est),
    hallucination: row.hallucination,
  };
}

/**
 * @param {string} resultsDir
 * @returns {{ summary: object, paired: object[], summaryPath: string, pairedPath: string, mdPath: string }}
 */
export function aggregateResults(resultsDir) {
  const jsonPath = path.join(resultsDir, "results.json");
  const csvPath = path.join(resultsDir, "results.csv");

  let rows;
  if (fs.existsSync(jsonPath)) {
    rows = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } else if (fs.existsSync(csvPath)) {
    rows = readCsv(csvPath);
  } else {
    throw new Error(`Missing ${jsonPath} or ${csvPath}`);
  }

  const byQ = new Map();
  for (const row of rows) {
    if (row.error) continue;
    const id = row.question_id;
    if (!byQ.has(id)) byQ.set(id, {});
    byQ.get(id)[row.condition] = row;
  }

  const conditionsPresent = new Set(rows.map((r) => r.condition).filter(Boolean));
  const hasA = conditionsPresent.has("A");
  const hasC = conditionsPresent.has("C");
  const hasD = conditionsPresent.has("D");
  const paired = [];

  for (const [id, pair] of byQ) {
    if (!pair.B) continue;
    if (hasA && !pair.A) continue;
    const a = pair.A ? rowMetrics(pair.A) : null;
    const b = rowMetrics(pair.B);
    const c = pair.C ? rowMetrics(pair.C) : null;
    const d = pair.D ? rowMetrics(pair.D) : null;

    const entry = {
      question_id: id,
      accuracy_a: a?.accuracy ?? null,
      accuracy_b: b.accuracy,
      accuracy_delta_b_vs_a: hasA ? (b.accuracy ?? 0) - (a?.accuracy ?? 0) : null,
      hallucination_a: pair.A?.hallucination ?? null,
      hallucination_b: pair.B.hallucination,
      latency_a: a?.latency ?? null,
      latency_b: b.latency,
      tokens_in_a: a?.tokens_in ?? null,
      tokens_in_b: b.tokens_in,
      context_chars_a: a?.context_chars ?? null,
      context_chars_b: b.context_chars,
      ccr_context_chars_b:
        hasA && b.context_chars > 0 ? a.context_chars / b.context_chars : null,
      ccr_tokens_est_b:
        hasA && b.tokens_est > 0 ? a.tokens_est / b.tokens_est : null,
    };

    if (c) {
      entry.accuracy_c = c.accuracy;
      entry.accuracy_delta_c_vs_a = hasA
        ? (c.accuracy ?? 0) - (a?.accuracy ?? 0)
        : null;
      entry.accuracy_delta_c_vs_b = (c.accuracy ?? 0) - (b.accuracy ?? 0);
      entry.hallucination_c = pair.C.hallucination;
      entry.latency_c = c.latency;
      entry.tokens_in_c = c.tokens_in;
      entry.context_chars_c = c.context_chars;
      entry.ccr_context_chars_c =
        hasA && c.context_chars > 0 ? a.context_chars / c.context_chars : null;
    }

    if (d) {
      entry.accuracy_d = d.accuracy;
      entry.accuracy_delta_d_vs_b = (d.accuracy ?? 0) - (b.accuracy ?? 0);
      entry.hallucination_d = pair.D.hallucination;
      entry.latency_d = d.latency;
      entry.tokens_in_d = d.tokens_in;
      entry.context_chars_d = d.context_chars;
    }

    paired.push(entry);
  }

  const pairedPath = path.join(resultsDir, "paired.csv");
  writeCsv(pairedPath, paired);

  const summary = {
    results_dir: resultsDir,
    paired_questions: paired.length,
    conditions: [...conditionsPresent].sort(),
    mean_accuracy_a: mean(paired.map((p) => p.accuracy_a)),
    mean_accuracy_b: mean(paired.map((p) => p.accuracy_b)),
    mean_accuracy_c: hasC ? mean(paired.map((p) => p.accuracy_c)) : null,
    mean_accuracy_delta_b_vs_a: hasA
      ? mean(paired.map((p) => p.accuracy_delta_b_vs_a))
      : null,
    mean_ccr_context_chars_b: mean(paired.map((p) => p.ccr_context_chars_b)),
    mean_ccr_tokens_est_b: hasA ? mean(paired.map((p) => p.ccr_tokens_est_b)) : null,
    mean_latency_a_ms: mean(paired.map((p) => p.latency_a)),
    mean_latency_b_ms: mean(paired.map((p) => p.latency_b)),
    mean_latency_c_ms: hasC ? mean(paired.map((p) => p.latency_c)) : null,
    mean_tokens_in_a: hasA ? mean(paired.map((p) => p.tokens_in_a)) : null,
    mean_tokens_in_b: mean(paired.map((p) => p.tokens_in_b)),
    mean_tokens_in_c: hasC ? mean(paired.map((p) => p.tokens_in_c)) : null,
    hallucination_rate_a: hasA
      ? paired.filter((p) => String(p.hallucination_a) === "true").length /
        Math.max(paired.length, 1)
      : null,
    hallucination_rate_b:
      paired.filter((p) => String(p.hallucination_b) === "true").length /
      Math.max(paired.length, 1),
    hallucination_rate_c: hasC
      ? paired.filter((p) => String(p.hallucination_c) === "true").length /
        Math.max(paired.length, 1)
      : null,
    hypothesis_supported: hasA
      ? (mean(paired.map((p) => p.accuracy_b)) ?? 0) >
        (mean(paired.map((p) => p.accuracy_a)) ?? 0)
      : null,
  };

  const summaryPath = path.join(resultsDir, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  let md = `# Context OS Eval Summary

- Results: \`${resultsDir}\`
- Paired questions: **${summary.paired_questions}**
- Conditions: **${summary.conditions.join(", ")}**

| Metric | A | B${hasC ? " | C" : ""} |
|--------|---|---${hasC ? "|---" : ""}|
| Mean accuracy | ${fmt(summary.mean_accuracy_a)} | ${fmt(summary.mean_accuracy_b)}${hasC ? ` | ${fmt(summary.mean_accuracy_c)}` : ""} |
| Hallucination | ${pct(summary.hallucination_rate_a)} | ${pct(summary.hallucination_rate_b)}${hasC ? ` | ${pct(summary.hallucination_rate_c)}` : ""} |
| Mean input tokens | ${fmt(summary.mean_tokens_in_a)} | ${fmt(summary.mean_tokens_in_b)}${hasC ? ` | ${fmt(summary.mean_tokens_in_c)}` : ""} |
| CCR vs A (chars) | 1× | ${fmt(summary.mean_ccr_context_chars_b)}×${hasC ? ` | —` : ""} |

**Hypothesis B vs A:** ${summary.hypothesis_supported ? "YES" : "NO"}

See \`paired.csv\` and \`summary.json\`.
`;

  const mdPath = path.join(resultsDir, "SUMMARY.md");
  fs.writeFileSync(mdPath, md);

  return { summary, paired, summaryPath, pairedPath, mdPath };
}
