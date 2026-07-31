/** Unified framework gate for local and CI usage */
import fs from "node:fs";
import path from "node:path";
import { dryRunEval } from "@context-os/eval";
import { readinessChecks } from "./doctor.mjs";
import { buildScoreReport } from "./score.mjs";
import { validateAllProfiles } from "./profiles.mjs";
import { buildRoutingLintReport } from "./routing.mjs";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";
import { loadRoutingMap, routeQuestion, routingScores } from "../lib/router.mjs";

function parseCheckArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = {
    ...global,
    json: false,
    minScore: 75,
    skipEval: false,
    skipProfiles: false,
    questions: "context-os/eval/questions.json",
    maxRouteTokens: 2000,
  };

  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--json") opts.json = true;
    else if (a === "--skip-eval") opts.skipEval = true;
    else if (a === "--skip-profiles") opts.skipProfiles = true;
    else if (a === "--min-score" && rest[i + 1]) opts.minScore = Number(rest[++i]);
    else if (a === "--max-route-tokens" && rest[i + 1]) opts.maxRouteTokens = Number(rest[++i]);
    else if (a === "--questions" && rest[i + 1]) opts.questions = rest[++i];
  }
  if (!Number.isFinite(opts.maxRouteTokens) || opts.maxRouteTokens <= 0) {
    throw new Error("--max-route-tokens must be a positive number");
  }
  return opts;
}

export function evalRouteReport(projectRoot, questionsRel) {
  const qPath = path.isAbsolute(questionsRel) ? questionsRel : path.join(projectRoot, questionsRel);
  if (!fs.existsSync(qPath)) {
    return {
      ok: false,
      skipped: true,
      reason: `questions file not found: ${qPath}`,
      questions: 0,
      mean_f1: null,
      failures: [],
    };
  }

  const bank = JSON.parse(fs.readFileSync(qPath, "utf8"));
  const questions = Array.isArray(bank) ? bank : bank.questions ?? [];
  const map = loadRoutingMap(projectRoot);
  const failures = [];
  let f1Sum = 0;

  for (const q of questions) {
    const expected = q.expected_cores ?? [];
    const actual = routeQuestion(q.question, map);
    const score = routingScores(expected, actual);
    f1Sum += score.f1;
    if (score.f1 < 1) {
      failures.push({
        id: q.id ?? q.question_id,
        expected,
        actual,
        f1: Number(score.f1.toFixed(3)),
      });
    }
  }

  return {
    ok: questions.length > 0 && failures.length === 0,
    skipped: false,
    questions: questions.length,
    mean_f1: questions.length ? Number((f1Sum / questions.length).toFixed(3)) : 0,
    failures,
  };
}

export async function evalDryRunReport(projectRoot, questionsRel, maxRouteTokens = Infinity) {
  const qPath = path.isAbsolute(questionsRel) ? questionsRel : path.join(projectRoot, questionsRel);
  if (!fs.existsSync(qPath)) {
    return {
      ok: false,
      skipped: true,
      reason: `questions file not found: ${qPath}`,
    };
  }

  const manifest = loadManifest(projectRoot);
  const routingMap = loadRoutingMap(projectRoot);
  const result = await dryRunEval({
    projectRoot,
    manifest,
    routingMap,
    questionsPath: qPath,
    routeQuestion,
    routerMode: "keyword",
  });
  const overBudget = result.rows
    .filter((row) => row.tokens_est > maxRouteTokens)
    .map((row) => ({
      id: row.id,
      routed_cores: row.routed_cores,
      tokens_est: row.tokens_est,
      over_by: row.tokens_est - maxRouteTokens,
    }));

  return {
    ok: result.questions > 0 && result.zero_context === 0 && overBudget.length === 0,
    skipped: false,
    max_route_tokens: Number.isFinite(maxRouteTokens) ? maxRouteTokens : null,
    over_budget: overBudget,
    summary: result,
  };
}

function printSection(name, status) {
  console.log(`  ${status ? "ok" : "fail"}: ${name}`);
}

export async function cmdCheck(argv) {
  const opts = parseCheckArgs(argv);
  const doctor = readinessChecks(opts.root);
  const score = buildScoreReport(opts.root, opts.minScore);
  const profiles = opts.skipProfiles
    ? { ok: true, skipped: true, profiles: [] }
    : validateAllProfiles();
  const routingLint = buildRoutingLintReport(opts.root, { questions: opts.questions });

  let route = { ok: true, skipped: true };
  let dryRun = { ok: true, skipped: true };
  if (!opts.skipEval) {
    route = evalRouteReport(opts.root, opts.questions);
    dryRun = await evalDryRunReport(opts.root, opts.questions, opts.maxRouteTokens);
  }

  const ok = doctor.ok && score.ok && profiles.ok && routingLint.ok && route.ok && dryRun.ok;
  const report = {
    ok,
    root: opts.root,
    min_score: opts.minScore,
    max_route_tokens: opts.maxRouteTokens,
    doctor,
    score,
    profiles,
    routing_lint: routingLint,
    eval_route: route,
    eval_dry_run: dryRun,
  };

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Context OS check: ${ok ? "OK" : "FAILED"}`);
    printSection("doctor", doctor.ok);
    printSection(`score mean ${score.mean_score}/100 min ${opts.minScore}`, score.ok);
    printSection("profiles", profiles.ok);
    printSection(
      `routing lint ${routingLint.covered_routes}/${routingLint.routes} routes covered`,
      routingLint.ok
    );
    if (opts.skipEval) {
      console.log("  skip: eval route/dry-run");
    } else {
      printSection(`eval route F1 ${route.mean_f1 ?? "n/a"}`, route.ok);
      printSection(
        dryRun.skipped
          ? "eval dry-run skipped"
          : `eval dry-run max ~${dryRun.summary.max_tokens_est}/${opts.maxRouteTokens} tokens`,
        dryRun.ok
      );
    }

    if (!doctor.ok) for (const e of doctor.errors) console.error(`    doctor: ${e}`);
    for (const core of score.cores.filter((core) => core.score < opts.minScore)) {
      console.error(`    score: ${core.id} ${core.score}/100 below ${opts.minScore}`);
    }
    for (const error of score.architecture.errors) {
      console.error(`    architecture: ${error}`);
    }
    for (const error of routingLint.errors) console.error(`    routing lint: ${error}`);
    for (const warning of routingLint.warnings) console.log(`    routing warn: ${warning}`);
    if (route.failures?.length) {
      for (const failure of route.failures.slice(0, 10)) {
        console.error(
          `    route: ${failure.id} expected [${failure.expected}] got [${failure.actual}]`
        );
      }
    }
    if (dryRun.summary?.zero_context > 0) {
      console.error(`    dry-run: ${dryRun.summary.zero_context} zero-context question(s)`);
    }
    for (const row of dryRun.over_budget ?? []) {
      console.error(
        `    budget: ${row.id} ~${row.tokens_est} tokens exceeds ${opts.maxRouteTokens} via [${row.routed_cores}]`
      );
    }
  }

  if (!ok) process.exitCode = 1;
}
