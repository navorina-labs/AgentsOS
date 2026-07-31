/**
 * E2E: полный pipeline без ручного CLI.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { analyzeThreatModel } from "../engine/risk-scorer.js";
import { scanDirectory } from "../scanner/scan-directory.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sampleModel = path.join(root, "examples/sample-threat-model.yaml");
const fixtures = path.join(root, "examples/fixtures");
const srcCli = path.join(root, "src/cli");

test("e2e: threat model loads and analyze produces expected tiers", async () => {
  const model = await loadThreatModelFromFile(sampleModel);
  const report = analyzeThreatModel(model);

  assert.equal(report.organization, "Acme Finance");
  assert.equal(report.mosca.at_risk, true);
  assert.equal(report.summary.total_flows, 4);
  assert.ok(report.summary.critical >= 2);

  const backup = report.flows.find((f) => f.id === "backup-archive");
  assert.ok(backup);
  assert.equal(backup.tier, "critical");
  assert.ok(backup.policy_violations.length >= 2);
});

test("e2e: application src (cli) has no critical scan findings", async () => {
  const report = await scanDirectory(srcCli);
  const critical = report.findings.filter((f) => f.severity === "critical");
  assert.equal(
    critical.length,
    0,
    `unexpected critical in src: ${critical.map((c) => c.file).join(", ")}`,
  );
});

test("e2e: fixtures contain critical findings (scanner works)", async () => {
  const report = await scanDirectory(fixtures);
  const critical = report.findings.filter((f) => f.severity === "critical");
  assert.ok(critical.length >= 2, "fixture must trigger critical scanner hits");
});
