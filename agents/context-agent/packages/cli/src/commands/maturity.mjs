/** Assess cumulative Context OS adoption maturity */
import fs from "node:fs";
import path from "node:path";
import { readinessChecks } from "./doctor.mjs";
import { evalDryRunReport, evalRouteReport } from "./check.mjs";
import { buildScoreReport } from "./score.mjs";
import { parseGlobalFlags } from "../lib/paths.mjs";

export const MATURITY_LEVELS = [
  { id: "absent", rank: 0, label: "Absent" },
  { id: "scaffold", rank: 1, label: "Scaffold" },
  { id: "structured", rank: 2, label: "Structured" },
  { id: "routable", rank: 3, label: "Routable" },
  { id: "verified", rank: 4, label: "Verified" },
  { id: "operational", rank: 5, label: "Operational" },
];

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function levelById(id) {
  return MATURITY_LEVELS.find((level) => level.id === id);
}

function parseArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = { ...global, json: false, min: null };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "--json") opts.json = true;
    else if (rest[i] === "--min" && rest[i + 1]) opts.min = rest[++i].toLowerCase();
  }
  if (opts.min && !levelById(opts.min)) {
    throw new Error(`Unknown maturity level: ${opts.min}. Use: ${MATURITY_LEVELS.map((x) => x.id).join("|")}`);
  }
  return opts;
}

export async function buildMaturityReport(projectRoot) {
  const questions = "context-os/eval/questions.json";
  const criteria = [];
  const nextActions = [];
  const doctor = readinessChecks(projectRoot);

  criteria.push({
    level: "scaffold",
    ok: doctor.ok,
    evidence: doctor.ok ? `${doctor.checks.length} readiness checks passed` : doctor.errors[0],
  });

  if (!doctor.ok) {
    nextActions.push("Run context-os init, then resolve context-os doctor errors.");
    return {
      level: levelById("absent"),
      criteria,
      next_actions: nextActions,
      metrics: {},
    };
  }

  const score50 = buildScoreReport(projectRoot, 50);
  const structured = score50.ok;
  criteria.push({
    level: "structured",
    ok: structured,
    evidence: `mean score ${score50.mean_score}; architecture ${score50.architecture.ok ? "valid" : "invalid"}`,
  });
  if (!structured) {
    nextActions.push("Raise every core to score 50 and resolve architecture errors.");
  }

  const route = evalRouteReport(projectRoot, questions);
  const routable = structured && route.ok && !route.skipped && route.questions >= 3;
  criteria.push({
    level: "routable",
    ok: routable,
    evidence: route.skipped
      ? route.reason
      : `${route.questions} questions; routing F1 ${route.mean_f1}`,
  });
  if (structured && !routable) {
    nextActions.push("Add at least 3 eval questions and reach routing F1 1.0.");
  }

  const score75 = buildScoreReport(projectRoot, 75);
  const dryRun = await evalDryRunReport(projectRoot, questions, 2000);
  const hasBaseline = exists(projectRoot, "context-os/eval/baseline-manifest.json");
  const verified = routable && score75.ok && dryRun.ok && !dryRun.skipped && hasBaseline;
  criteria.push({
    level: "verified",
    ok: verified,
    evidence: `all cores >=75: ${score75.ok}; route budget <=2000: ${dryRun.ok}; baseline: ${hasBaseline}`,
  });
  if (routable && !verified) {
    const gaps = [];
    if (!score75.ok) gaps.push("raise every core to score 75");
    if (!dryRun.ok || dryRun.skipped) gaps.push("eliminate zero-context and over-budget eval cases");
    if (!hasBaseline) gaps.push("record a baseline manifest");
    nextActions.push(`${gaps.join(", ")}.`);
  }

  const hasDrift = exists(projectRoot, "context-os/drift-config.json");
  const hasCi =
    exists(projectRoot, ".github/workflows/context-os.yml") ||
    exists(projectRoot, ".gitlab-ci.yml");
  const operational = verified && hasDrift && hasCi;
  criteria.push({
    level: "operational",
    ok: operational,
    evidence: `drift config: ${hasDrift}; CI gate: ${hasCi}`,
  });
  if (verified && !operational) {
    const gaps = [];
    if (!hasDrift) gaps.push("configure drift detection");
    if (!hasCi) gaps.push("install context-os check in CI");
    nextActions.push(`${gaps.join(" and ")}.`);
  }

  const achieved = [...criteria].reverse().find((item) => item.ok)?.level ?? "absent";
  return {
    level: levelById(achieved),
    criteria,
    next_actions: nextActions.slice(0, 1),
    metrics: {
      mean_score: score75.mean_score,
      routing_f1: route.mean_f1,
      eval_questions: route.questions,
      zero_context: dryRun.summary?.zero_context ?? null,
    },
  };
}

export async function cmdMaturity(argv) {
  const opts = parseArgs(argv);
  const report = await buildMaturityReport(opts.root);
  const minimum = opts.min ? levelById(opts.min) : null;
  const ok = !minimum || report.level.rank >= minimum.rank;
  const output = { ...report, ok, minimum: minimum?.id ?? null, root: opts.root };

  if (opts.json) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(`Context OS maturity: ${report.level.label} (${report.level.rank}/5)`);
    for (const item of report.criteria) {
      console.log(`  ${item.ok ? "ok" : "next"}: ${item.level} - ${item.evidence}`);
    }
    for (const action of report.next_actions) console.log(`  action: ${action}`);
    if (minimum) console.log(`  gate: ${ok ? "passed" : "failed"} (minimum ${minimum.id})`);
  }

  if (!ok) process.exitCode = 1;
}
