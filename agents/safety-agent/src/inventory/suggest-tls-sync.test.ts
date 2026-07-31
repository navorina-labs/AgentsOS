import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { inventoryTlsDirectory } from "./tls-inventory.js";
import { applyTlsFlowSync, suggestTlsFlowSync } from "./suggest-tls-sync.js";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("suggest tls sync: returns crypto patch for matched flow", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs/nginx-modern.conf"),
  );
  const suggestions = suggestTlsFlowSync(model, inv);
  const pub = suggestions.find((s) => s.flow_id === "api-tls");
  assert.ok(pub?.crypto_patch);
  assert.ok((pub.crypto_patch?.key_exchange.length ?? 0) > 0);
});

test("applyTlsFlowSync: writes crypto into matched flow", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs/nginx-modern.conf"),
  );
  const suggestions = suggestTlsFlowSync(model, inv);
  const applied = applyTlsFlowSync(model, suggestions);
  const pub = applied.data_flows.find((f) => f.id === "api-tls");
  assert.ok(pub?.crypto.key_exchange.length);
  assert.ok(pub?.tags?.includes("tls"));
});
