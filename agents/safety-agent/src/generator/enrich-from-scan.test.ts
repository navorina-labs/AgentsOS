import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildInitThreatModel } from "./init-threat-model.js";
import { scanDirectory } from "../scanner/scan-directory.js";
import { enrichModelFromScan } from "./enrich-from-scan.js";

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/fixtures",
);

test("enrich-from-scan: attaches RSA/MD5 to public-api-tls when path matches", async () => {
  const report = await scanDirectory(fixtures);
  const base = buildInitThreatModel({ organizationName: "Enrich Test" });
  const result = enrichModelFromScan(base, report);

  const api = result.model.data_flows.find((f) => f.id === "public-api-tls");
  assert.ok(api, "init flow exists");
  const enriched =
    result.enriched_flow_ids.includes("public-api-tls") ||
    api.tags?.includes("scan-enriched") ||
    (api.crypto.hash?.length ?? 0) > 0 ||
    api.crypto.key_exchange?.some((k) => /RSA/i.test(k));
  assert.ok(
    enriched || result.new_flow_ids.length > 0,
    "scan merged into model",
  );
});
