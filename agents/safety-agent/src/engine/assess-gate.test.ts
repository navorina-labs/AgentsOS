import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { runFullAssessment } from "./assess.js";
import { evaluateAssessGate } from "./assess-gate.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("assess gate: critical sample fails safe default", async () => {
  const model = await loadThreatModelFromFile(sample);
  const full = runFullAssessment(model);
  const gate = evaluateAssessGate(full);
  assert.equal(gate.pass, false);
  assert.ok(gate.failures.some((f) => f.includes("critical flows")));
});

test("assess gate: explicit critical budget allows known baseline", async () => {
  const model = await loadThreatModelFromFile(sample);
  const full = runFullAssessment(model);
  const gate = evaluateAssessGate(full, {
    maxCriticalFlows: full.analyze.summary.critical,
  });
  assert.equal(gate.pass, true, gate.failures.join("; "));
});

test("assess gate: fails on assurance failures", async () => {
  const model = await loadThreatModelFromFile(sample);
  const full = runFullAssessment(model);
  full.assurance.failed = 2;
  const gate = evaluateAssessGate(full, { maxAssuranceFailures: 0 });
  assert.equal(gate.pass, false);
  assert.ok(gate.failures.some((f) => f.includes("assurance")));
});

test("assess gate: fails on tls critical drifts", async () => {
  const model = await loadThreatModelFromFile(sample);
  const full = runFullAssessment(model);
  full.tls = {
    inventory: { root: "", files_scanned: 0, records: [], summary: { weak_protocols: 0, records_with_issues: 0, inferred_kex: [] } },
    reconcile: {
      inventory_records: 1,
      tls_flows_in_model: 1,
      drifts: [
        {
          kind: "weak_in_config",
          severity: "critical",
          message: "weak",
        },
      ],
      matched: [],
      unmatched_flow_ids: [],
    },
  };
  const gate = evaluateAssessGate(full, { maxTlsCriticalDrifts: 0 });
  assert.equal(gate.pass, false);
  assert.ok(gate.failures.some((f) => f.includes("tls")));
});
