import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { runDefenseCycle } from "./run-cycle.js";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("runDefenseCycle: writes cbom, playbook, tls-reconcile", async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), "safetyos-cycle-"));
  const model = path.join(root, "examples/sample-threat-model.yaml");
  const tls = path.join(root, "examples/tls-configs");

  const result = await runDefenseCycle({
    modelPath: model,
    tlsPath: tls,
    syncTls: true,
    outDir,
    saveBaseline: true,
  });

  const cbom = JSON.parse(await readFile(result.paths.cbom, "utf8"));
  const playbook = await readFile(result.paths.playbook, "utf8");

  assert.ok(cbom.components.some((c: { bom_ref: string }) => c.bom_ref.startsWith("tls-config/")));
  assert.match(playbook, /TLS inventory/);
  assert.ok(result.paths.tls_reconcile);
  assert.ok(result.tls_synced_flow_ids.length >= 0);
});
