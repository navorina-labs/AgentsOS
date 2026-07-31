import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { runFullAssessment } from "../engine/assess.js";
import { inventoryTlsDirectory } from "../inventory/tls-inventory.js";
import { renderAssessHtml } from "./assess-html-report.js";

const sample = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("assess html: renders dashboard sections", async () => {
  const model = await loadThreatModelFromFile(sample);
  const html = renderAssessHtml(runFullAssessment(model));

  assert.match(html, /<!DOCTYPE html>/);
  assert.match(html, /Defense Assessment/);
  assert.match(html, /class="grid"/);
  assert.match(html, /Encrypted backups|backup-archive/);
  assert.match(html, /Assurance/);
});

test("assess html: tls section when inventory provided", async () => {
  const model = await loadThreatModelFromFile(sample);
  const tls = await inventoryTlsDirectory(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../../examples/tls-configs"),
  );
  const html = renderAssessHtml(runFullAssessment(model, { tlsInventory: tls }));
  assert.match(html, /TLS inventory/);
  assert.match(html, /Drift/);
  assert.match(html, /TLS drift/);
});
