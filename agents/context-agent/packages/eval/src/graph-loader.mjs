/** Condition C: graph retrieval from context-os/graph/graph-index.json (optional) */
import fs from "node:fs";
import path from "node:path";
import { estimateTokens } from "./core-context.mjs";

function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2)
  );
}

function scoreNode(node, qTokens) {
  const kws = new Set(node.keywords ?? []);
  for (const t of node.topics ?? []) kws.add(t.toLowerCase());
  if (node.label) tokenize(node.label).forEach((t) => kws.add(t));
  let score = 0;
  for (const t of qTokens) {
    if (kws.has(t)) score += 2;
    for (const k of kws) {
      if (k.includes(t) || t.includes(k)) score += 1;
    }
  }
  return score;
}

function readSnippet(root, relPath, maxChars) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return null;
  const content = fs.readFileSync(abs, "utf8");
  if (content.length <= maxChars) return content;
  return `${content.slice(0, maxChars)}\n\n…[truncated ${relPath}]`;
}

function neighbors(index, nodeId) {
  const out = [];
  for (const e of index.edges ?? []) {
    if (e.from === nodeId) out.push(e.to);
    if (e.to === nodeId) out.push(e.from);
  }
  return out;
}

/**
 * @param {string} projectRoot
 * @param {string} question
 * @param {{ indexPath?: string, maxTotalChars?: number, maxFileChars?: number, maxFiles?: number, hops?: number, routedCoreIds?: string[] }} [opts]
 */
export function loadGraphContext(projectRoot, question, opts = {}) {
  const indexPath =
    opts.indexPath ?? path.join(projectRoot, "context-os/graph/graph-index.json");

  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `Graph index missing at ${indexPath}. Run: context-os graph build`
    );
  }

  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const qTokens = tokenize(question);
  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  const hops = opts.hops ?? 2;
  const maxTotal = opts.maxTotalChars ?? 80_000;
  const maxFile = opts.maxFileChars ?? 6_000;
  const maxFiles = opts.maxFiles ?? 18;

  const scores = new Map();
  for (const n of index.nodes) {
    const s = scoreNode(n, qTokens);
    if (s > 0) scores.set(n.id, s);
  }

  for (const coreId of opts.routedCoreIds ?? []) {
    const cid = coreId.startsWith("concept:") ? coreId : `concept:${coreId}`;
    if (byId.has(cid)) scores.set(cid, (scores.get(cid) ?? 0) + 5);
  }

  let seeds = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);

  if (seeds.length === 0) {
    seeds = index.nodes
      .filter((n) => n.type === "concept")
      .slice(0, 2)
      .map((n) => n.id);
    if (index.nodes.some((n) => n.path === "README.md")) {
      seeds.push("file:README.md");
    }
  }

  const visited = new Set(seeds);
  const frontier = [...seeds];
  for (let h = 0; h < hops; h++) {
    const next = [];
    for (const id of frontier) {
      for (const nb of neighbors(index, id)) {
        if (!visited.has(nb)) {
          visited.add(nb);
          next.push(nb);
        }
      }
    }
    frontier.push(...next);
  }

  const subgraphNodes = [...visited].map((id) => byId.get(id)).filter(Boolean);

  const filePaths = new Map();
  for (const n of subgraphNodes) {
    const rel = n.path ?? n.source;
    if (!rel || rel.startsWith("context-os/")) {
      if (n.source && fs.existsSync(path.join(projectRoot, n.source))) {
        filePaths.set(n.source, (filePaths.get(n.source) ?? 0) + (scores.get(n.id) ?? 3));
      }
      continue;
    }
    filePaths.set(rel, (filePaths.get(rel) ?? 0) + (scores.get(n.id) ?? 1));
  }

  const rankedFiles = [...filePaths.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxFiles)
    .map(([p]) => p);

  const parts = [];
  parts.push("## Knowledge graph (retrieved subgraph)\n");
  parts.push(`Seeds: ${seeds.join(", ")}\n`);
  parts.push(`Nodes (${subgraphNodes.length}):\n`);
  for (const n of subgraphNodes.slice(0, 30)) {
    parts.push(`- [${n.type}] ${n.label ?? n.id}\n`);
  }

  parts.push("\n## Source snippets (graph-linked)\n");
  const files = [];
  let total = parts.join("").length;

  for (const relPath of rankedFiles) {
    const snippet = readSnippet(projectRoot, relPath, maxFile);
    if (!snippet) continue;
    const chunk = `\n\n--- FILE: ${relPath} ---\n${snippet}`;
    if (total + chunk.length > maxTotal) break;
    parts.push(chunk);
    files.push(relPath);
    total += chunk.length;
  }

  const text = parts.join("") || "(empty graph context)";
  return {
    condition: "C",
    files,
    text,
    chars: text.length,
    tokens_est: estimateTokens(text),
  };
}

export function graphIndexExists(projectRoot) {
  return fs.existsSync(path.join(projectRoot, "context-os/graph/graph-index.json"));
}
