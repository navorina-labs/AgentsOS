import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inventoryTlsDirectory } from "./tls-inventory.js";
import { reconcileTlsWithModel } from "./reconcile.js";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";

const tlsFixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/tls-configs",
);
const sampleModel = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/sample-threat-model.yaml",
);

test("tls inventory: detects weak protocols in nginx-weak", async () => {
  const report = await inventoryTlsDirectory(tlsFixtures);
  assert.ok(report.records.length >= 2);
  const weak = report.records.flatMap((r) => r.findings).filter(
    (f) => f.code === "WEAK_TLS_PROTOCOL",
  );
  assert.ok(weak.length >= 1);
  assert.ok(report.summary.inferred_kex.some((k) => /ECDHE|RSA/i.test(k)));
});

test("tls inventory: k8s ingress weak protocols", async () => {
  const ingress = path.join(tlsFixtures, "ingress-weak.yaml");
  const report = await inventoryTlsDirectory(ingress);
  const ingressRec = report.records.filter((r) => r.source === "k8s-ingress");
  assert.ok(ingressRec.length >= 1);
  const weak = ingressRec.flatMap((r) => r.findings).filter(
    (f) => f.code === "WEAK_TLS_PROTOCOL",
  );
  assert.ok(weak.length >= 1);
});

test("tls inventory: traefik minVersion TLS12", async () => {
  const traefik = path.join(tlsFixtures, "traefik-tls.yaml");
  const report = await inventoryTlsDirectory(traefik);
  const tr = report.records.filter((r) => r.source === "traefik");
  assert.ok(tr.length >= 1);
  assert.ok(tr.some((r) => r.protocols.includes("TLSv1.2")));
});

test("tls inventory: apache weak SSLProtocol", async () => {
  const apache = path.join(tlsFixtures, "apache-weak.conf");
  const report = await inventoryTlsDirectory(apache);
  const ap = report.records.filter((r) => r.source === "apache");
  assert.ok(ap.length >= 1);
  const weak = ap.flatMap((r) => r.findings).filter(
    (f) => f.code === "WEAK_TLS_PROTOCOL",
  );
  assert.ok(weak.length >= 1);
});

test("tls inventory: cert-manager ingress weak protocols", async () => {
  const cm = path.join(tlsFixtures, "cert-manager-ingress.yaml");
  const report = await inventoryTlsDirectory(cm);
  const ingress = report.records.filter(
    (r) => r.source === "k8s-ingress" || r.source === "cert-manager",
  );
  assert.ok(ingress.length >= 1);
  const weak = ingress.flatMap((r) => r.findings).filter(
    (f) => f.code === "WEAK_TLS_PROTOCOL",
  );
  assert.ok(weak.length >= 1);
});

test("tls inventory: modern config has TLS 1.2/1.3", async () => {
  const modern = path.join(tlsFixtures, "nginx-modern.conf");
  const report = await inventoryTlsDirectory(modern);
  const protos = report.records.flatMap((r) => r.protocols);
  assert.ok(protos.some((p) => p.includes("TLSv1.3")));
});

test("reconcile: PQC in model but not in weak inventory → drift", async () => {
  const model = await loadThreatModelFromFile(sampleModel);
  const inventory = await inventoryTlsDirectory(tlsFixtures);
  const reconcile = reconcileTlsWithModel(model, inventory);
  const mismatch = reconcile.drifts.filter(
    (d) => d.kind === "model_config_mismatch",
  );
  assert.ok(reconcile.drifts.length >= 1);
  assert.ok(
    mismatch.length >= 1 || reconcile.drifts.some((d) => d.kind === "weak_in_config"),
  );
});
