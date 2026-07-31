import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { analyzeThreatModel } from "../engine/risk-scorer.js";
import { buildAiGovernanceReport } from "../engine/ai-governance-eval.js";

const messaging = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/messaging-threat-model.yaml",
);

test("e2e: messaging model loads with ai_governance", async () => {
  const model = await loadThreatModelFromFile(messaging);
  assert.equal(model.organization.name, "Signal-like Messenger");
  assert.ok(model.ai_governance);
  const report = analyzeThreatModel(model);
  assert.ok(report.flows.length >= 3);
  const identity = report.flows.find((f) => f.id === "identity-keys");
  assert.ok(identity);
  const gov = buildAiGovernanceReport(model);
  assert.equal(gov.configured, true);
});
