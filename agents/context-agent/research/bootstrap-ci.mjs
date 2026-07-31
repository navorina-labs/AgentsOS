#!/usr/bin/env node
/** Thin CLI wrapper — delegates to @context-os/eval */
import fs from "node:fs";
import path from "node:path";
import { runBootstrap } from "../packages/eval/src/index.mjs";

function parseArgs(argv) {
  const opts = {
    iterations: 10_000,
    seed: 42,
    metric: "accuracy_delta_b_vs_a",
    pairedPath: null,
    outPath: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--iterations" && argv[i + 1]) opts.iterations = Number(argv[++i]);
    else if (a === "--seed" && argv[i + 1]) opts.seed = Number(argv[++i]);
    else if (a === "--metric" && argv[i + 1]) opts.metric = argv[++i];
    else if (a === "--out" && argv[i + 1]) opts.outPath = argv[++i];
    else if (!a.startsWith("-")) opts.pairedPath = a;
  }
  if (!opts.pairedPath) {
    console.error(
      "Usage: node bootstrap-ci.mjs <paired.csv> [--iterations N] [--metric accuracy_delta_b_vs_a] [--out summary.json]"
    );
    process.exit(1);
  }
  return opts;
}

const opts = parseArgs(process.argv);
const pairedPath = path.resolve(opts.pairedPath);
const result = runBootstrap(pairedPath, {
  iterations: opts.iterations,
  seed: opts.seed,
  metric: opts.metric,
});

const json = JSON.stringify(result, null, 2);
console.log(json);

const outPath = opts.outPath ?? path.join(path.dirname(pairedPath), "bootstrap-ci.json");
fs.writeFileSync(outPath, json);
console.error(`Wrote ${outPath}`);
