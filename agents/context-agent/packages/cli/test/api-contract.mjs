import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(moduleDir, "../../..");
const cli = path.join(root, "packages", "cli", "bin", "context-os.mjs");

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    json: result.stdout ? JSON.parse(result.stdout) : null,
  };
}

const success = run([
  "routing",
  "lint",
  "--root",
  "examples/reference-saas",
  "--strict",
  "--json",
]);
assert.equal(success.status, 0);
assert.equal(success.json.ok, true);
assert.equal(success.stderr, "");

const gateFailure = run([
  "check",
  "--root",
  "examples/reference-saas",
  "--min-score",
  "85",
  "--max-route-tokens",
  "1",
  "--json",
]);
assert.equal(gateFailure.status, 1);
assert.equal(gateFailure.json.ok, false);
assert.equal(gateFailure.stderr, "");

const commandError = run(["unknown-command", "--json"]);
assert.equal(commandError.status, 2);
assert.equal(commandError.json.ok, false);
assert.equal(commandError.json.error.code, "COMMAND_ERROR");
assert.match(commandError.json.error.message, /Unknown command/);
assert.equal(commandError.stderr, "");

const route = run([
  "route",
  "How does the ingestion API retry?",
  "--root",
  "examples/reference-saas",
  "--json",
]);
assert.equal(route.status, 0);
assert.equal(route.json.ok, true);
assert.deepEqual(route.json.cores, ["technical-core"]);

const profiles = run(["profiles", "--json"]);
assert.equal(profiles.status, 0);
assert.equal(profiles.json.ok, true);
assert.ok(profiles.json.profiles.length >= 4);

const adapters = run(["adapters", "list", "--json"]);
assert.equal(adapters.status, 0);
assert.equal(adapters.json.ok, true);
assert.ok(adapters.json.adapters.some((adapter) => adapter.name === "agents"));

const humanError = run(["unknown-command"]);
assert.equal(humanError.status, 2);
assert.equal(humanError.stdout, "");
assert.match(humanError.stderr, /Unknown command/);

console.log("CLI API contract ok");
