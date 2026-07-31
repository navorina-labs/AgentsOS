#!/usr/bin/env node
/** CLI: aggregate results.json → paired.csv + summary.json */
import path from "node:path";
import fs from "node:fs";
import { aggregateResults } from "../src/aggregate-results.mjs";

function parseArgs(argv) {
  let resultsDir = null;
  for (let i = 2; i < argv.length; i++) {
    if (!argv[i].startsWith("-")) resultsDir = argv[i];
  }
  return { resultsDir };
}

const { resultsDir } = parseArgs(process.argv);
if (!resultsDir) {
  console.error("Usage: context-os-eval aggregate <results-dir>");
  process.exit(1);
}

const resolved = path.resolve(resultsDir);
if (!fs.existsSync(resolved)) {
  console.error(`Not found: ${resolved}`);
  process.exit(1);
}

const agg = aggregateResults(resolved);
console.log(JSON.stringify(agg.summary, null, 2));
console.log(`Wrote ${agg.pairedPath}, ${agg.summaryPath}, ${agg.mdPath}`);
