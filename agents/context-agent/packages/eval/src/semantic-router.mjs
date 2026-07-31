/** Semantic router — embedding similarity over routing-map routes */
import fs from "node:fs";
import path from "node:path";
import { embedTexts, cosineSimilarity } from "./embeddings.mjs";

const DEFAULT_MARGIN = 0.02;

export function routeText(route) {
  const patterns = route.patterns.join("; ");
  const cores = route.cores.join(", ");
  return `${patterns} → ${cores}`;
}

export function loadRouterEmbeddings(projectRoot) {
  const p = path.join(projectRoot, "context-os/router/embeddings.json");
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/**
 * Top route(s) by cosine similarity; merge routes within margin of best score.
 * @param {number[]} qVec
 * @param {object} index
 * @param {string} [fallbackCore]
 */
export function routeQuestionFromVector(qVec, index, fallbackCore = "technical-core") {
  const scored = index.routes.map((r) => ({
    cores: r.cores,
    score: cosineSimilarity(qVec, r.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0]?.score ?? 0;
  const threshold = best - DEFAULT_MARGIN;
  const matched = new Set();

  for (const row of scored) {
    if (row.score < threshold) break;
    for (const core of row.cores) matched.add(core);
  }

  if (matched.size === 0) return [fallbackCore];
  return [...matched];
}

/**
 * @param {string} question
 * @param {object} opts
 * @param {object} [opts.index]
 * @param {string} [opts.projectRoot]
 * @param {object} [opts.routingMap]
 * @param {function} [opts.keywordRoute] - (question, map) => string[]
 */
export async function routeQuestionSemantic(question, opts) {
  const index =
    opts.index ??
    (opts.projectRoot ? loadRouterEmbeddings(opts.projectRoot) : null);

  if (!index?.routes?.length) {
    if (opts.keywordRoute && opts.routingMap) {
      return opts.keywordRoute(question, opts.routingMap);
    }
    throw new Error(
      "No router embeddings. Run: context-os router embed (needs OPENAI_API_KEY)"
    );
  }

  const fallback =
    opts.routingMap?.fallback_core ?? opts.fallbackCore ?? "technical-core";
  const [qVec] = await embedTexts([question]);
  return routeQuestionFromVector(qVec, index, fallback);
}

/**
 * Build context-os/router/embeddings.json from routing-map.json
 * @param {string} projectRoot
 * @param {object} routingMap
 * @param {string} [outPath]
 */
export async function buildRouterEmbeddings(projectRoot, routingMap, outPath) {
  const routes = routingMap.routes.map((route, index) => ({
    index,
    patterns: route.patterns,
    cores: route.cores,
    text: routeText(route),
  }));

  const vectors = await embedTexts(routes.map((r) => r.text));
  const model = process.env.EVAL_EMBED_MODEL ?? "text-embedding-3-small";

  const out = {
    version: "1.0.0",
    model,
    built_at: new Date().toISOString(),
    routes: routes.map((r, i) => ({
      index: r.index,
      cores: r.cores,
      patterns: r.patterns,
      text: r.text,
      embedding: vectors[i],
    })),
  };

  const dest =
    outPath ?? path.join(projectRoot, "context-os/router/embeddings.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, `${JSON.stringify(out)}\n`, "utf8");

  return { outPath: dest, routeCount: routes.length, model };
}
