/** Drift CI — detect stale cores when referenced source files change */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { runDriftCheck, formatDriftReport } from "@context-os/eval";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";

function parseDriftArgs(rest) {
  const opts = { base: null, head: "HEAD", strict: false, json: false, files: null };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--base" && rest[i + 1]) opts.base = rest[++i];
    else if (a === "--head" && rest[i + 1]) opts.head = rest[++i];
    else if (a === "--files" && rest[i + 1]) opts.files = rest[++i].split(",");
    else if (a === "--strict") opts.strict = true;
    else if (a === "--json") opts.json = true;
  }
  return opts;
}

export async function cmdDrift(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0];

  if (sub === "check" || !sub) {
    await driftCheck(global.root, rest.slice(1));
    return;
  }

  console.log(`context-os drift — core freshness vs git changes

Subcommands:
  check    Compare git diff to core Sources references

Options:
  --base REF       Git base (e.g. origin/main, main)
  --head REF       Git head (default: HEAD)
  --files a,b,c    Manual changed-file list (no git)
  --strict         Exit 1 on errors
  --json           JSON report

Examples:
  context-os drift check --base origin/main --strict
  context-os drift check --files src/api/billing.ts,src/core.ts

Add context-os/drift-config.json for path → core mapping (see template).
`);
}

async function driftCheck(projectRoot, restArgv) {
  const opts = parseDriftArgs(restArgv);
  const manifest = loadManifest(projectRoot);

  if (!opts.base && !opts.files) {
    opts.base = detectDefaultBase(projectRoot);
  }

  const result = runDriftCheck({
    projectRoot,
    manifest,
    base: opts.base,
    head: opts.head,
    files: opts.files,
  });

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatDriftReport(result));
    if (opts.base) {
      console.log(`  base: ${opts.base}...${opts.head}`);
    }
  }

  const reportPath = path.join(projectRoot, "context-os/drift-report.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ ...result, generated_at: new Date().toISOString() }, null, 2));

  if (opts.strict && !result.ok) {
    process.exitCode = 1;
  }
}

function detectDefaultBase(projectRoot) {
  try {
    execSync("git rev-parse --verify origin/main", { cwd: projectRoot, stdio: "ignore" });
    return "origin/main";
  } catch {
    return "main";
  }
}
