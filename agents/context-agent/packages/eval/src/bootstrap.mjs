/** Bootstrap 95% CI on paired accuracy deltas (B vs A, optional C vs A) */
import fs from "node:fs";

const DEFAULT_ITERATIONS = 10_000;
const DEFAULT_SEED = 42;

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
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sorted, p) {
  if (sorted.length === 0) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function bootstrapDeltas(rows, metric, iterations = DEFAULT_ITERATIONS, seed = DEFAULT_SEED) {
  const deltas = rows.map((r) => num(r[metric])).filter((v) => v !== null);
  if (deltas.length === 0) {
    throw new Error(`No numeric values for metric: ${metric}`);
  }

  const rand = mulberry32(seed);
  const samples = [];
  const n = deltas.length;

  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const idx = Math.floor(rand() * n);
      sum += deltas[idx];
    }
    samples.push(sum / n);
  }

  samples.sort((a, b) => a - b);
  const observed = mean(deltas);

  return {
    metric,
    n_questions: n,
    iterations,
    seed,
    observed_mean_delta: observed,
    ci_95: {
      low: percentile(samples, 0.025),
      median: percentile(samples, 0.5),
      high: percentile(samples, 0.975),
    },
    bootstrap_win_rate_delta_gt_0: samples.filter((s) => s > 0).length / iterations,
    bootstrap_win_rate_delta_gte_0: samples.filter((s) => s >= 0).length / iterations,
    questions_b_beat_a: deltas.filter((d) => d > 0).length,
    questions_tie: deltas.filter((d) => d === 0).length,
    questions_b_lose: deltas.filter((d) => d < 0).length,
  };
}

/**
 * @param {string} pairedPath
 * @param {{ iterations?: number, seed?: number, metric?: string }} [opts]
 */
export function runBootstrap(pairedPath, opts = {}) {
  const rows = readCsv(pairedPath);
  const metric = opts.metric ?? "accuracy_delta_b_vs_a";
  const iterations = opts.iterations ?? DEFAULT_ITERATIONS;
  const seed = opts.seed ?? DEFAULT_SEED;

  const result = {
    paired_csv: pairedPath,
    generated_at: new Date().toISOString(),
    b_vs_a: bootstrapDeltas(rows, metric, iterations, seed),
  };

  if (rows[0]?.accuracy_delta_c_vs_a !== undefined) {
    result.c_vs_a = bootstrapDeltas(rows, "accuracy_delta_c_vs_a", iterations, seed + 1);
  }

  return result;
}

export function formatBootstrapReport(result) {
  const b = result.b_vs_a;
  const lines = [
    `Bootstrap CI (${b.n_questions} questions, ${b.iterations} iterations)`,
    `  ${b.metric}: observed Δ = ${b.observed_mean_delta?.toFixed(3)}`,
    `  95% CI: [${b.ci_95.low?.toFixed(3)}, ${b.ci_95.high?.toFixed(3)}]`,
    `  B beats A: ${b.questions_b_beat_a} · tie: ${b.questions_tie} · lose: ${b.questions_b_lose}`,
  ];
  if (result.c_vs_a) {
    const c = result.c_vs_a;
    lines.push(
      `  C vs A Δ: ${c.observed_mean_delta?.toFixed(3)} · CI [${c.ci_95.low?.toFixed(3)}, ${c.ci_95.high?.toFixed(3)}]`
    );
  }
  return lines.join("\n");
}
