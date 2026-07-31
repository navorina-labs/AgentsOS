/** Generate methodology audit documents for Context OS adoption */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { runDriftCheck } from "@context-os/eval";
import { contextOsDir, loadManifest, packageRoot, parseGlobalFlags } from "../lib/paths.mjs";
import { readinessChecks } from "./doctor.mjs";
import { buildScoreReport } from "./score.mjs";
import { buildRoutingLintReport } from "./routing.mjs";
import { evalDryRunReport, evalRouteReport } from "./check.mjs";
import { buildMaturityReport } from "./maturity.mjs";

const AUDIT_FILES = [
  ["project-map.template.md", "project-map.md"],
  ["cleanup.template.md", "cleanup.md"],
  ["risks.template.md", "risks.md"],
];

function parseAuditArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = {
    ...global,
    sub: rest[0] && !rest[0].startsWith("-") ? rest[0] : "help",
    name: null,
    auditor: "",
    force: false,
    dryRun: false,
    json: false,
    stdout: false,
    minScore: 75,
    maxRouteTokens: 2000,
    from: null,
    to: null,
    noFail: false,
  };

  for (let i = 1; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--name" && rest[i + 1]) opts.name = rest[++i];
    else if (a === "--auditor" && rest[i + 1]) opts.auditor = rest[++i];
    else if (a === "--force") opts.force = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--stdout") opts.stdout = true;
    else if (a === "--min-score" && rest[i + 1]) opts.minScore = Number(rest[++i]);
    else if (a === "--max-route-tokens" && rest[i + 1]) opts.maxRouteTokens = Number(rest[++i]);
    else if (a === "--from" && rest[i + 1]) opts.from = rest[++i];
    else if (a === "--to" && rest[i + 1]) opts.to = rest[++i];
    else if (a === "--no-fail") opts.noFail = true;
  }
  return opts;
}

function printHelp() {
  console.log(`context-os audit — generate methodology audit documents

Usage:
  context-os audit init [options]
  context-os audit report [options]
  context-os audit record [options]
  context-os audit history [--json]
  context-os audit compare [--from id] [--to id] [--json] [--no-fail]

Options:
  --root <dir>       Project root (default: cwd)
  --name <project>   Project display name (default: manifest.project or directory name)
  --auditor <name>   Auditor name for cleanup.md
  --force            Overwrite existing audit files
  --dry-run          Print planned files only
  --min-score <n>    Report quality threshold (default: 75)
  --max-route-tokens <n>  Per-question budget (default: 2000)
  --json             Print report JSON instead of writing files
  --stdout           Print Markdown instead of writing files
  --from <id>        Earlier snapshot id (default: previous)
  --to <id>          Later snapshot id (default: latest)
  --no-fail          Do not exit 1 when compare finds regressions

Creates:
  context-os/audit/project-map.md
  context-os/audit/cleanup.md
  context-os/audit/risks.md
  context-os/audit/report.md
  context-os/audit/report.json
  context-os/audit/history.jsonl
`);
}

function projectName(root, explicitName) {
  if (explicitName) return explicitName;
  try {
    return loadManifest(root).project ?? path.basename(root);
  } catch {
    return path.basename(root) || "my-project";
  }
}

function substitute(content, vars) {
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, value);
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

export async function buildAuditReport(projectRoot, { minScore = 75, maxRouteTokens = 2000 } = {}) {
  const questions = "context-os/eval/questions.json";
  const manifest = loadManifest(projectRoot);
  const doctor = readinessChecks(projectRoot);
  const score = buildScoreReport(projectRoot, minScore);
  const routingLint = buildRoutingLintReport(projectRoot, { questions });
  const route = evalRouteReport(projectRoot, questions);
  const dryRun = await evalDryRunReport(projectRoot, questions, maxRouteTokens);
  const maturity = await buildMaturityReport(projectRoot);
  const drift = runDriftCheck({ projectRoot, manifest, files: [] });
  const ok =
    doctor.ok &&
    score.ok &&
    routingLint.ok &&
    route.ok &&
    dryRun.ok &&
    drift.ok;

  return {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    project: manifest.project,
    root: projectRoot,
    ok,
    thresholds: {
      min_score: minScore,
      max_route_tokens: maxRouteTokens,
    },
    summary: {
      maturity: maturity.level.id,
      maturity_rank: maturity.level.rank,
      mean_score: score.mean_score,
      routing_f1: route.mean_f1,
      eval_questions: route.questions,
      max_route_tokens_est: dryRun.summary?.max_tokens_est ?? null,
      routing_coverage: `${routingLint.covered_routes}/${routingLint.routes}`,
      drift_errors: drift.summary.errors,
      drift_warnings: drift.summary.warnings,
    },
    doctor,
    score,
    routing_lint: routingLint,
    eval_route: route,
    eval_dry_run: dryRun,
    drift,
    maturity,
  };
}

export function formatAuditMarkdown(report) {
  const status = (ok) => (ok ? "PASS" : "FAIL");
  const lines = [
    `# Context OS Audit - ${report.project}`,
    "",
    `Generated: ${report.generated_at}`,
    "",
    `Overall: **${status(report.ok)}**`,
    "",
    "## Summary",
    "",
    "| Gate | Result | Evidence |",
    "|------|--------|----------|",
    `| Doctor | ${status(report.doctor.ok)} | ${report.doctor.checks.length} checks, ${report.doctor.warnings.length} warnings |`,
    `| Core quality | ${status(report.score.ok)} | mean ${report.score.mean_score}/100, minimum ${report.thresholds.min_score} |`,
    `| Routing lint | ${status(report.routing_lint.ok)} | ${report.summary.routing_coverage} routes covered |`,
    `| Routing eval | ${status(report.eval_route.ok)} | F1 ${report.eval_route.mean_f1}, ${report.eval_route.questions} questions |`,
    `| Context budget | ${status(report.eval_dry_run.ok)} | max ~${report.summary.max_route_tokens_est}/${report.thresholds.max_route_tokens} tokens |`,
    `| Drift inventory | ${status(report.drift.ok)} | ${report.summary.drift_errors} errors, ${report.summary.drift_warnings} warnings |`,
    `| Maturity | ${report.maturity.level.label} | ${report.maturity.level.rank}/5 |`,
    "",
    "## Core Scores",
    "",
    "| Core | Score | Words | Warnings |",
    "|------|-------|-------|----------|",
  ];

  for (const core of report.score.cores) {
    lines.push(`| ${core.id} | ${core.score}/100 | ${core.word_count ?? 0} | ${core.warnings.length} |`);
  }

  const findings = [
    ...report.doctor.errors.map((message) => `Doctor: ${message}`),
    ...report.score.architecture.errors.map((message) => `Architecture: ${message}`),
    ...report.routing_lint.errors.map((message) => `Routing: ${message}`),
    ...report.routing_lint.warnings.map((message) => `Routing warning: ${message}`),
    ...(report.eval_route.failures ?? []).map(
      (failure) => `Route ${failure.id}: expected [${failure.expected}] got [${failure.actual}]`
    ),
    ...(report.eval_dry_run.over_budget ?? []).map(
      (row) => `Budget ${row.id}: ~${row.tokens_est} tokens via [${row.routed_cores}]`
    ),
    ...report.drift.issues.map((issue) => `Drift ${issue.severity}: ${issue.message ?? issue.kind}`),
  ];

  lines.push("", "## Findings", "");
  if (findings.length) for (const finding of findings) lines.push(`- ${finding}`);
  else lines.push("- No blocking findings.");

  lines.push("", "## Next Action", "");
  lines.push(report.maturity.next_actions[0] ?? "Maintain cores and rerun this report after material changes.");
  lines.push("");
  return lines.join("\n");
}

function gitCommit(projectRoot) {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

export function auditSnapshot(report, { commit = null } = {}) {
  return {
    schema_version: "1.0.0",
    id: randomUUID(),
    recorded_at: report.generated_at,
    commit,
    project: report.project,
    report_ok: report.ok,
    thresholds: report.thresholds,
    metrics: {
      maturity: report.summary.maturity,
      maturity_rank: report.summary.maturity_rank,
      mean_score: report.summary.mean_score,
      routing_f1: report.summary.routing_f1,
      eval_questions: report.summary.eval_questions,
      max_route_tokens_est: report.summary.max_route_tokens_est,
      routing_coverage: report.summary.routing_coverage,
      drift_errors: report.summary.drift_errors,
      drift_warnings: report.summary.drift_warnings,
    },
    cores: Object.fromEntries(
      report.score.cores.map((core) => [
        core.id,
        { score: core.score, version: core.version, words: core.word_count ?? 0 },
      ])
    ),
  };
}

function historyPath(projectRoot) {
  return path.join(contextOsDir(projectRoot), "audit", "history.jsonl");
}

export function readAuditHistory(projectRoot) {
  const file = historyPath(projectRoot);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`invalid audit history at line ${index + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }
    });
}

function numericDelta(from, to) {
  return Number.isFinite(from) && Number.isFinite(to)
    ? Number((to - from).toFixed(3))
    : null;
}

export function compareAuditSnapshots(from, to) {
  const regressions = [];
  const improvements = [];
  const note = (condition, target, message) => {
    if (condition) target.push(message);
  };

  note(from.report_ok && !to.report_ok, regressions, "overall audit changed from PASS to FAIL");
  note(to.metrics.maturity_rank < from.metrics.maturity_rank, regressions, "maturity rank decreased");
  note(to.metrics.maturity_rank > from.metrics.maturity_rank, improvements, "maturity rank increased");
  note(to.metrics.mean_score < from.metrics.mean_score, regressions, "mean core score decreased");
  note(to.metrics.mean_score > from.metrics.mean_score, improvements, "mean core score increased");
  note(to.metrics.routing_f1 < from.metrics.routing_f1, regressions, "routing F1 decreased");
  note(to.metrics.routing_f1 > from.metrics.routing_f1, improvements, "routing F1 increased");
  note(
    to.metrics.max_route_tokens_est > from.metrics.max_route_tokens_est,
    regressions,
    "maximum routed tokens increased"
  );
  note(
    to.metrics.max_route_tokens_est < from.metrics.max_route_tokens_est,
    improvements,
    "maximum routed tokens decreased"
  );
  note(to.metrics.drift_errors > from.metrics.drift_errors, regressions, "drift errors increased");
  note(to.metrics.drift_errors < from.metrics.drift_errors, improvements, "drift errors decreased");
  note(
    to.thresholds.min_score < from.thresholds.min_score,
    regressions,
    "minimum score policy was lowered"
  );
  note(
    to.thresholds.max_route_tokens > from.thresholds.max_route_tokens,
    regressions,
    "route token budget policy was relaxed"
  );

  for (const [id, prior] of Object.entries(from.cores ?? {})) {
    const current = to.cores?.[id];
    if (!current) regressions.push(`core removed from snapshot: ${id}`);
    else if (current.score < prior.score) regressions.push(`${id} score decreased ${prior.score} -> ${current.score}`);
    else if (current.score > prior.score) improvements.push(`${id} score increased ${prior.score} -> ${current.score}`);
  }

  return {
    ok: regressions.length === 0,
    from: from.id,
    to: to.id,
    deltas: {
      maturity_rank: numericDelta(from.metrics.maturity_rank, to.metrics.maturity_rank),
      mean_score: numericDelta(from.metrics.mean_score, to.metrics.mean_score),
      routing_f1: numericDelta(from.metrics.routing_f1, to.metrics.routing_f1),
      max_route_tokens_est: numericDelta(
        from.metrics.max_route_tokens_est,
        to.metrics.max_route_tokens_est
      ),
      drift_errors: numericDelta(from.metrics.drift_errors, to.metrics.drift_errors),
    },
    regressions,
    improvements,
  };
}

function selectSnapshot(history, selector, fallbackIndex) {
  if (!selector) return history.at(fallbackIndex);
  const snapshot = history.find((item) => item.id === selector);
  if (!snapshot) throw new Error(`audit snapshot not found: ${selector}`);
  return snapshot;
}

export async function cmdAudit(argv) {
  const opts = parseAuditArgs(argv);
  if (opts.sub === "help" || opts.sub === "--help" || opts.sub === "-h") {
    printHelp();
    return;
  }
  if (opts.sub === "report") {
    if (!Number.isFinite(opts.minScore) || opts.minScore < 0 || opts.minScore > 100) {
      throw new Error("--min-score must be a number from 0 to 100");
    }
    if (!Number.isFinite(opts.maxRouteTokens) || opts.maxRouteTokens <= 0) {
      throw new Error("--max-route-tokens must be a positive number");
    }
    const report = await buildAuditReport(opts.root, {
      minScore: opts.minScore,
      maxRouteTokens: opts.maxRouteTokens,
    });
    const markdown = formatAuditMarkdown(report);
    if (opts.json) {
      console.log(JSON.stringify(report, null, 2));
    } else if (opts.stdout) {
      console.log(markdown);
    } else {
      const outDir = path.join(contextOsDir(opts.root), "audit");
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "report.md"), markdown);
      fs.writeFileSync(path.join(outDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
      console.log("Wrote context-os/audit/report.md");
      console.log("Wrote context-os/audit/report.json");
    }
    if (!report.ok) process.exitCode = 1;
    return;
  }
  if (opts.sub === "record") {
    if (!Number.isFinite(opts.minScore) || opts.minScore < 0 || opts.minScore > 100) {
      throw new Error("--min-score must be a number from 0 to 100");
    }
    if (!Number.isFinite(opts.maxRouteTokens) || opts.maxRouteTokens <= 0) {
      throw new Error("--max-route-tokens must be a positive number");
    }
    const report = await buildAuditReport(opts.root, {
      minScore: opts.minScore,
      maxRouteTokens: opts.maxRouteTokens,
    });
    const snapshot = auditSnapshot(report, { commit: gitCommit(opts.root) });
    const file = historyPath(opts.root);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, `${JSON.stringify(snapshot)}\n`);
    if (opts.json) console.log(JSON.stringify(snapshot, null, 2));
    else console.log(`Recorded audit snapshot ${snapshot.id} (${snapshot.report_ok ? "PASS" : "FAIL"})`);
    if (!report.ok) process.exitCode = 1;
    return;
  }
  if (opts.sub === "history") {
    const history = readAuditHistory(opts.root);
    if (opts.json) console.log(JSON.stringify({ ok: true, snapshots: history }, null, 2));
    else if (!history.length) console.log("No audit snapshots recorded.");
    else for (const item of history) {
      console.log(
        `${item.id}\t${item.recorded_at}\t${item.report_ok ? "PASS" : "FAIL"}\t${item.metrics.maturity}\tscore ${item.metrics.mean_score}\tF1 ${item.metrics.routing_f1}\tmax ~${item.metrics.max_route_tokens_est}`
      );
    }
    return;
  }
  if (opts.sub === "compare") {
    const history = readAuditHistory(opts.root);
    if (history.length < 2) throw new Error("audit compare requires at least two recorded snapshots");
    const from = selectSnapshot(history, opts.from, -2);
    const to = selectSnapshot(history, opts.to, -1);
    const comparison = compareAuditSnapshots(from, to);
    if (opts.json) console.log(JSON.stringify(comparison, null, 2));
    else {
      console.log(`Audit comparison: ${comparison.ok ? "OK" : "REGRESSION"}`);
      for (const item of comparison.regressions) console.error(`  regress: ${item}`);
      for (const item of comparison.improvements) console.log(`  improve: ${item}`);
      if (!comparison.regressions.length && !comparison.improvements.length) {
        console.log("  no measured changes");
      }
    }
    if (!comparison.ok && !opts.noFail) process.exitCode = 1;
    return;
  }
  if (opts.sub !== "init") {
    throw new Error("Usage: context-os audit [init|report|record|history|compare]");
  }

  const templateDir = path.join(packageRoot(), "templates", "shared", "audit");
  const outDir = path.join(contextOsDir(opts.root), "audit");
  const vars = {
    PROJECT_NAME: projectName(opts.root, opts.name),
    DATE: new Date().toISOString().slice(0, 10),
    NAME: opts.auditor,
  };

  const planned = AUDIT_FILES.map(([srcName, destName]) => ({
    src: path.join(templateDir, srcName),
    dest: path.join(outDir, destName),
    rel: path.join("context-os", "audit", destName),
  }));

  if (opts.dryRun) {
    console.log(`Would create ${planned.length} audit file(s):`);
    for (const item of planned) console.log(`  ${item.rel}`);
    return;
  }

  for (const item of planned) {
    if (!fs.existsSync(item.src)) {
      throw new Error(`Missing audit template: ${item.src}`);
    }
    if (fs.existsSync(item.dest) && !opts.force) {
      throw new Error(`${item.dest} exists. Use --force to overwrite.`);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });
  for (const item of planned) {
    const raw = fs.readFileSync(item.src, "utf8");
    fs.writeFileSync(item.dest, substitute(raw, vars));
    console.log(`Wrote ${item.rel}`);
  }
}
