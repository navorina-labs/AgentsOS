/** Project readiness diagnostics for framework consumers */
import fs from "node:fs";
import path from "node:path";
import { contextOsDir, loadManifest, parseGlobalFlags } from "../lib/paths.mjs";
import {
  validateManifestSchema,
  validateQuestionsBank,
  validateRoutingMap,
} from "../lib/schema-check.mjs";

function parseDoctorArgs(rest) {
  const opts = { json: false, strict: false };
  for (const a of rest) {
    if (a === "--json") opts.json = true;
    else if (a === "--strict") opts.strict = true;
  }
  return opts;
}

function exists(projectRoot, rel) {
  return fs.existsSync(path.join(projectRoot, rel));
}

function readJson(projectRoot, rel, errors) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) {
    errors.push(`${rel}: missing`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${rel}: invalid JSON (${msg})`);
    return null;
  }
}

function checkCoreFiles(projectRoot, manifest, warnings, errors) {
  const groups = [
    ["cores", manifest.cores],
    ["subcores", manifest.subcores],
  ];
  let count = 0;

  for (const [, map] of groups) {
    for (const [id, rel] of Object.entries(map ?? {})) {
      count++;
      if (!rel.endsWith(".md")) warnings.push(`${id}: core path should be .md (${rel})`);
      const full = path.join(projectRoot, rel);
      if (!fs.existsSync(full)) {
        errors.push(`${id}: missing core file ${rel}`);
        continue;
      }
      const text = fs.readFileSync(full, "utf8");
      if (text.includes("{PROJECT_NAME}") || text.includes("{{PROJECT_NAME}}")) {
        warnings.push(`${id}: project placeholder still present`);
      }
      if (text.includes("{Why this core") || text.includes("{Technical and")) {
        warnings.push(`${id}: template sections still look unfilled`);
      }
    }
  }

  return count;
}

export function readinessChecks(projectRoot) {
  const errors = [];
  const warnings = [];
  const info = [];
  const checks = [];

  const cos = contextOsDir(projectRoot);
  if (!fs.existsSync(cos)) {
    errors.push(`context-os/: missing at ${cos}. Run: context-os init`);
    return { ok: false, projectRoot, checks, warnings, errors, info };
  }
  checks.push("context-os/ exists");

  let manifest;
  try {
    manifest = loadManifest(projectRoot);
    checks.push("manifest loaded");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    return { ok: false, projectRoot, checks, warnings, errors, info };
  }

  const manifestCheck = validateManifestSchema(manifest);
  warnings.push(...manifestCheck.warnings);
  errors.push(...manifestCheck.errors);

  const routingMapRel = manifest.routing_map ?? "context-os/router/routing-map.json";
  const routingMap = readJson(projectRoot, routingMapRel, errors);
  if (routingMap) {
    checks.push("routing map loaded");
    const routingCheck = validateRoutingMap(routingMap, manifest);
    warnings.push(...routingCheck.warnings);
    errors.push(...routingCheck.errors);
  }

  const coreCount = checkCoreFiles(projectRoot, manifest, warnings, errors);
  checks.push(`${coreCount} core file(s) referenced`);

  for (const rel of [
    manifest.entry_point,
    manifest.canon,
    manifest.maintenance,
    manifest.router,
  ].filter(Boolean)) {
    if (!exists(projectRoot, rel)) errors.push(`${rel}: missing`);
  }

  const optional = [
    ["eval questions", "context-os/eval/questions.json"],
    ["baseline manifest", "context-os/eval/baseline-manifest.json"],
    ["drift config", "context-os/drift-config.json"],
    ["graph config", "context-os/graph/graph-config.json"],
    ["graph index", "context-os/graph/graph-index.json"],
    ["semantic embeddings", "context-os/router/embeddings.json"],
    ["AGENTS adapter", "AGENTS.md"],
    ["Claude adapter", "CLAUDE.md"],
    ["Copilot adapter", ".github/copilot-instructions.md"],
  ];

  for (const [label, rel] of optional) {
    if (exists(projectRoot, rel)) {
      checks.push(`${label} present`);
      if (rel === "context-os/eval/questions.json") {
        const questions = readJson(projectRoot, rel, errors);
        if (questions) {
          const questionsCheck = validateQuestionsBank(questions, manifest);
          warnings.push(...questionsCheck.warnings);
          errors.push(...questionsCheck.errors);
        }
      }
    } else {
      info.push(`${label} not found (${rel})`);
    }
  }

  return {
    ok: errors.length === 0,
    projectRoot,
    project: manifest.project ?? null,
    checks,
    warnings,
    errors,
    info,
  };
}

export async function cmdDoctor(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = parseDoctorArgs(rest);
  const report = readinessChecks(global.root);

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Context OS doctor: ${report.ok ? "OK" : "FAILED"}`);
    console.log(`  root: ${report.projectRoot}`);
    if (report.project) console.log(`  project: ${report.project}`);

    for (const check of report.checks) console.log(`  ok: ${check}`);
    for (const item of report.info) console.log(`  info: ${item}`);
    for (const warning of report.warnings) console.log(`  warn: ${warning}`);
    for (const error of report.errors) console.error(`  error: ${error}`);
  }

  if (!report.ok || (opts.strict && report.warnings.length > 0)) {
    process.exitCode = 1;
  }
}
