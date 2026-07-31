#!/usr/bin/env node
/** Decode human-blind-pilot-oiloop.csv → B preference rate using shuffle key. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const CSV_PATH = path.join(root, "research/human-blind-pilot-oiloop.csv");
const KEY_PATH = path.join(root, "research/human-blind-pilot-oiloop-shuffle-key.json");
const OUT_PATH = path.join(root, "research/human-blind-pilot-oiloop-results.md");

function readCsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (cols[i] ?? "").trim();
    });
    return row;
  });
}

function normalizePreference(raw) {
  const s = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (!s) return null;
  if (/^1|answer\s*1|opt(ion)?\s*1/.test(s)) return "answer1";
  if (/^2|answer\s*2|opt(ion)?\s*2/.test(s)) return "answer2";
  if (/equal|tie|same|равн/.test(s)) return "equal";
  if (/neither|none|ни од/.test(s)) return "neither";
  return null;
}

function decodePreference(pref, mapping) {
  const p = normalizePreference(pref);
  if (!p) return { decoded: null, reason: "empty or unrecognized" };
  if (p === "equal") return { decoded: "equal", condition: null };
  if (p === "neither") return { decoded: "neither", condition: null };
  const cond =
    p === "answer1" ? mapping.answer1_condition : mapping.answer2_condition;
  return { decoded: cond === "B" ? "B" : "A", condition: cond };
}

function main() {
  if (!fs.existsSync(CSV_PATH) || !fs.existsSync(KEY_PATH)) {
    console.error("Missing CSV or shuffle key. Run generate-human-blind-pilot.mjs first.");
    process.exit(1);
  }

  const key = JSON.parse(fs.readFileSync(KEY_PATH, "utf8"));
  const rows = readCsv(CSV_PATH);

  let bPreferred = 0;
  let aPreferred = 0;
  let equal = 0;
  let neither = 0;
  let pending = 0;

  const details = [];

  for (const row of rows) {
    const displayId = row.display_id;
    const mapping = key.mapping[displayId];
    if (!mapping) {
      details.push({ displayId, error: "unknown display_id" });
      continue;
    }
    const { decoded } = decodePreference(row.preference, mapping);
    if (!decoded) {
      pending++;
      details.push({
        displayId,
        question_id: mapping.question_id,
        preference: row.preference,
        status: "pending",
      });
      continue;
    }
    if (decoded === "B") bPreferred++;
    else if (decoded === "A") aPreferred++;
    else if (decoded === "equal") equal++;
    else if (decoded === "neither") neither++;

    details.push({
      displayId,
      question_id: mapping.question_id,
      preference: row.preference,
      decoded,
    });
  }

  const rated = bPreferred + aPreferred + equal + neither;
  const bRate = rated > 0 ? ((bPreferred + equal) / rated) * 100 : null;

  const md = `# Human Blind Pilot Results — Oiloop

**Generated:** ${new Date().toISOString()}  
**Source run:** ${key.source_run}  
**Rated:** ${rated}/${rows.length} · **Pending:** ${pending}

## Summary

| Metric | Count |
|--------|-------|
| B preferred | ${bPreferred} |
| A preferred | ${aPreferred} |
| Equal | ${equal} |
| Neither | ${neither} |
| **B preference rate** (B + Equal) | **${bRate !== null ? bRate.toFixed(1) : "—"}%** |

Exit criterion (≥60%): ${bRate !== null && bRate >= 60 ? "**PASS**" : bRate !== null ? "**FAIL**" : "pending ratings"}

## Per question

| display_id | question_id | preference | decoded |
|------------|-------------|------------|---------|
${details.map((d) => `| ${d.displayId} | ${d.question_id ?? "—"} | ${d.preference ?? ""} | ${d.decoded ?? d.status ?? d.error ?? ""} |`).join("\n")}
`;

  fs.writeFileSync(OUT_PATH, md);
  console.log(JSON.stringify({ rated, bPreferred, aPreferred, equal, neither, b_preference_rate_pct: bRate }, null, 2));
  console.error(`Wrote ${OUT_PATH}`);
}

main();
