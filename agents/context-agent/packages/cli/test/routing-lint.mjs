import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildRoutingLintReport } from "../src/commands/routing.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "context-os-routing-lint-"));
fs.mkdirSync(path.join(root, "context-os", "router"), { recursive: true });
fs.mkdirSync(path.join(root, "context-os", "eval"), { recursive: true });
fs.writeFileSync(
  path.join(root, "context-os", "router", "routing-map.json"),
  JSON.stringify({
    routes: [
      { patterns: ["api", "user"], cores: ["technical-core"] },
      { patterns: ["API"], cores: ["product-core"] },
      { patterns: ["deploy"], cores: ["operational-core"] },
    ],
  })
);
fs.writeFileSync(
  path.join(root, "context-os", "eval", "questions.json"),
  JSON.stringify([{ id: "Q1", question: "Where is the API?", expected_cores: ["technical-core"] }])
);

try {
  const report = buildRoutingLintReport(root);
  assert.equal(report.ok, false);
  assert.match(report.errors.join("\n"), /pattern "api" conflicts/);
  assert.match(report.warnings.join("\n"), /overly generic/);
  assert.match(report.warnings.join("\n"), /no question-bank coverage/);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log("routing lint conflict detection ok");
