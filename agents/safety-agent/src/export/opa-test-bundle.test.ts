import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import {
  generateOpaTestRego,
  writeOpaTestBundle,
} from "./opa-test-bundle.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("opa bundle: writes rego and test file", async () => {
  const model = await loadThreatModelFromFile(sample);
  const tmp = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../reports/opa-bundle-test",
  );
  const { files } = await writeOpaTestBundle(model, tmp);
  assert.ok(files.some((f) => f.endsWith("policy.rego")));
  assert.ok(files.some((f) => f.endsWith("safetyos_test.rego")));
  assert.ok(files.some((f) => f.endsWith("ai-governance.rego")));
});

test("opa bundle: test rego references package", async () => {
  const model = await loadThreatModelFromFile(sample);
  const rego = generateOpaTestRego(model);
  assert.match(rego, /package sec_test/);
  assert.match(rego, /data\.safetyos\.ai/);
});
