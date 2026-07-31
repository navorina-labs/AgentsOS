/** Reject JavaScript APIs newer than the declared Node 18 runtime floor */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const currentFile = fileURLToPath(import.meta.url);
const root = path.resolve(moduleDir, "..");
const forbidden = [
  ["import.meta.dirname", /import\.meta\.dirname/],
  ["import.meta.filename", /import\.meta\.filename/],
  ["Array.prototype.toSorted", /\.toSorted\s*\(/],
  ["Array.prototype.toReversed", /\.toReversed\s*\(/],
  ["Array.prototype.toSpliced", /\.toSpliced\s*\(/],
  ["Array.fromAsync", /Array\.fromAsync\s*\(/],
];
const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (full === currentFile) continue;
    if (entry.isDirectory()) walk(full);
    else if (/\.(?:mjs|js)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      for (const [name, pattern] of forbidden) {
        if (pattern.test(text)) violations.push(`${path.relative(root, full)}: ${name}`);
      }
    }
  }
}

for (const rel of ["packages", "scripts"]) walk(path.join(root, rel));
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Node 18 API compatibility scan ok");
}
