#!/usr/bin/env node
/**
 * Локальный полный прогон: build, test, CLI, scan — без ручных шагов.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(label, args, opts = {}) {
  const start = Date.now();
  const r = spawnSync(npm, args, {
    cwd: root,
    stdio: opts.silent ? "pipe" : "inherit",
    encoding: "utf8",
    shell: process.platform === "win32",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  const ms = Date.now() - start;
  const ok = r.status === 0;
  return { label, ok, ms, status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function runNode(label, scriptArgs, opts = {}) {
  const start = Date.now();
  const r = spawnSync(
    process.execPath,
    ["--import", "tsx", ...scriptArgs],
    {
      cwd: root,
      stdio: opts.silent ? "pipe" : "inherit",
      encoding: "utf8",
      env: { ...process.env, FORCE_COLOR: "1" },
    },
  );
  const ms = Date.now() - start;
  return {
    label,
    ok: r.status === 0,
    ms,
    status: r.status ?? 1,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
  };
}

const results = [];

console.log("\n╔══════════════════════════════════════╗");
console.log("║  SafetyOS — локальная верификация    ║");
console.log("╚══════════════════════════════════════╝\n");

results.push(run("install", ["install"], { silent: false }));
results.push(run("typecheck", ["run", "typecheck"]));
results.push(run("build", ["run", "build"]));
results.push(run("unit tests", ["test"]));

const threatModel = path.join(root, "examples/sample-threat-model.yaml");
const tlsFixtures = path.join(root, "examples/tls-configs");
results.push(
  runNode("cli validate", ["src/cli/main.ts", "validate", threatModel], {
    silent: true,
  }),
);

const analyze = runNode(
  "cli analyze",
  ["src/cli/main.ts", "analyze", threatModel, "--json"],
  { silent: true },
);
results.push(analyze);

let analyzeProof = { ok: false, detail: "" };
if (analyze.stdout) {
  try {
    const report = JSON.parse(analyze.stdout);
    const backup = report.flows?.find((f) => f.id === "backup-archive");
    const mesh = report.flows?.find((f) => f.id === "internal-mtls");
    const proofs = [
      report.mosca?.at_risk === true,
      (report.summary?.critical ?? 0) >= 2,
      backup?.tier === "critical" && backup?.score >= 70,
      mesh?.tier === "medium" && mesh?.score < 70,
    ];
    analyzeProof.ok = proofs.every(Boolean);
    analyzeProof.detail = `mosca=${report.mosca?.at_risk} critical=${report.summary?.critical} backup=${backup?.tier}/${backup?.score} mesh=${mesh?.tier}/${mesh?.score}`;
  } catch (e) {
    analyzeProof.detail = `JSON parse failed: ${e.message}`;
  }
}
results.push({
  label: "analyze assertions",
  ok: analyze.ok && analyzeProof.ok,
  ms: 0,
  status: analyze.ok && analyzeProof.ok ? 0 : 1,
  stdout: analyzeProof.detail,
  stderr: "",
});

const scanSrc = runNode(
  "scan src (clean)",
  [
    "src/cli/main.ts",
    "scan",
    path.join(root, "src/cli"),
    "--json",
  ],
  { silent: true },
);
results.push(scanSrc);

let srcClean = false;
if (scanSrc.stdout) {
  try {
    const rep = JSON.parse(scanSrc.stdout);
    const critical = rep.findings?.filter((f) => f.severity === "critical") ?? [];
    srcClean = critical.length === 0;
    results.push({
      label: "src has no critical crypto",
      ok: scanSrc.ok && srcClean,
      ms: 0,
      status: srcClean ? 0 : 1,
      stdout: `findings=${rep.findings?.length ?? 0} critical=${critical.length}`,
      stderr: "",
    });
  } catch {
    results.push({
      label: "src has no critical crypto",
      ok: false,
      ms: 0,
      status: 1,
      stdout: "",
      stderr: "scan src JSON failed",
    });
  }
}

const scanFixtures = runNode(
  "scan fixtures (must find issues)",
  ["src/cli/main.ts", "scan", path.join(root, "examples/fixtures"), "--json"],
  { silent: true },
);
const fixturesMustFail = scanFixtures.status === 1;
let fixturesCritical = 0;
if (scanFixtures.stdout) {
  try {
    const rep = JSON.parse(scanFixtures.stdout);
    fixturesCritical =
      rep.findings?.filter((f) => f.severity === "critical").length ?? 0;
  } catch { /* ignore */ }
}
results.push({
  label: "scanner detects fixture vulnerabilities",
  ok: fixturesMustFail && fixturesCritical >= 2,
  ms: scanFixtures.ms,
  status: fixturesMustFail && fixturesCritical >= 2 ? 0 : 1,
  stdout: `exit=${scanFixtures.status} critical=${fixturesCritical}`,
  stderr: "",
});

const draftOut = path.join(root, "reports/threat-model.draft.yaml");
const draft = runNode(
  "cli draft",
  [
    "src/cli/main.ts",
    "draft",
    path.join(root, "examples/fixtures"),
    "-o",
    draftOut,
    "-n",
    "Draft Test",
  ],
  { silent: true },
);
results.push(draft);

const projectModel = path.join(root, "threat-model.yaml");
const secRun = runNode(
  "cli run",
  [
    "src/cli/main.ts",
    "run",
    "-m",
    projectModel,
    "--scan",
    path.join(root, "src/cli"),
    "--reports-dir",
    path.join(root, "reports"),
    "--fail-on",
    "critical",
  ],
  { silent: true },
);
results.push(secRun);

const htmlAnalyze = runNode(
  "cli analyze --html",
  [
    "src/cli/main.ts",
    "analyze",
    threatModel,
    "--html",
    path.join(root, "reports/sample-analyze.html"),
  ],
  { silent: true },
);
results.push(htmlAnalyze);

const profileList = runNode(
  "cli profile list",
  ["src/cli/main.ts", "profile", "list"],
  { silent: true },
);
results.push({
  label: "profile list",
  ok: profileList.ok && (profileList.stdout?.includes("fintech") ?? false),
  ms: profileList.ms,
  status: profileList.ok ? 0 : 1,
  stdout: profileList.stdout?.split("\n")[0] ?? "",
  stderr: "",
});

const assess = runNode(
  "cli assess",
  [
    "src/cli/main.ts",
    "assess",
    threatModel,
    "--scan",
    path.join(root, "examples/fixtures"),
    "-o",
    path.join(root, "reports"),
  ],
  { silent: true },
);
results.push(assess);

const gateSample = runNode(
  "cli gate (sample IFF)",
  ["src/cli/main.ts", "gate", threatModel, "--max-critical", "3"],
  { silent: true },
);
results.push({
  label: "safetyos gate sample (governance)",
  ok: gateSample.ok,
  ms: gateSample.ms,
  status: gateSample.ok ? 0 : 1,
  stdout: gateSample.stdout?.trim().split("\n").pop() ?? "",
  stderr: gateSample.stderr?.slice(0, 200) ?? "",
});

const gateProject = runNode(
  "cli gate (project)",
  [
    "src/cli/main.ts",
    "gate",
    projectModel,
    "--scan",
    path.join(root, "src/cli"),
  ],
  { silent: true },
);
results.push({
  label: "safetyos gate threat-model.yaml",
  ok: gateProject.ok,
  ms: gateProject.ms,
  status: gateProject.ok ? 0 : 1,
  stdout: gateProject.stdout?.trim().split("\n").pop() ?? "",
  stderr: gateProject.stderr?.slice(0, 200) ?? "",
});

const gateSampleScan = runNode(
  "cli gate sample+scan (expect fail)",
  [
    "src/cli/main.ts",
    "gate",
    threatModel,
    "--scan",
    path.join(root, "examples/fixtures"),
  ],
  { silent: true },
);
results.push({
  label: "gate blocks sample+fixtures scan",
  ok: gateSampleScan.status === 1,
  ms: gateSampleScan.ms,
  status: gateSampleScan.status === 1 ? 0 : 1,
  stdout: gateSampleScan.stderr?.split("\n")[0] ?? "",
  stderr: "",
});

const assessHtmlPath = path.join(root, "reports/assessment-latest.html");
const assessHtml = runNode(
  "cli assess --html",
  [
    "src/cli/main.ts",
    "assess",
    threatModel,
    "--html",
    assessHtmlPath,
    "-o",
    path.join(root, "reports"),
  ],
  { silent: true },
);
results.push({
  label: "assess html dashboard",
  ok: assessHtml.ok && existsSync(assessHtmlPath),
  ms: assessHtml.ms,
  status: assessHtml.ok && existsSync(assessHtmlPath) ? 0 : 1,
  stdout: assessHtml.stdout?.split("\n").pop() ?? "",
  stderr: "",
});

const exportCbom = runNode(
  "cli export cbom",
  [
    "src/cli/main.ts",
    "export",
    "cbom",
    "-m",
    threatModel,
    "-o",
    path.join(root, "reports/cbom-sample.json"),
  ],
  { silent: true },
);
results.push(exportCbom);

const exportOpa = runNode(
  "cli export opa",
  [
    "src/cli/main.ts",
    "export",
    "opa",
    "-m",
    threatModel,
    "-o",
    path.join(root, "reports/policy-sample.rego"),
  ],
  { silent: true },
);
results.push(exportOpa);

const aiRegoPath = path.join(root, "reports/ai-governance.rego");
const exportOpaAi = runNode(
  "cli export opa ai rego",
  [
    "src/cli/main.ts",
    "export",
    "opa",
    "-m",
    threatModel,
    "-o",
    path.join(root, "reports/policy-sample.rego"),
  ],
  { silent: true },
);
results.push({
  label: "export opa includes ai-governance.rego",
  ok: exportOpaAi.ok && existsSync(aiRegoPath),
  ms: exportOpaAi.ms,
  status: exportOpaAi.ok && existsSync(aiRegoPath) ? 0 : 1,
  stdout: existsSync(aiRegoPath) ? "ai-governance.rego ok" : "missing",
  stderr: "",
});

const messagingModel = path.join(root, "examples/messaging-threat-model.yaml");
const messagingValidate = runNode(
  "validate messaging model",
  ["src/cli/main.ts", "validate", messagingModel],
  { silent: true },
);
results.push({
  label: "messaging threat model validates",
  ok: messagingValidate.ok,
  ms: messagingValidate.ms,
  status: messagingValidate.ok ? 0 : 1,
  stdout: messagingValidate.stdout?.slice(0, 80) ?? "",
  stderr: messagingValidate.stderr?.slice(0, 200) ?? "",
});

const tlsInv = runNode(
  "inventory tls",
  [
    "src/cli/main.ts",
    "inventory",
    "tls",
    tlsFixtures,
    "-o",
    path.join(root, "reports/tls-inventory.json"),
  ],
  { silent: true },
);
const tlsMustFail = tlsInv.status === 1;
results.push({
  label: "inventory tls detects weak configs",
  ok: tlsMustFail,
  ms: tlsInv.ms,
  status: tlsMustFail ? 0 : 1,
  stdout: `exit=${tlsInv.status}`,
  stderr: "",
});

const tlsReconcile = runNode(
  "inventory reconcile",
  [
    "src/cli/main.ts",
    "inventory",
    "reconcile",
    "-m",
    threatModel,
    "--config",
    tlsFixtures,
  ],
  { silent: true },
);
results.push({
  label: "inventory reconcile",
  ok: tlsReconcile.ok || tlsReconcile.status === 1,
  ms: tlsReconcile.ms,
  status: 0,
  stdout: tlsReconcile.stdout?.includes("drift") ? "has drifts" : "ok",
  stderr: "",
});

const suggestApply = runNode(
  "inventory suggest --apply",
  [
    "src/cli/main.ts",
    "inventory",
    "suggest",
    "-m",
    threatModel,
    "--config",
    tlsFixtures,
    "--apply",
    "-o",
    path.join(root, "reports/sample-threat-model.applied.yaml"),
  ],
  { silent: true },
);
results.push({
  label: "inventory suggest --apply",
  ok: suggestApply.ok && suggestApply.stdout?.includes("Применено"),
  ms: suggestApply.ms,
  status: suggestApply.ok ? 0 : 1,
  stdout: suggestApply.stdout?.split("\n")[0] ?? "",
  stderr: suggestApply.stderr?.slice(0, 120) ?? "",
});

const assessTls = runNode(
  "assess with inventory-tls",
  [
    "src/cli/main.ts",
    "assess",
    threatModel,
    "--inventory-tls",
    tlsFixtures,
    "-o",
    path.join(root, "reports"),
  ],
  { silent: true },
);
results.push(assessTls);

let cbomTlsProof = { ok: false };
const cbomPath = path.join(root, "reports/cbom.json");
if (existsSync(cbomPath)) {
  try {
    const bom = JSON.parse(readFileSync(cbomPath, "utf8"));
    cbomTlsProof.ok =
      bom.metadata?.properties?.some((p) => p.name === "safetyos:tls-drift-count") &&
      bom.components?.some((c) =>
        String(c.bom_ref ?? "").startsWith("tls-config/"),
      );
  } catch {
    cbomTlsProof.ok = false;
  }
}
results.push({
  label: "cbom includes tls drift",
  ok: cbomTlsProof.ok,
  ms: 0,
  status: cbomTlsProof.ok ? 0 : 1,
  stdout: cbomTlsProof.ok ? "tls metadata ok" : "missing tls in cbom",
  stderr: "",
});

const cycle = runNode(
  "cli cycle",
  [
    "src/cli/main.ts",
    "cycle",
    projectModel,
    "--scan",
    path.join(root, "src/cli"),
    "-o",
    path.join(root, "reports"),
    "--inventory-tls",
    tlsFixtures,
    "--write-model",
    path.join(root, "reports/threat-model.enriched.yaml"),
    "--save-baseline",
  ],
  { silent: true },
);
const cyclePlaybook = path.join(root, "reports/defense-playbook.md");
const cycleCbom = path.join(root, "reports/cbom.json");
let cycleBundleOk = cycle.ok;
if (cycle.ok) {
  cycleBundleOk =
    existsSync(cyclePlaybook) &&
    existsSync(cycleCbom) &&
    readFileSync(cyclePlaybook, "utf8").includes("TLS inventory");
}
results.push({
  label: "defense cycle",
  ok: cycleBundleOk,
  ms: cycle.ms,
  status: cycleBundleOk ? 0 : 1,
  stdout: cycleBundleOk ? "cycle + playbook + cbom" : cycle.stdout?.slice(0, 80) ?? "",
  stderr: cycle.stderr?.slice(0, 120) ?? "",
});

const policyTest = runNode(
  "policy test bundle",
  [
    "src/cli/main.ts",
    "policy",
    "test",
    "-m",
    projectModel,
    "-o",
    path.join(root, "reports/opa-test"),
  ],
  { silent: true },
);
results.push({
  label: "policy test (opa or skip)",
  ok: policyTest.ok || (policyTest.stdout?.includes("Пропуск") ?? false),
  ms: policyTest.ms,
  status: policyTest.ok || policyTest.stdout?.includes("Пропуск") ? 0 : 1,
  stdout: policyTest.stdout?.split("\n")[0] ?? "",
  stderr: policyTest.stderr?.slice(0, 120) ?? "",
});

const playbook = runNode(
  "playbook quantum+ai+tls",
  [
    "src/cli/main.ts",
    "playbook",
    "-m",
    threatModel,
    "--scan",
    path.join(root, "examples/fixtures"),
    "--inventory-tls",
    tlsFixtures,
    "-o",
    path.join(root, "reports/defense-playbook.md"),
  ],
  { silent: true },
);
const playbookPath = path.join(root, "reports/defense-playbook.md");
let playbookTls = false;
if (playbook.ok && existsSync(playbookPath)) {
  const md = readFileSync(playbookPath, "utf8");
  playbookTls = md.includes("TLS inventory");
}
results.push({
  label: "playbook generated",
  ok: playbook.ok && playbookTls,
  ms: playbook.ms,
  status: playbook.ok && playbookTls ? 0 : 1,
  stdout: playbookTls ? "has tls section" : "missing tls",
  stderr: "",
});

const reportPath = path.join(root, "reports/verify-latest.json");
const summary = {
  timestamp: new Date().toISOString(),
  passed: results.filter((r) => r.ok).length,
  failed: results.filter((r) => !r.ok).length,
  steps: results.map((r) => ({
    label: r.label,
    ok: r.ok,
    ms: r.ms,
    status: r.status,
    note: (r.stdout || r.stderr || "").trim().slice(0, 200) || undefined,
  })),
};

mkdirSync(path.join(root, "reports"), { recursive: true });
writeFileSync(reportPath, JSON.stringify(summary, null, 2));

console.log("\n── Итог ──────────────────────────────────\n");
for (const r of results) {
  const icon = r.ok ? "✓" : "✗";
  const note = r.stdout && !r.ok ? ` — ${r.stdout}` : r.stdout && r.label.includes("assert") ? ` — ${r.stdout}` : "";
  console.log(`  ${icon} ${r.label} (${r.ms}ms)${note}`);
}
console.log(`\n  Отчёт: ${reportPath}`);
console.log(`  ${summary.passed}/${results.length} шагов OK\n`);

if (summary.failed > 0) {
  process.exit(1);
}
