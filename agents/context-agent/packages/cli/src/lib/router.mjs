/** Keyword router — same algorithm as Oiloop eval harness */
import fs from "node:fs";
import { routingMapPath } from "./paths.mjs";

const DEFAULT_FALLBACK = "technical-core";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function patternMatches(question, pattern) {
  const q = question.toLowerCase();
  const p = pattern.toLowerCase();
  if (/^[a-z0-9_:.+-]+$/i.test(p)) {
    const re = new RegExp(`(?<![a-z0-9])${escapeRe(p)}(?![a-z0-9])`, "i");
    return re.test(q);
  }
  return q.includes(p);
}

function scoreRoutes(question, map) {
  const scored = [];
  for (const route of map.routes) {
    let hits = 0;
    let maxLen = 0;
    for (const pattern of route.patterns) {
      if (patternMatches(question, pattern)) {
        hits++;
        maxLen = Math.max(maxLen, pattern.length);
      }
    }
    if (hits > 0) scored.push({ route, hits, maxLen });
  }
  scored.sort((a, b) => b.hits - a.hits || b.maxLen - a.maxLen);
  return scored;
}

export function loadRoutingMap(projectRoot) {
  const p = routingMapPath(projectRoot);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/**
 * @param {string} question
 * @param {object} map
 * @returns {string[]}
 */
export function routeQuestion(question, map) {
  const scored = scoreRoutes(question, map);
  const fallback = map.fallback_core ?? DEFAULT_FALLBACK;
  if (scored.length === 0) return [fallback];

  const bestHits = scored[0].hits;
  const bestLen = scored[0].maxLen;
  const matched = new Set();

  for (const { route, hits, maxLen } of scored) {
    if (hits < bestHits) break;
    if (hits === bestHits && maxLen < bestLen) break;
    for (const core of route.cores) matched.add(core);
  }

  return [...matched];
}

export function routingScores(expected, actual) {
  const exp = new Set(expected);
  const act = new Set(actual);
  let intersection = 0;
  for (const c of exp) {
    if (act.has(c)) intersection++;
  }
  const precision = act.size === 0 ? 0 : intersection / act.size;
  const recall = exp.size === 0 ? 1 : intersection / exp.size;
  const f1 =
    precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { precision, recall, f1, intersection, expected: [...exp], actual: [...act] };
}
