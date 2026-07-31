/** Condition A: baseline repo slice per baseline-manifest.json */
import fs from "node:fs";
import path from "node:path";
import { estimateTokens } from "./core-context.mjs";

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walkDir(dir, extensions, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkDir(full, extensions, files);
    } else if (extensions.some((ext) => name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

/**
 * @param {string} projectRoot
 * @param {string} manifestPath
 */
export function loadBaselineContext(projectRoot, manifestPath) {
  const manifest = JSON.parse(readUtf8(manifestPath));
  const collected = [];

  for (const rel of manifest.includeRoots ?? []) {
    const abs = path.join(projectRoot, rel);
    if (fs.existsSync(abs)) collected.push(abs);
  }

  for (const { dir, extensions } of manifest.includeDirs ?? []) {
    walkDir(path.join(projectRoot, dir), extensions, collected);
  }

  const exclude = manifest.excludePathContains ?? [];
  const filtered = collected.filter((abs) => {
    const rel = path.relative(projectRoot, abs);
    return !exclude.some((bit) => rel.includes(bit));
  });

  filtered.sort();

  const maxFile = manifest.maxFileChars ?? 14_000;
  const maxTotal = manifest.maxTotalChars ?? 320_000;
  const parts = [];
  const files = [];
  let total = 0;

  for (const abs of filtered) {
    if (total >= maxTotal) break;
    let content = readUtf8(abs);
    const rel = path.relative(projectRoot, abs);
    if (content.length > maxFile) {
      content = `${content.slice(0, maxFile)}\n\n…[truncated ${rel}]`;
    }
    const chunk = `\n\n--- FILE: ${rel} ---\n${content}`;
    if (total + chunk.length > maxTotal) {
      parts.push(chunk.slice(0, maxTotal - total));
      files.push(`${rel} (partial)`);
      total = maxTotal;
      break;
    }
    parts.push(chunk);
    files.push(rel);
    total += chunk.length;
  }

  const text = parts.join("");
  return {
    condition: "A",
    files,
    text,
    chars: text.length,
    tokens_est: estimateTokens(text),
  };
}
