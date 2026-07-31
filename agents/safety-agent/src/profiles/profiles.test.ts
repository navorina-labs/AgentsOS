import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { listProfiles, loadProfileById } from "./load-profile.js";
import { buildInitThreatModel } from "../generator/init-threat-model.js";
import { applyProfileToModel } from "./apply-profile.js";
import { analyzeThreatModel } from "../engine/risk-scorer.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("profiles: list includes fintech", async () => {
  const all = await listProfiles();
  assert.ok(all.length >= 6);
  assert.ok(all.some((p) => p.id === "fintech"));
  assert.ok(all.some((p) => p.id === "web3"));
  assert.ok(all.some((p) => p.id === "messaging"));
});

test("profiles: messaging E2EE defaults", async () => {
  const profile = await loadProfileById("messaging");
  assert.equal(profile.defaults?.confidentiality_years, 25);
  assert.ok(
    profile.recommended_policies?.some((p) => p.id === "msg-no-rsa-identity"),
  );
});

test("profiles: web3 long confidentiality default", async () => {
  const profile = await loadProfileById("web3");
  assert.equal(profile.defaults?.confidentiality_years, 20);
  assert.ok(profile.recommended_policies?.some((p) => p.id.startsWith("web3-")));
});

test("profiles: messaging merge starter flows + ai template", () => {
  let model = buildInitThreatModel({ organizationName: "ChatCo" });
  model = { ...model, ai_governance: undefined };
  const profile = loadProfileById("messaging");
  return profile.then((p) => {
    const applied = applyProfileToModel(model, p, { mergeStarterFlows: true });
    assert.ok(applied.data_flows.some((f) => f.id === "e2ee-session"));
    assert.ok(applied.data_flows.some((f) => f.id === "public-api-tls"));
    assert.ok(applied.ai_governance);
  });
});

test("profiles: apply fintech tightens mosca and adds policies", async () => {
  const model = await loadThreatModelFromFile(sample);
  const profile = await loadProfileById("fintech");
  const applied = applyProfileToModel(model, profile);
  assert.equal(applied.organization.migration_years, 2);
  assert.ok(
    applied.policies?.some((p) => p.id === "fintech-no-rsa-permanent"),
  );
  const report = analyzeThreatModel(applied);
  assert.ok(report.summary.policy_blocks >= 2);
});
