import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanDirectory } from "../scanner/scan-directory.js";
import { draftFlowsFromScan, draftThreatModelFromScan } from "./draft-from-scan.js";

const fixtures = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../examples/fixtures",
);

test("draft-from-scan: creates flows from fixture scan", async () => {
  const report = await scanDirectory(fixtures);
  const flows = draftFlowsFromScan(report);
  assert.ok(flows.length >= 1);
  const hasWeak = flows.some(
    (f) =>
      f.crypto.hash?.includes("MD5") ||
      f.crypto.key_exchange?.some((k) => k.includes("RSA")),
  );
  assert.ok(hasWeak, "draft should capture RSA/MD5 hints");
});

test("draft-from-scan: full model merges with init template", async () => {
  const report = await scanDirectory(fixtures);
  const model = draftThreatModelFromScan(report, "Test Org");
  assert.equal(model.organization.name, "Test Org");
  assert.ok(model.data_flows.length >= 3);
});
