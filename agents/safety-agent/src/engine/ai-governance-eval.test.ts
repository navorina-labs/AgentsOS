import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { DEFAULT_AI_GOVERNANCE } from "../registry/ai-governance-defaults.js";
import {
  buildAiGovernanceReport,
  governanceWorstSeverity,
} from "./ai-governance-eval.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("governance: sample model configured and ok", async () => {
  const model = await loadThreatModelFromFile(sample);
  const r = buildAiGovernanceReport(model);
  assert.equal(r.configured, true);
  assert.ok(r.friend_or_foe.own_count >= 2);
  assert.ok(r.ai_language.channel_count >= 4);
  assert.equal(governanceWorstSeverity(r), "ok");
});

test("governance: fail when ai on but no ai_governance", () => {
  const r = buildAiGovernanceReport({
    version: "1",
    organization: { name: "X", migration_years: 1, quantum_horizon_years: 10 },
    adversary: {
      classical: true,
      quantum_record: false,
      ai_implementation: true,
    },
    data_flows: [
      {
        id: "f",
        name: "F",
        storage: "ephemeral",
        crypto: { key_exchange: [], signatures: [], symmetric: [], hash: [] },
      },
    ],
  });
  assert.equal(r.configured, false);
  assert.equal(governanceWorstSeverity(r), "fail");
});

test("governance: foreign channel without delimiter fails", () => {
  const bad = structuredClone(DEFAULT_AI_GOVERNANCE);
  const user = bad.ai_language.channels.find((c) => c.id === "user");
  assert.ok(user);
  delete user.delimiter_start;
  delete user.delimiter_end;

  const r = buildAiGovernanceReport({
    version: "1",
    organization: { name: "X", migration_years: 1, quantum_horizon_years: 10 },
    adversary: {
      classical: true,
      quantum_record: false,
      ai_implementation: true,
    },
    data_flows: [
      {
        id: "f",
        name: "F",
        storage: "ephemeral",
        crypto: { key_exchange: [], signatures: [], symmetric: [], hash: [] },
      },
    ],
    ai_governance: bad,
  });
  assert.equal(governanceWorstSeverity(r), "fail");
});
