import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { analyzeThreatModel } from "./risk-scorer.js";
import { computeAgilityScore } from "./agility-score.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

const secModel = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../threat-model.yaml",
);

test("agility: sample finance model scores low", async () => {
  const model = await loadThreatModelFromFile(sample);
  const analyze = analyzeThreatModel(model);
  const agility = computeAgilityScore(model, analyze);
  assert.ok(agility.score < 55);
  assert.equal(agility.tier, "at_risk");
});

test("agility: safetyos self-model scores higher", async () => {
  const model = await loadThreatModelFromFile(secModel);
  const analyze = analyzeThreatModel(model);
  const agility = computeAgilityScore(model, analyze);
  assert.ok(agility.score >= 55);
});

test("agility: PQC signature does not count as PQC key exchange", async () => {
  const model = await loadThreatModelFromFile(sample);
  for (const flow of model.data_flows) {
    flow.crypto.key_exchange = [];
    flow.crypto.signatures = [];
  }
  model.data_flows[0]!.crypto.signatures = ["ML-DSA-65"];

  const agility = computeAgilityScore(model, analyzeThreatModel(model));
  const coverage = agility.factors.find((f) => f.id === "pqc_coverage");
  assert.equal(coverage?.earned, 0);
  assert.match(coverage?.note ?? "", /^0\//);
});
