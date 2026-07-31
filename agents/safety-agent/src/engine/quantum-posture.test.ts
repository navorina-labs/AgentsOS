import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { analyzeThreatModel } from "./risk-scorer.js";
import { buildQuantumPosture } from "./quantum-posture.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("quantum posture: HNDL queue for backup-archive", async () => {
  const model = await loadThreatModelFromFile(sample);
  const analyze = analyzeThreatModel(model);
  const q = buildQuantumPosture(model, analyze);

  assert.equal(q.quantum_record, true);
  assert.ok(q.flows_quantum_vulnerable >= 2);
  const backup = q.reencrypt_queue.find((r) => r.flow_id === "backup-archive");
  assert.ok(backup);
  assert.equal(backup.urgency, "immediate");
  assert.ok(q.migration_steps.some((s) => s.classical.includes("RSA")));
});

test("quantum posture: internal-mtls has PQC in migration or no RSA step", async () => {
  const model = await loadThreatModelFromFile(sample);
  const analyze = analyzeThreatModel(model);
  const q = buildQuantumPosture(model, analyze);
  const meshSteps = q.migration_steps.filter((s) => s.flow_id === "internal-mtls");
  assert.ok(meshSteps.every((s) => !s.classical.startsWith("RSA")));
});
