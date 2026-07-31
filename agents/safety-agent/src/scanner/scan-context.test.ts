import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanDirectory } from "./scan-directory.js";
import { applicationCriticalFindings } from "./scan-context.js";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("scan context: SafetyOS src has no application critical weak-hash", async () => {
  const report = await scanDirectory(path.join(root, "src"));
  const appCritical = applicationCriticalFindings(report.findings, report.root);
  assert.equal(
    appCritical.length,
    0,
    appCritical.map((f) => `${f.file}:${f.line} ${f.pattern_id}`).join("; "),
  );
});

test("scan context: fixtures still have application critical", async () => {
  const report = await scanDirectory(
    path.join(root, "examples/fixtures"),
  );
  const appCritical = applicationCriticalFindings(report.findings, report.root);
  assert.ok(appCritical.length >= 1);
});
