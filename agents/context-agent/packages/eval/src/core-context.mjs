/** Load Condition B context: concatenated routed core markdown files */
import fs from "node:fs";
import path from "node:path";

export function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

/**
 * @param {string} projectRoot
 * @param {string[]} coreIds
 * @param {object} manifest
 */
export function loadCoreContext(projectRoot, coreIds, manifest) {
  const parts = [];
  const files = [];

  for (const id of coreIds) {
    const rel =
      manifest.cores?.[id] ??
      manifest.subcores?.[id] ??
      `context-os/cores/${id}.md`;
    const full = path.join(projectRoot, rel);
    if (!fs.existsSync(full)) {
      parts.push(`\n\n--- CORE: ${id} (MISSING: ${rel}) ---\n`);
      files.push(`${rel} (missing)`);
      continue;
    }
    const text = fs.readFileSync(full, "utf8");
    parts.push(`\n\n--- CORE: ${id} ---\n${text}`);
    files.push(rel);
  }

  const text = parts.join("");
  return {
    condition: "B",
    coreIds,
    files,
    text,
    chars: text.length,
    tokens_est: estimateTokens(text),
  };
}