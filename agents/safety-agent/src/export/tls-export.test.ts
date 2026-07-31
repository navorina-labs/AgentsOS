import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runFullAssessment } from "../engine/assess.js";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { inventoryTlsDirectory } from "../inventory/tls-inventory.js";
import { enrichCbomWithTls, renderTlsPlaybookSection } from "./tls-export.js";
import { buildCbomFromThreatModel } from "./cbom.js";
import { analyzeThreatModel } from "../engine/risk-scorer.js";
import { reconcileTlsWithModel } from "../inventory/reconcile.js";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("enrichCbomWithTls adds config components and drift metadata", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs"),
  );
  const reconcile = reconcileTlsWithModel(model, inv);
  const analyze = analyzeThreatModel(model);
  const base = buildCbomFromThreatModel(model, analyze);
  const bom = enrichCbomWithTls(base, inv, reconcile);

  assert.ok(
    bom.components.some((c) => c.bom_ref.startsWith("tls-config/")),
  );
  assert.ok(
    bom.metadata.properties?.some((p) => p.name === "safetyos:tls-drift-count"),
  );
});

test("renderTlsPlaybookSection includes drifts when tls present", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs"),
  );
  const full = runFullAssessment(model, { tlsInventory: inv });
  const section = renderTlsPlaybookSection(full);
  assert.match(section, /TLS inventory/);
  assert.match(section, /Drift/);
});
