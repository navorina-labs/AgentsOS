import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateMosca, flowMoscaAtRisk } from "./mosca.js";
import type { ThreatModel } from "../types/threat-model.js";

const baseModel: ThreatModel = {
  version: "1",
  organization: {
    name: "Test",
    migration_years: 4,
    quantum_horizon_years: 8,
  },
  adversary: {
    classical: true,
    quantum_record: true,
    ai_implementation: false,
  },
  data_flows: [
    {
      id: "a",
      name: "A",
      confidentiality_years: 25,
      storage: "permanent",
      crypto: {
        key_exchange: ["RSA-2048"],
        signatures: [],
        symmetric: ["AES-256-GCM"],
        hash: ["SHA-256"],
      },
    },
  ],
};

test("evaluateMosca: at_risk when x+y>z", () => {
  const r = evaluateMosca(baseModel);
  assert.equal(r.at_risk, true);
  assert.equal(r.x_max_years, 25);
  assert.equal(r.margin_years, 21);
});

test("flowMoscaAtRisk per flow", () => {
  assert.equal(flowMoscaAtRisk(baseModel.data_flows[0]!, baseModel), true);
});
