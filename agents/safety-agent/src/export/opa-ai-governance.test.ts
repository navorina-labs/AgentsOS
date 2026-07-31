import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import {
  generateOpaAiGovernance,
  opaAiGovernanceOutPath,
} from "./opa-ai-governance.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("opa ai: null when ai_implementation false", async () => {
  const model = await loadThreatModelFromFile(sample);
  const off = {
    ...model,
    adversary: { ...model.adversary, ai_implementation: false },
  };
  assert.equal(generateOpaAiGovernance(off), null);
});

test("opa ai: generates package for sample", async () => {
  const model = await loadThreatModelFromFile(sample);
  const rego = generateOpaAiGovernance(model);
  assert.ok(rego);
  assert.match(rego!, /package safetyos\.ai/);
  assert.match(rego!, /ai_governance required/);
  assert.match(rego!, /delimiter_start/);
  assert.match(rego!, /"id": "user"/);
});

test("opa ai: out path next to policy", () => {
  assert.equal(
    opaAiGovernanceOutPath("reports/policy.rego"),
    "reports/ai-governance.rego",
  );
});
