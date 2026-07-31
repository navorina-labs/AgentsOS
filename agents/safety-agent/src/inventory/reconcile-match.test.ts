import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { inventoryTlsDirectory } from "./tls-inventory.js";
import { reconcileTlsWithModel } from "./reconcile.js";
import { matchRecordsToFlows, scoreRecordToFlow } from "./reconcile-match.js";
import type { ThreatModel } from "../types/threat-model.js";
import type { TlsInventoryReport } from "./types.js";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("reconcile match: sample public-api links to nginx record", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs/nginx-weak.conf"),
  );
  const flow = model.data_flows.find((f) => f.id === "api-tls")!;
  const record = inv.records.find((r) => r.source === "nginx")!;
  const score = scoreRecordToFlow(record, flow);
  assert.ok(score >= 8);
  const map = matchRecordsToFlows(inv.records, [flow]);
  assert.equal(map.get(record.id), "api-tls");
});

test("reconcile: matched and flow_id on critical drifts", async () => {
  const model = await loadThreatModelFromFile(
    path.join(root, "examples/sample-threat-model.yaml"),
  );
  const inv = await inventoryTlsDirectory(
    path.join(root, "examples/tls-configs"),
  );
  const rec = reconcileTlsWithModel(model, inv);
  assert.ok((rec.matched?.length ?? 0) >= 1);
  const crit = rec.drifts.filter((d) => d.severity === "critical");
  assert.ok(crit.some((d) => d.flow_id));
});

test("reconcile: compares each flow only with its matched records", () => {
  const model: ThreatModel = {
    version: "1",
    organization: {
      name: "Isolation test",
      migration_years: 2,
      quantum_horizon_years: 10,
    },
    adversary: {
      classical: true,
      quantum_record: false,
      ai_implementation: false,
    },
    data_flows: [
      {
        id: "nginx-edge",
        name: "Nginx edge",
        storage: "short",
        crypto: {
          key_exchange: ["ML-KEM-768"],
          signatures: [],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        tags: ["nginx", "tls"],
      },
      {
        id: "apache-edge",
        name: "Apache edge",
        storage: "short",
        crypto: {
          key_exchange: ["ML-KEM-768"],
          signatures: [],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        tags: ["apache", "tls"],
      },
    ],
  };
  const inventory: TlsInventoryReport = {
    root: "/deploy",
    files_scanned: 2,
    records: [
      {
        id: "nginx-record",
        file: "/deploy/nginx.conf",
        line: 1,
        source: "nginx",
        snippet: "",
        protocols: ["TLSv1.3"],
        cipher_suites: [],
        inferred: {
          key_exchange: ["ML-KEM-768"],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        findings: [],
      },
      {
        id: "apache-record",
        file: "/deploy/apache.conf",
        line: 1,
        source: "apache",
        snippet: "",
        protocols: ["TLSv1.3"],
        cipher_suites: [],
        inferred: {
          key_exchange: ["ECDHE"],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        findings: [],
      },
    ],
    summary: {
      weak_protocols: 0,
      records_with_issues: 0,
      inferred_kex: ["ML-KEM-768", "ECDHE"],
    },
  };

  const result = reconcileTlsWithModel(model, inventory);
  const pqcMismatches = result.drifts.filter(
    (d) =>
      d.kind === "model_config_mismatch" &&
      d.message.includes("в модели PQC"),
  );
  assert.deepEqual(
    pqcMismatches.map((d) => d.flow_id),
    ["apache-edge"],
  );
});
