import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { analyzeThreatModel } from "../engine/risk-scorer.js";
import { buildCbomFromThreatModel } from "./cbom.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("cbom: cyclonedx structure from sample model", async () => {
  const model = await loadThreatModelFromFile(sample);
  const analyze = analyzeThreatModel(model);
  const bom = buildCbomFromThreatModel(model, analyze);

  assert.equal(bom.bomFormat, "CycloneDX");
  assert.equal(bom.specVersion, "1.6");
  assert.ok(bom.components.length >= 3);
  assert.ok(bom.components.some((c) => c.bom_ref.startsWith("flow/")));
  assert.ok(bom.components.some((c) => c.name.includes("ML-KEM")));

  const rsa = bom.components.find((c) => c.name.includes("RSA-2048"));
  assert.ok(rsa?.properties?.some((p) => p.name === "safetyos:nist-migration-target"));
  assert.ok(
    rsa?.properties?.some((p) => p.value.includes("ML-KEM")),
  );

  const kem = bom.components.find((c) => c.name.includes("ML-KEM-768"));
  assert.ok(
    kem?.properties?.some((p) => p.value === "migrated-pqc"),
  );
});
