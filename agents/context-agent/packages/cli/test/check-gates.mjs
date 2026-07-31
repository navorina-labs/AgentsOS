import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evalDryRunReport, evalRouteReport } from "../src/commands/check.mjs";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(moduleDir, "../../../examples/reference-saas");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "context-os-check-gates-"));
const emptyQuestions = path.join(temp, "questions.json");
fs.writeFileSync(emptyQuestions, "[]\n");

try {
  const route = evalRouteReport(root, emptyQuestions);
  assert.equal(route.ok, false);
  assert.equal(route.questions, 0);

  const dryRun = await evalDryRunReport(root, emptyQuestions, 2000);
  assert.equal(dryRun.ok, false);
  assert.equal(dryRun.summary.questions, 0);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

console.log("check empty-question gates ok");
