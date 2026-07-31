import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildScoreReport } from "../src/commands/score.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "context-os-score-"));
fs.mkdirSync(path.join(root, "context-os", "cores"), { recursive: true });
fs.mkdirSync(path.join(root, "context-os", "router"), { recursive: true });
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "source.md"), "# Source\n");

const core = `| last_updated | 2026-06-27 |

## Purpose
Make technical decisions.
## Scope
Architecture and implementation boundaries.
## Key Entities
API and storage.
## Invariants
Contracts remain compatible.
## Sources
| Type | Reference | Description |
|---|---|---|
| document | docs/source.md | Canonical source |
## Exclusions
Business metrics.
## Typical Outputs
Implementation plans.
`;
fs.writeFileSync(path.join(root, "context-os", "cores", "technical-core.md"), core);
fs.writeFileSync(path.join(root, "context-os", "cores", "orphan-core.md"), core);
fs.writeFileSync(
  path.join(root, "context-os", "manifest.json"),
  JSON.stringify({
    cores: {
      "technical-core": "context-os/cores/technical-core.md",
      "orphan-core": "context-os/cores/orphan-core.md",
    },
  })
);
fs.writeFileSync(
  path.join(root, "context-os", "router", "routing-map.json"),
  JSON.stringify({
    fallback_core: "technical-core",
    routes: [{ patterns: ["api"], cores: ["technical-core"] }],
  })
);

let report = buildScoreReport(root);
assert.equal(report.architecture.ok, false);
assert.deepEqual(report.architecture.orphan_cores, ["orphan-core"]);

const routingPath = path.join(root, "context-os", "router", "routing-map.json");
fs.writeFileSync(
  routingPath,
  JSON.stringify({
    fallback_core: "technical-core",
    routes: [{ patterns: ["other"], cores: ["orphan-core"] }],
  })
);
report = buildScoreReport(root);
assert.equal(report.architecture.ok, true);

fs.writeFileSync(
  path.join(root, "context-os", "cores", "technical-core.md"),
  core.replace("docs/source.md", "docs/missing.md")
);
report = buildScoreReport(root);
assert.equal(report.architecture.ok, false);
assert.deepEqual(report.architecture.missing_sources, [
  { core: "technical-core", reference: "docs/missing.md" },
]);

fs.writeFileSync(
  path.join(root, "context-os", "cores", "technical-core.md"),
  core.replace("docs/source.md", "../outside.md")
);
report = buildScoreReport(root);
assert.match(report.architecture.errors.join("\n"), /escapes project root/);

fs.rmSync(root, { recursive: true, force: true });
console.log("score architecture ok");
