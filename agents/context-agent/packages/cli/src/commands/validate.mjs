/** Validate manifest paths, core files, and optional schema structure */
import fs from "node:fs";
import path from "node:path";
import { contextOsDir, loadManifest, parseGlobalFlags } from "../lib/paths.mjs";
import {
  validateManifestSchema,
  validateQuestionsBank,
  validateRoutingMap,
} from "../lib/schema-check.mjs";

function checkFile(projectRoot, rel, errors) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) {
    errors.push(`missing: ${rel}`);
    return false;
  }
  return true;
}

function hasFlag(argv, name) {
  return argv.includes(name);
}

function readJsonForSchema(filePath, label, errors) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${label}: invalid JSON (${msg})`);
    return null;
  }
}

export async function cmdValidate(argv) {
  const checkSchema = hasFlag(argv, "--schema");
  const { opts } = parseGlobalFlags(argv);
  const root = opts.root;
  const cos = contextOsDir(root);

  if (!fs.existsSync(cos)) {
    throw new Error(`No context-os/ at ${cos}. Run: context-os init`);
  }

  const manifest = loadManifest(root);
  const errors = [];
  const warnings = [];

  const coreMaps = [
    ["cores", manifest.cores],
    ["subcores", manifest.subcores],
  ];

  for (const [, map] of coreMaps) {
    if (!map) continue;
    for (const [id, rel] of Object.entries(map)) {
      if (!rel.endsWith(".md")) warnings.push(`${id}: path is not .md (${rel})`);
      checkFile(root, rel, errors);
      const text = fs.readFileSync(path.join(root, rel), "utf8");
      if (text.includes("{PROJECT_NAME}") || text.includes("{{PROJECT_NAME}}")) {
        warnings.push(`${id}: still has PROJECT_NAME placeholder`);
      }
      if (text.includes("{Why this core") || text.includes("{Technical and")) {
        warnings.push(`${id}: template sections not filled`);
      }
    }
  }

  for (const key of ["router", "routing_map", "maintenance"]) {
    const rel = manifest[key] ?? manifest[`${key}_path`];
    if (typeof rel === "string") checkFile(root, rel, errors);
  }

  checkFile(root, manifest.router ?? "context-os/router/question-router.md", errors);
  checkFile(root, manifest.routing_map ?? "context-os/router/routing-map.json", errors);

  const routingMap = JSON.parse(
    fs.readFileSync(path.join(root, manifest.routing_map ?? "context-os/router/routing-map.json"), "utf8")
  );
  if (!Array.isArray(routingMap.routes) || routingMap.routes.length === 0) {
    errors.push("routing-map.json: routes[] is empty");
  }

  if (checkSchema) {
    const manifestCheck = validateManifestSchema(manifest);
    const routingCheck = validateRoutingMap(routingMap, manifest);
    const questionsPath = path.join(root, "context-os/eval/questions.json");
    const questions = fs.existsSync(questionsPath)
      ? readJsonForSchema(questionsPath, "questions", errors)
      : null;
    const questionsCheck = questions
      ? validateQuestionsBank(questions, manifest)
      : { warnings: [], errors: [] };
    for (const w of [
      ...manifestCheck.warnings,
      ...routingCheck.warnings,
      ...questionsCheck.warnings,
    ]) {
      warnings.push(`schema: ${w}`);
    }
    for (const e of [
      ...manifestCheck.errors,
      ...routingCheck.errors,
      ...questionsCheck.errors,
    ]) {
      errors.push(`schema: ${e}`);
    }
  }

  console.log(`Validated ${root}${checkSchema ? " (schema)" : ""}`);
  console.log(`  cores: ${Object.keys(manifest.cores ?? {}).length}`);
  console.log(`  subcores: ${Object.keys(manifest.subcores ?? {}).length}`);
  console.log(`  routes: ${routingMap.routes?.length ?? 0}`);

  for (const w of warnings) console.log(`  warn: ${w}`);

  if (errors.length) {
    for (const e of errors) console.error(`  error: ${e}`);
    process.exitCode = 1;
  }
  console.log("OK");
}
