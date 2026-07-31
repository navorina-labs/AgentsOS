/** CLI router subcommands — embed (semantic index) */
import path from "node:path";
import fs from "node:fs";
import { buildRouterEmbeddings, loadRouterEmbeddings } from "@context-os/eval";
import { parseGlobalFlags, routingMapPath } from "../lib/paths.mjs";
import { loadRoutingMap } from "../lib/router.mjs";

export async function cmdRouter(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0];

  if (sub === "embed" || sub === "embeddings") {
    await routerEmbed(global.root, rest.slice(1));
    return;
  }

  if (sub === "status") {
    routerStatus(global.root);
    return;
  }

  console.log(`context-os router — semantic routing helpers

Subcommands:
  embed      Build context-os/router/embeddings.json (needs OPENAI_API_KEY)
  status     Check if semantic embeddings exist

Examples:
  context-os router embed
  context-os route "Why did MRR drop?" --router semantic
  context-os eval route --router semantic

Env: OPENAI_API_KEY, EVAL_EMBED_MODEL (default text-embedding-3-small)
`);
}

async function routerEmbed(projectRoot, restArgv) {
  let out = null;
  for (let i = 0; i < restArgv.length; i++) {
    if (restArgv[i] === "--out" && restArgv[i + 1]) out = restArgv[++i];
  }

  const map = loadRoutingMap(projectRoot);
  console.log(`Embedding ${map.routes.length} routes from ${routingMapPath(projectRoot)}…`);

  const result = await buildRouterEmbeddings(
    projectRoot,
    map,
    out ? path.resolve(out) : undefined
  );

  console.log(`Wrote ${result.outPath} (${result.routeCount} routes, ${result.model})`);
}

function routerStatus(projectRoot) {
  const emb = loadRouterEmbeddings(projectRoot);
  const mapPath = routingMapPath(projectRoot);

  if (!emb) {
    console.log(`Semantic router: not built`);
    console.log(`  routing-map: ${mapPath}`);
    console.log(`  Run: context-os router embed`);
    process.exitCode = 1;
  }

  console.log(`Semantic router: ready`);
  console.log(`  model: ${emb.model}`);
  console.log(`  routes: ${emb.routes?.length ?? 0}`);
  console.log(`  built: ${emb.built_at ?? "—"}`);
}
