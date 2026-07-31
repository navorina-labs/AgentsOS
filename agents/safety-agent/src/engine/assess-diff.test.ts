import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { runFullAssessment } from "./assess.js";
import { diffAssessments } from "./assess-diff.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("assess diff: detects critical delta", async () => {
  const model = await loadThreatModelFromFile(sample);
  const before = runFullAssessment(model);
  const after = runFullAssessment(model);
  after.analyze.summary.critical = before.analyze.summary.critical + 1;
  const diff = diffAssessments(before, after);
  assert.equal(diff.summary.critical_delta, 1);
  assert.equal(diff.improved, false);
});

test("assess diff: improvement when assurance fails drop", async () => {
  const model = await loadThreatModelFromFile(sample);
  const before = runFullAssessment(model);
  const after = runFullAssessment(model);
  before.assurance.failed = 3;
  after.assurance.failed = 1;
  const diff = diffAssessments(before, after);
  assert.equal(diff.summary.assurance_failed_delta, -2);
  assert.equal(diff.improved, true);
});

test("assess diff: tls critical drift regression", async () => {
  const model = await loadThreatModelFromFile(sample);
  const before = runFullAssessment(model);
  const after = runFullAssessment(model);
  before.tls = {
    inventory: { root: "", files_scanned: 0, records: [], summary: { weak_protocols: 0, records_with_issues: 0, inferred_kex: [] } },
    reconcile: {
      inventory_records: 0,
      tls_flows_in_model: 1,
      drifts: [],
      matched: [],
      unmatched_flow_ids: [],
    },
  };
  after.tls = {
    ...before.tls!,
    reconcile: {
      ...before.tls!.reconcile,
      drifts: [
        {
          kind: "weak_in_config",
          severity: "critical",
          message: "TLSv1.0 enabled",
          flow_id: "api-tls",
        },
      ],
    },
  };
  const diff = diffAssessments(before, after);
  assert.equal(diff.summary.tls_drift_critical_delta, 1);
  assert.equal(diff.improved, false);
});
