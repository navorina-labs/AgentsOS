/** Generate consumer CI workflow for Context OS checks */
import fs from "node:fs";
import path from "node:path";
import { parseGlobalFlags } from "../lib/paths.mjs";

function parseCiArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = {
    ...global,
    sub: rest[0] && !rest[0].startsWith("-") ? rest[0] : "help",
    minScore: 75,
    force: false,
    dryRun: false,
    packageRunner: "npx context-os",
  };

  for (let i = 1; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--min-score" && rest[i + 1]) opts.minScore = Number(rest[++i]);
    else if (a === "--package-runner" && rest[i + 1]) opts.packageRunner = rest[++i];
    else if (a === "--force") opts.force = true;
    else if (a === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function workflowYaml(opts) {
  const cmd = `${opts.packageRunner} check --min-score ${opts.minScore}`;
  return `name: Context OS

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: ${cmd}
      - run: ${opts.packageRunner} drift check --base origin/main --strict
      - run: ${opts.packageRunner} cores verify --base origin/main
      - run: ${opts.packageRunner} contracts verify --base origin/main
`;
}

function printHelp() {
  console.log(`context-os ci — generate CI integration

Usage:
  context-os ci init [options]

Options:
  --root <dir>              Project root (default: cwd)
  --min-score <n>           Minimum core score for context-os check (default: 75)
  --package-runner <cmd>    Command prefix (default: npx context-os)
  --force                   Overwrite existing .github/workflows/context-os.yml
  --dry-run                 Print workflow without writing

Examples:
  context-os ci init
  context-os ci init --min-score 85
  context-os ci init --package-runner "npm run context-os --"
`);
}

export async function cmdCi(argv) {
  const opts = parseCiArgs(argv);

  if (opts.sub === "help" || opts.sub === "--help" || opts.sub === "-h") {
    printHelp();
    return;
  }
  if (opts.sub !== "init") {
    throw new Error("Usage: context-os ci init [--min-score N] [--force] [--dry-run]");
  }

  const content = workflowYaml(opts);
  const rel = ".github/workflows/context-os.yml";
  const outPath = path.join(opts.root, rel);

  if (opts.dryRun) {
    console.log(content);
    return;
  }

  if (fs.existsSync(outPath) && !opts.force) {
    throw new Error(`${outPath} exists. Use --force to overwrite.`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log(`Wrote ${rel}`);
}
