/** Profile registry listing and contract validation */
import fs from "node:fs";
import path from "node:path";
import { PROFILE_DEFS, packageRoot, templateProfileDir } from "../lib/paths.mjs";
import { routeQuestion, routingScores } from "../lib/router.mjs";
import {
  validateManifestSchema,
  validateQuestionsBank,
  validateRoutingMap,
} from "../lib/schema-check.mjs";

function substitute(content, profile) {
  const vars = {
    PROJECT_NAME: `${profile} demo`,
    PROJECT_SLUG: `${profile}-demo`,
    DATE: "2026-01-01",
    PROFILE: profile,
  };
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
    out = out.replaceAll(`{${key}}`, value);
  }
  return out;
}

function readTemplateJson(filePath, profile, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`missing: ${path.relative(packageRoot(), filePath)}`);
    return null;
  }
  try {
    return JSON.parse(substitute(fs.readFileSync(filePath, "utf8"), profile));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${path.relative(packageRoot(), filePath)}: invalid JSON (${msg})`);
    return null;
  }
}

function templatePathForManifestRel(root, rel) {
  if (rel.startsWith("context-os/cores/") || rel.startsWith("context-os/subcores/")) {
    return path.join(root, rel.replace(/^context-os\//, "").replace(/\.md$/, ".template.md"));
  }
  return path.join(root, rel.replace(/^context-os\//, ""));
}

export function validateProfile(name) {
  const errors = [];
  const warnings = [];
  const root = templateProfileDir(name);

  if (!fs.existsSync(root)) {
    errors.push(`template directory missing: ${path.relative(packageRoot(), root)}`);
    return { name, ok: false, errors, warnings, routes: 0, questions: 0 };
  }

  const manifest = readTemplateJson(path.join(root, "manifest.json"), name, errors);
  const routingMap = readTemplateJson(path.join(root, "router", "routing-map.json"), name, errors);
  const questions = readTemplateJson(path.join(root, "eval", "questions.stub.json"), name, errors);

  if (manifest) {
    const check = validateManifestSchema(manifest);
    warnings.push(...check.warnings);
    errors.push(...check.errors);

    for (const [coreId, rel] of Object.entries({
      ...(manifest.cores ?? {}),
      ...(manifest.subcores ?? {}),
    })) {
      const corePath = templatePathForManifestRel(root, rel);
      if (!fs.existsSync(corePath)) {
        errors.push(`${coreId}: missing template for ${rel}`);
      }
    }

    for (const rel of [manifest.entry_point, manifest.canon, manifest.maintenance, manifest.router].filter(Boolean)) {
      const p = templatePathForManifestRel(root, rel);
      if (!fs.existsSync(p)) errors.push(`missing: ${rel}`);
    }
  }

  if (manifest && routingMap) {
    const check = validateRoutingMap(routingMap, manifest);
    warnings.push(...check.warnings);
    errors.push(...check.errors);
  }

  if (manifest && questions) {
    const check = validateQuestionsBank(questions, manifest);
    warnings.push(...check.warnings);
    errors.push(...check.errors);
  }

  const list = Array.isArray(questions) ? questions : questions?.questions ?? [];
  if (routingMap && list.length) {
    for (const q of list) {
      const expected = q.expected_cores ?? [];
      const actual = routeQuestion(q.question, routingMap);
      const score = routingScores(expected, actual);
      if (score.f1 < 1) {
        errors.push(
          `${q.id ?? q.question_id}: expected [${expected.join(",")}] got [${actual.join(",")}]`
        );
      }
    }
  }

  return {
    name,
    ok: errors.length === 0,
    errors,
    warnings,
    routes: routingMap?.routes?.length ?? 0,
    questions: list.length,
  };
}

function printProfiles() {
  for (const [name, def] of Object.entries(PROFILE_DEFS)) {
    console.log(`${name}\t${def.description}`);
  }
}

function parseArgs(argv) {
  const sub = argv[0] && !argv[0].startsWith("-") ? argv[0] : "list";
  return {
    sub,
    json: argv.includes("--json"),
    strict: argv.includes("--strict"),
  };
}

export async function cmdProfiles(argv) {
  const opts = parseArgs(argv);

  if (opts.sub === "list") {
    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            ok: true,
            profiles: Object.entries(PROFILE_DEFS).map(([name, def]) => ({
              name,
              description: def.description,
            })),
          },
          null,
          2
        )
      );
    } else {
      printProfiles();
    }
    return;
  }

  if (opts.sub !== "validate") {
    throw new Error("Usage: context-os profiles [list|validate] [--json] [--strict]");
  }

  const { ok, profiles: reports } = validateAllProfiles({ strict: opts.strict });

  if (opts.json) {
    console.log(JSON.stringify({ ok, profiles: reports }, null, 2));
  } else {
    console.log(`Profile validation: ${ok ? "OK" : "FAILED"}`);
    for (const report of reports) {
      console.log(`  ${report.ok ? "ok" : "fail"}: ${report.name} (${report.routes} routes, ${report.questions} questions)`);
      for (const warning of report.warnings) console.log(`    warn: ${warning}`);
      for (const error of report.errors) console.error(`    error: ${error}`);
    }
  }

  if (!ok) process.exitCode = 1;
}

export function validateAllProfiles({ strict = false } = {}) {
  const reports = Object.keys(PROFILE_DEFS).map(validateProfile);
  const ok = reports.every((r) => r.ok) && (!strict || reports.every((r) => r.warnings.length === 0));
  return { ok, profiles: reports };
}
