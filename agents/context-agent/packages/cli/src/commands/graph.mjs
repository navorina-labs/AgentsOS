/** context-os graph build — Hermes-style index for Condition C */
import path from "node:path";
import fs from "node:fs";
import { buildGraphIndex } from "@context-os/eval";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";

export async function cmdGraph(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0];

  if (sub === "build" || !sub) {
    await graphBuild(global.root, rest.slice(1));
    return;
  }

  console.log(`context-os graph — code graph for Condition C eval

Subcommands:
  build    Scan repo + cores → context-os/graph/graph-index.json

Examples:
  context-os graph build --root .
  context-os eval run --condition abc   # uses graph-index if present
`);
}

async function graphBuild(projectRoot, restArgv) {
  let out = null;
  for (let i = 0; i < restArgv.length; i++) {
    if (restArgv[i] === "--out" && restArgv[i + 1]) out = restArgv[++i];
  }

  const manifest = loadManifest(projectRoot);
  const configPath = path.join(projectRoot, "context-os/graph/graph-config.json");
  const stubPath = path.join(projectRoot, "context-os/graph/graph-config.stub.json");
  if (!fs.existsSync(configPath) && fs.existsSync(stubPath)) {
    fs.copyFileSync(stubPath, configPath);
  }

  const result = buildGraphIndex({
    projectRoot,
    manifest,
    outPath: out ? path.resolve(out) : undefined,
  });

  console.log(
    `Wrote ${result.outPath} (${result.stats.nodes} nodes, ${result.stats.edges} edges, ${result.stats.files} files, ${result.stats.concepts} concepts)`
  );
}
