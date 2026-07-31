#!/usr/bin/env node
/** Decode blind survey scores back to Condition A (Full Repo) and B (Routed Cores) */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const surveyPath = path.join(root, "docs", "expert-survey.md");
const keyPath = path.join(root, "research", "survey-key.json");
const outPath = path.join(root, "docs", "expert-validation-results.md");

function parseSurvey(mdContent) {
  const qregex = /## Question (OL\d+):[\s\S]*?- \*\*Preferred Option [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 1 Accuracy [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 1 Completeness [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 1 Actionability [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 2 Accuracy [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 2 Completeness [^:]*:\*\* \[([^\]]*)\][\s\S]*?- \*\*Option 2 Actionability [^:]*:\*\* \[([^\]]*)\]/g;
  
  const scores = {};
  let match;
  while ((match = qregex.exec(mdContent)) !== null) {
    const qid = match[1];
    scores[qid] = {
      preferred: match[2].trim(),
      opt1_acc: parseFloat(match[3]),
      opt1_comp: parseFloat(match[4]),
      opt1_act: parseFloat(match[5]),
      opt2_acc: parseFloat(match[6]),
      opt2_comp: parseFloat(match[7]),
      opt2_act: parseFloat(match[8]),
    };
  }
  return scores;
}

function main() {
  if (!fs.existsSync(surveyPath) || !fs.existsSync(keyPath)) {
    console.error("Survey file or key file missing!");
    process.exit(1);
  }

  const surveyMd = fs.readFileSync(surveyPath, "utf8");
  const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  const parsed = parseSurvey(surveyMd);

  const qids = Object.keys(parsed);
  if (qids.length === 0) {
    console.error("No graded questions found in survey!");
    process.exit(1);
  }

  let total = 0;
  let bPreferred = 0;
  let aPreferred = 0;
  let bothEqual = 0;
  let neitherPreferred = 0;

  let sumAccA = 0, sumAccB = 0;
  let sumCompA = 0, sumCompB = 0;
  let sumActA = 0, sumActB = 0;

  const decodedRows = [];

  for (const qid of qids) {
    const s = parsed[qid];
    const k = key[qid];
    if (!k) continue;

    total++;

    const isOpt1A = k.option_1 === "A";
    const accA = isOpt1A ? s.opt1_acc : s.opt2_acc;
    const accB = isOpt1A ? s.opt2_acc : s.opt1_acc;

    const compA = isOpt1A ? s.opt1_comp : s.opt2_comp;
    const compB = isOpt1A ? s.opt2_comp : s.opt1_comp;

    const actA = isOpt1A ? s.opt1_act : s.opt2_act;
    const actB = isOpt1A ? s.opt2_act : s.opt1_act;

    sumAccA += accA;
    sumAccB += accB;
    sumCompA += compA;
    sumCompB += compB;
    sumActA += actA;
    sumActB += actB;

    let preferredCond = "Both";
    if (s.preferred === "1") {
      preferredCond = k.option_1;
    } else if (s.preferred === "2") {
      preferredCond = k.option_2;
    } else if (s.preferred.toLowerCase() === "neither") {
      preferredCond = "Neither";
    }

    if (preferredCond === "B") bPreferred++;
    else if (preferredCond === "A") aPreferred++;
    else if (preferredCond === "Both") bothEqual++;
    else neitherPreferred++;

    decodedRows.push({
      qid,
      preferredCond,
      accA,
      accB,
      compA,
      compB,
      actA,
      actB
    });
  }

  const meanAccA = sumAccA / total;
  const meanAccB = sumAccB / total;
  const meanCompA = sumCompA / total;
  const meanCompB = sumCompB / total;
  const meanActA = sumActA / total;
  const meanActB = sumActB / total;

  const bPreferredPct = ((bPreferred + bothEqual) / total) * 100;

  const resultMd = `# Phase 3: Expert Double-Blind Validation Results (Oiloop)

This document contains the decoded expert ratings and statistical analysis for the Phase 3 validation run of **AI-Context-OS** on the **Oiloop** codebase.

---

## 1. Executive Summary

- **Total Evaluated Questions:** ${total}
- **Expert Preference Rate (Condition B Preferred or Equal):** **${bPreferredPct.toFixed(1)}%**
  - *Target Exit Criterion:* $\ge 60\%$ (Status: **${bPreferredPct >= 60 ? "SUPPORTED / PASSED" : "FAILED"}**)
- **Key Hypothesis:** Domain-oriented context cores (B) perform comparably to or better than full repo context (A) in decision actionability while reducing token footprint.

---

## 2. Decoded Performance Summary

| Metric | Condition A (Full Repo) | Condition B (Routed Cores) | Delta (B vs. A) |
| :--- | :---: | :---: | :---: |
| **Mean Accuracy** | ${meanAccA.toFixed(2)} / 3.0 | ${meanAccB.toFixed(2)} / 3.0 | ${(meanAccB - meanAccA).toFixed(2)} |
| **Mean Completeness** | ${meanCompA.toFixed(2)} / 2.0 | ${meanCompB.toFixed(2)} / 2.0 | ${(meanCompB - meanCompA).toFixed(2)} |
| **Mean Actionability** | ${meanActA.toFixed(2)} / 5.0 | ${meanActB.toFixed(2)} / 5.0 | ${(meanActB - meanActA).toFixed(2)} |

---

## 3. Preference Mappings

- **Condition B Preferred:** ${bPreferred} questions
- **Condition A Preferred:** ${aPreferred} questions
- **Both Equal:** ${bothEqual} questions
- **Neither Useful:** ${neitherPreferred} questions

---

## 4. Detailed Decoded Question Log

| Question ID | Decoded Preference | Accuracy A | Accuracy B | Completeness A | Completeness B | Actionability A | Actionability B |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${decodedRows.map(r => `| **${r.qid}** | ${r.preferredCond} | ${r.accA} | ${r.accB} | ${r.compA} | ${r.compB} | ${r.actA} | ${r.actB} |`).join("\n")}

---

*Generated by expert-eval-decoder.mjs on ${new Date().toLocaleDateString()}*
`;

  fs.writeFileSync(outPath, resultMd, "utf8");
  console.log(`Successfully generated evaluation report at ${outPath}`);
}

main();
