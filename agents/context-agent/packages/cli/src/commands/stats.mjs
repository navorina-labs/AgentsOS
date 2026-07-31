/** Estimate context size for routed cores (chars + token est) */
import fs from "node:fs";
import path from "node:path";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";
import { loadRoutingMap, routeQuestion } from "../lib/router.mjs";

function readCoreChars(projectRoot, manifest, coreId) {
  const rel =
    manifest.cores?.[coreId] ??
    manifest.subcores?.[coreId] ??
    `context-os/cores/${coreId}.md`;
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) return { coreId, rel, chars: 0, missing: true };
  const text = fs.readFileSync(full, "utf8");
  return { coreId, rel, chars: text.length, missing: false };
}

export async function cmdStats(argv) {
  const { opts, rest } = parseGlobalFlags(argv);
  const json = rest.includes("--json");
  const question = rest.filter((arg) => arg !== "--json").join(" ").trim();

  if (!question) {
    throw new Error('Usage: context-os stats "<question>" [--root DIR]');
  }

  const manifest = loadManifest(opts.root);
  const map = loadRoutingMap(opts.root);
  const cores = routeQuestion(question, map);
  const parts = cores.map((id) => readCoreChars(opts.root, manifest, id));
  const totalChars = parts.reduce((s, p) => s + p.chars, 0);
  const tokensEst = Math.ceil(totalChars / 4);

  const out = {
    ok: true,
    question,
    cores,
    total_chars: totalChars,
    tokens_est: tokensEst,
    files: parts.map((p) => ({ core: p.coreId, path: p.rel, chars: p.chars })),
  };

  if (!json && process.stdout.isTTY) {
    console.log(`Question: ${question}`);
    console.log(`Cores: ${cores.join(", ")}`);
    for (const p of parts) {
      console.log(`  ${p.coreId}: ${p.chars} chars (${p.rel})`);
    }
    console.log(`Total: ${totalChars} chars · ~${tokensEst} tokens (÷4 est.)`);
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}
