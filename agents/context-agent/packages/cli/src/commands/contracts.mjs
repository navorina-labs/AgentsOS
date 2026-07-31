/** Verify manifest, routing, and eval bank evolve as one contract */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parseGlobalFlags } from "../lib/paths.mjs";

const CONTRACT_PATHS = {
  manifest: "context-os/manifest.json",
  routing: "context-os/router/routing-map.json",
  questions: "context-os/eval/questions.json",
};

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonical(value[key])])
    );
  }
  return value;
}

function sameJson(a, b) {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

function coreIds(manifest) {
  return new Set([
    ...Object.keys(manifest?.cores ?? {}),
    ...Object.keys(manifest?.subcores ?? {}),
  ]);
}

function routingCoreIds(routing) {
  const ids = new Set();
  if (routing?.fallback_core) ids.add(routing.fallback_core);
  for (const route of routing?.routes ?? []) {
    for (const id of route.cores ?? []) ids.add(id);
  }
  return ids;
}

function questionCoreIds(bank) {
  const ids = new Set();
  const questions = Array.isArray(bank) ? bank : bank?.questions ?? [];
  for (const question of questions) {
    for (const id of question.expected_cores ?? []) ids.add(id);
  }
  return ids;
}

function difference(a, b) {
  return [...a].filter((item) => !b.has(item)).sort();
}

export function verifyContractEvolution(previous, current) {
  const errors = [];
  if (!previous?.manifest) {
    return {
      ok: true,
      bootstrap: true,
      changes: { manifest: true, routing: true, questions: true },
      added_cores: [...coreIds(current.manifest)].sort(),
      removed_cores: [],
      errors,
    };
  }

  const priorIds = coreIds(previous.manifest);
  const currentIds = coreIds(current.manifest);
  const added = difference(currentIds, priorIds);
  const removed = difference(priorIds, currentIds);
  const changes = {
    manifest: !sameJson(previous.manifest, current.manifest),
    routing: !sameJson(previous.routing, current.routing),
    questions: !sameJson(previous.questions, current.questions),
  };

  if (changes.routing && !changes.questions) {
    errors.push("routing changed without updating the question bank");
  }
  if ((added.length || removed.length) && !changes.routing) {
    errors.push("manifest core ids changed without updating routing");
  }
  if ((added.length || removed.length) && !changes.questions) {
    errors.push("manifest core ids changed without updating the question bank");
  }

  const routed = routingCoreIds(current.routing);
  const expected = questionCoreIds(current.questions);
  for (const id of added) {
    if (!routed.has(id)) errors.push(`added core is unreachable: ${id}`);
    if (!expected.has(id)) errors.push(`added core has no expected eval question: ${id}`);
  }
  for (const id of removed) {
    if (routed.has(id)) errors.push(`removed core remains in routing: ${id}`);
    if (expected.has(id)) errors.push(`removed core remains in question bank: ${id}`);
  }
  for (const id of routed) {
    if (!currentIds.has(id)) errors.push(`routing references undeclared core: ${id}`);
  }
  for (const id of expected) {
    if (!currentIds.has(id)) errors.push(`question bank references undeclared core: ${id}`);
  }

  return {
    ok: errors.length === 0,
    bootstrap: false,
    changes,
    added_cores: added,
    removed_cores: removed,
    errors,
  };
}

function git(projectRoot, args, quiet = false) {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: quiet ? ["ignore", "pipe", "ignore"] : ["ignore", "pipe", "pipe"],
  }).trim();
}

function readCurrent(projectRoot, rel) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) throw new Error(`contract file not found: ${rel}`);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function readPrevious(projectRoot, base, gitPath) {
  try {
    return JSON.parse(git(projectRoot, ["show", `${base}:${gitPath}`], true));
  } catch {
    return null;
  }
}

export function buildContractEvolutionReport(projectRoot, base) {
  try {
    git(projectRoot, ["rev-parse", "--verify", base], true);
  } catch {
    throw new Error(`git base not found: ${base}`);
  }

  const gitRoot = git(projectRoot, ["rev-parse", "--show-toplevel"]);
  const prefix = path.relative(gitRoot, projectRoot);
  const current = {};
  const previous = {};

  for (const [key, rel] of Object.entries(CONTRACT_PATHS)) {
    current[key] = readCurrent(projectRoot, rel);
    const gitPath = path.join(prefix, rel).split(path.sep).join("/");
    previous[key] = readPrevious(projectRoot, base, gitPath);
  }

  return { base, ...verifyContractEvolution(previous, current) };
}

export async function cmdContracts(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0] && !rest[0].startsWith("-") ? rest[0] : "verify";
  if (sub !== "verify") {
    throw new Error("Usage: context-os contracts verify --base <git-ref> [--json]");
  }

  let base = null;
  let json = false;
  for (let i = 1; i < rest.length; i++) {
    if (rest[i] === "--base" && rest[i + 1]) base = rest[++i];
    else if (rest[i] === "--json") json = true;
  }
  if (!base) throw new Error("context-os contracts verify requires --base <git-ref>");

  const report = buildContractEvolutionReport(global.root, base);
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const changed = Object.entries(report.changes)
      .filter(([, value]) => value)
      .map(([key]) => key);
    console.log(
      `Contract evolution: ${report.ok ? "OK" : "FAILED"}${report.bootstrap ? " (bootstrap)" : ""}`
    );
    console.log(`  changed: ${changed.join(", ") || "none"}`);
    if (report.added_cores.length) console.log(`  added cores: ${report.added_cores.join(", ")}`);
    if (report.removed_cores.length) console.log(`  removed cores: ${report.removed_cores.join(", ")}`);
    for (const error of report.errors) console.error(`  error: ${error}`);
  }
  if (!report.ok) process.exitCode = 1;
}
