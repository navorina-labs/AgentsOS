import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeThreatModel } from "./risk-scorer.js";

const sampleModel = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("analyze: backup-archive is critical with RSA and HNDL", async () => {
  const { loadThreatModelFromFile } = await import(
    "../parser/load-threat-model.js"
  );
  const model = await loadThreatModelFromFile(sampleModel);
  const report = analyzeThreatModel(model);
  const backup = report.flows.find((f) => f.id === "backup-archive");
  assert.ok(backup);
  assert.equal(backup.tier, "critical");
  assert.ok(backup.score >= 70);
});

test("analyze: internal-mtls lower risk", async () => {
  const { loadThreatModelFromFile } = await import(
    "../parser/load-threat-model.js"
  );
  const model = await loadThreatModelFromFile(sampleModel);
  const report = analyzeThreatModel(model);
  const mesh = report.flows.find((f) => f.id === "internal-mtls");
  assert.ok(mesh);
  assert.ok(mesh.score < 70);
});
