/** Static routing diagnostics independent of routing eval expectations */
import fs from "node:fs";
import path from "node:path";
import { parseGlobalFlags, routingMapPath } from "../lib/paths.mjs";
import { patternMatches } from "../lib/router.mjs";

const GENERIC_PATTERNS = new Set([
  "change",
  "data",
  "error",
  "help",
  "issue",
  "project",
  "system",
  "update",
  "user",
]);
const SAFE_SHORT_PATTERNS = new Set(["ai", "ci", "db", "qa", "ui"]);

function coreKey(cores) {
  return [...new Set(cores ?? [])].sort().join(",");
}

function readQuestions(projectRoot, questionsRel, warnings) {
  const full = path.isAbsolute(questionsRel) ? questionsRel : path.join(projectRoot, questionsRel);
  if (!fs.existsSync(full)) {
    warnings.push(`question bank not found: ${full}`);
    return [];
  }
  try {
    const bank = JSON.parse(fs.readFileSync(full, "utf8"));
    return Array.isArray(bank) ? bank : bank.questions ?? [];
  } catch (err) {
    warnings.push(`cannot read question bank: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

export function buildRoutingLintReport(
  projectRoot,
  { questions = "context-os/eval/questions.json" } = {}
) {
  const errors = [];
  const warnings = [];
  let map;

  try {
    map = JSON.parse(fs.readFileSync(routingMapPath(projectRoot), "utf8"));
  } catch (err) {
    errors.push(`cannot read routing map: ${err instanceof Error ? err.message : String(err)}`);
    return { ok: false, routes: 0, patterns: 0, covered_routes: 0, errors, warnings };
  }

  const routes = Array.isArray(map.routes) ? map.routes : [];
  if (!Array.isArray(map.routes)) errors.push("routing map: routes must be an array");

  const seen = new Map();
  let patternCount = 0;
  routes.forEach((route, routeIndex) => {
    for (const raw of route.patterns ?? []) {
      const pattern = String(raw).trim().toLowerCase();
      patternCount++;
      if (pattern.length < 3 && !SAFE_SHORT_PATTERNS.has(pattern)) {
        warnings.push(`route ${routeIndex}: pattern "${raw}" is shorter than 3 characters`);
      }
      if (GENERIC_PATTERNS.has(pattern)) warnings.push(`route ${routeIndex}: pattern "${raw}" is overly generic`);

      const prior = seen.get(pattern);
      if (prior) {
        const currentCores = coreKey(route.cores);
        if (prior.coreKey !== currentCores) {
          errors.push(
            `pattern "${pattern}" conflicts between routes ${prior.routeIndex} [${prior.coreKey}] and ${routeIndex} [${currentCores}]`
          );
        } else {
          warnings.push(`pattern "${pattern}" is duplicated in routes ${prior.routeIndex} and ${routeIndex}`);
        }
      } else {
        seen.set(pattern, { routeIndex, coreKey: coreKey(route.cores) });
      }
    }
  });

  const bank = readQuestions(projectRoot, questions, warnings);
  const covered = new Set();
  for (const q of bank) {
    routes.forEach((route, routeIndex) => {
      if ((route.patterns ?? []).some((pattern) => patternMatches(q.question ?? "", pattern))) {
        covered.add(routeIndex);
      }
    });
  }
  routes.forEach((route, routeIndex) => {
    if (!covered.has(routeIndex)) {
      warnings.push(`route ${routeIndex} [${(route.cores ?? []).join(",")}] has no question-bank coverage`);
    }
  });

  return {
    ok: errors.length === 0,
    routes: routes.length,
    patterns: patternCount,
    covered_routes: covered.size,
    errors,
    warnings,
  };
}

export async function cmdRouting(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0] && !rest[0].startsWith("-") ? rest[0] : "lint";
  if (sub !== "lint") {
    throw new Error("Usage: context-os routing lint [--root dir] [--questions path] [--strict] [--json]");
  }

  let questions = "context-os/eval/questions.json";
  let strict = false;
  let json = false;
  for (let i = 1; i < rest.length; i++) {
    if (rest[i] === "--questions" && rest[i + 1]) questions = rest[++i];
    else if (rest[i] === "--strict") strict = true;
    else if (rest[i] === "--json") json = true;
  }

  const report = buildRoutingLintReport(global.root, { questions });
  const ok = report.ok && (!strict || report.warnings.length === 0);
  const output = { ...report, ok, strict };

  if (json) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(
      `Routing lint: ${ok ? "OK" : "FAILED"} (${report.routes} routes, ${report.patterns} patterns, ${report.covered_routes} covered)`
    );
    for (const warning of report.warnings) console.log(`  warn: ${warning}`);
    for (const error of report.errors) console.error(`  error: ${error}`);
  }
  if (!ok) process.exitCode = 1;
}
