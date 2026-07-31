/** Aggregate paired.csv into summary metrics (no LLM) */
import fs from "node:fs";

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function mean(vals) {
  const ok = vals.filter((v) => v !== null);
  return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : null;
}

function rate(rows, field) {
  const vals = rows.map((r) => r[field]).filter((v) => v !== "");
  if (!vals.length) return null;
  const truthy = vals.filter((v) => v === "1" || v === "true" || v === "yes").length;
  return truthy / vals.length;
}

/**
 * @param {string} pairedPath
 */
export function aggregatePaired(pairedPath) {
  const rows = readCsv(pairedPath);
  const byCond = { A: [], B: [], C: [], D: [] };

  for (const row of rows) {
    const c = row.condition?.toUpperCase();
    if (byCond[c]) byCond[c].push(row);
  }

  const summary = {
    paired_csv: pairedPath,
    paired_questions: new Set(rows.map((r) => r.question_id)).size,
    generated_at: new Date().toISOString(),
  };

  for (const [cond, condRows] of Object.entries(byCond)) {
    if (!condRows.length) continue;
    const prefix = cond.toLowerCase();
    summary[`mean_accuracy_${prefix}`] = mean(condRows.map((r) => num(r.accuracy)));
    summary[`mean_tokens_in_${prefix}`] = mean(condRows.map((r) => num(r.tokens_in)));
    summary[`mean_context_chars_${prefix}`] = mean(condRows.map((r) => num(r.context_chars)));
    summary[`hallucination_rate_${prefix}`] = rate(condRows, "hallucination");
    summary[`mean_latency_ms_${prefix}`] = mean(condRows.map((r) => num(r.latency_ms)));
  }

  const tokA = summary.mean_tokens_in_a;
  const tokB = summary.mean_tokens_in_b;
  if (tokA && tokB && tokB > 0) {
    summary.ccr_tokens_b_vs_a = tokA / tokB;
  }

  const accA = summary.mean_accuracy_a;
  const accB = summary.mean_accuracy_b;
  if (accA !== null && accB !== null) {
    summary.mean_accuracy_delta_b_vs_a = accB - accA;
    summary.hypothesis_supported = accB > accA;
  }

  return summary;
}
