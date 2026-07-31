/** Prove that published package artifacts work without monorepo workspace links */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, "../../..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "context-os-install-"));
const packDir = path.join(tempRoot, "packs");
const consumerDir = path.join(tempRoot, "consumer");
const projectDir = path.join(tempRoot, "project");
fs.mkdirSync(packDir);
fs.mkdirSync(consumerDir);
fs.mkdirSync(projectDir);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    env: { ...process.env, npm_config_update_notifier: "false" },
  });
}

function pack(workspace) {
  const output = run(
    "npm",
    ["pack", "--workspace", workspace, "--pack-destination", packDir, "--json"],
    { capture: true }
  );
  const result = JSON.parse(output)[0];
  if (!result?.filename) throw new Error(`npm pack returned no filename for ${workspace}`);
  return path.join(packDir, result.filename);
}

try {
  const tarballs = [
    pack("packages/schemas"),
    pack("packages/eval"),
    pack("packages/cli"),
  ];

  run("npm", ["init", "--yes"], { cwd: consumerDir });
  run(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", ...tarballs],
    { cwd: consumerDir }
  );

  run(
    "node",
    [
      "--input-type=module",
      "-e",
      "await import('@context-os/eval'); const {default: schema} = await import('@context-os/schemas/manifest'); if (schema.title !== 'Context OS Manifest') throw new Error('schema export failed');",
    ],
    { cwd: consumerDir }
  );

  const cli = path.join(consumerDir, "node_modules", ".bin", "context-os");
  run(cli, ["--version"], { cwd: consumerDir });
  run(cli, ["init", "--name", "tarball-smoke", "--profile", "minimal", "--target", projectDir]);
  fs.copyFileSync(
    path.join(projectDir, "context-os", "eval", "questions.stub.json"),
    path.join(projectDir, "context-os", "eval", "questions.json")
  );
  run(cli, ["doctor", "--root", projectDir]);
  run(cli, ["check", "--root", projectDir, "--min-score", "0"]);

  console.log(`tarball install smoke ok: ${tarballs.map((file) => path.basename(file)).join(", ")}`);
} finally {
  if (process.env.KEEP_CONTEXT_OS_SMOKE !== "1") {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  } else {
    console.log(`smoke artifacts kept at ${tempRoot}`);
  }
}
