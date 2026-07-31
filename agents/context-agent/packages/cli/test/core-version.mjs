import assert from "node:assert/strict";
import { verifyCoreContent } from "../src/commands/cores.mjs";

function core(version, date, body = "A") {
  return `| version | ${version} |\n| last_updated | ${date} |\n\n${body}\n`;
}

const unchanged = verifyCoreContent({
  id: "technical-core",
  rel: "context-os/cores/technical-core.md",
  previous: core("1.0.0", "2026-01-01"),
  current: core("1.0.0", "2026-01-01"),
});
assert.equal(unchanged.status, "unchanged");
assert.equal(unchanged.errors.length, 0);

const stale = verifyCoreContent({
  id: "technical-core",
  rel: "context-os/cores/technical-core.md",
  previous: core("1.0.0", "2026-01-01"),
  current: core("1.0.0", "2025-12-31", "Changed"),
});
assert.match(stale.errors.join("\n"), /version greater/);
assert.match(stale.errors.join("\n"), /last_updated not before/);

const bumped = verifyCoreContent({
  id: "technical-core",
  rel: "context-os/cores/technical-core.md",
  previous: core("1.2.0", "2026-01-01"),
  current: core("1.3.0", "2026-02-01", "Changed"),
});
assert.equal(bumped.errors.length, 0);

const invalidNew = verifyCoreContent({
  id: "new-core",
  rel: "context-os/cores/new-core.md",
  previous: null,
  current: core("v1", "today"),
});
assert.equal(invalidNew.errors.length, 2);

console.log("core version lifecycle ok");
