#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    test: false,
    run: null,
    runA: null,
    runB: null,
    out: "survey.md",
    key: "survey-key.json",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--test") {
      flags.test = true;
    } else if (args[i] === "--run" && args[i + 1]) {
      flags.run = args[++i];
    } else if (args[i] === "--run-a" && args[i + 1]) {
      flags.runA = args[++i];
    } else if (args[i] === "--run-b" && args[i + 1]) {
      flags.runB = args[++i];
    } else if (args[i] === "--out" && args[i + 1]) {
      flags.out = args[++i];
    } else if (args[i] === "--key" && args[i + 1]) {
      flags.key = args[++i];
    }
  }
  return flags;
}

function generateMockData() {
  const mockRun = [];
  const questionsList = [
    { id: "NV01", text: "Why did MRR drop this month?" },
    { id: "NV02", text: "How does guest workspace merge work?" },
    { id: "NV03", text: "Why is assistant chat isolated from Financial Mirror?" },
  ];

  for (const q of questionsList) {
    mockRun.push({
      id: q.id,
      question: q.text,
      answer_A: `Condition A (Full Repo) answer details for ${q.id}. This response is very detailed but may contain redundant repository details.`,
      answer_B: `Condition B (Context Core) answer details for ${q.id}. This response is focused on the decision domain.`,
    });
  }
  return mockRun;
}

function shuffleSurvey(runData) {
  const surveyQuestions = [];
  const surveyKey = {};

  for (const q of runData) {
    const isAShuffledFirst = Math.random() < 0.5;
    const opt1 = isAShuffledFirst ? q.answer_A : q.answer_B;
    const opt2 = isAShuffledFirst ? q.answer_B : q.answer_A;

    surveyQuestions.push({
      id: q.id,
      question: q.question,
      option_1: opt1,
      option_2: opt2,
    });

    surveyKey[q.id] = {
      option_1: isAShuffledFirst ? "A" : "B",
      option_2: isAShuffledFirst ? "B" : "A",
    };
  }

  return { surveyQuestions, surveyKey };
}

function writeSurveyMarkdown(questions, outPath) {
  let md = `# Expert Double-Blind Survey

This survey compares two distinct retrieval conditions for AI-generated answers.
Evaluate the options below for accuracy, completeness, and actionability without bias.

---

## Evaluation Criteria Rubrics

### 1. Accuracy (0–3 Scale)
- **3 (Excellent):** Completely correct, no inaccurate details or hallucinations.
- **2 (Good):** Correct in substance, minor inaccuracies that do not affect the main conclusion.
- **1 (Poor):** Substantially incorrect or contains major hallucinations.
- **0 (Critical Fail):** Hallucinates incorrect APIs or logical boundaries.

### 2. Completeness (0–2 Scale)
- **2 (Complete):** Answers all facets of the query.
- **1 (Partial):** Answers the main query but misses edge cases/details.
- **0 (Incomplete):** Fails to address the core query.

### 3. Actionability / Decision Usefulness (1–5 Likert Scale)
- **5 (Highly Actionable):** Direct, ready-to-run recommendations or code.
- **3 (Informative):** Contextually correct but requires lookups.
- **1 (Useless/Misleading):** Cannot be used.

---

`;

  for (const q of questions) {
    md += `## Question ${q.id}: ${q.question}

### Option 1:
\`\`\`text
${q.option_1}
\`\`\`

### Option 2:
\`\`\`text
${q.option_2}
\`\`\`

### Rater Scores:
- **Preferred Option (1 / 2 / Both / Neither):** [ ]
- **Option 1 Accuracy (0-3):** [ ]
- **Option 1 Completeness (0-2):** [ ]
- **Option 1 Actionability (1-5):** [ ]
- **Option 2 Accuracy (0-3):** [ ]
- **Option 2 Completeness (0-2):** [ ]
- **Option 2 Actionability (1-5):** [ ]

---

`;
  }

  fs.writeFileSync(outPath, md, "utf8");
}

function main() {
  const flags = parseArgs();

  if (flags.test) {
    console.log("Running in TEST mode...");
    const mockData = generateMockData();
    const { surveyQuestions, surveyKey } = shuffleSurvey(mockData);

    const testOut = "test-survey.md";
    const testKey = "test-survey-key.json";

    writeSurveyMarkdown(surveyQuestions, testOut);
    fs.writeFileSync(testKey, JSON.stringify(surveyKey, null, 2), "utf8");

    console.log(`TEST PASSED: Created ${testOut} and ${testKey}`);

    // Self-validate key integrity
    const readKey = JSON.parse(fs.readFileSync(testKey, "utf8"));
    for (const q of mockData) {
      const mapping = readKey[q.id];
      if (!mapping || !mapping.option_1 || !mapping.option_2) {
        throw new Error(`Invalid mapping key for question ${q.id}`);
      }
      const val1 = mapping.option_1 === "A" ? q.answer_A : q.answer_B;
      const val2 = mapping.option_2 === "A" ? q.answer_A : q.answer_B;

      // Ensure key successfully decodes option contents
      const loadedOpt1 = surveyQuestions.find((sq) => sq.id === q.id).option_1;
      const loadedOpt2 = surveyQuestions.find((sq) => sq.id === q.id).option_2;

      if (val1 !== loadedOpt1 || val2 !== loadedOpt2) {
        throw new Error(`Mismatch in key decoding logic for ${q.id}`);
      }
    }
    console.log("TEST VERIFICATION: Key decodes option contents successfully.");
    
    // Clean up test files
    fs.unlinkSync(testOut);
    fs.unlinkSync(testKey);
    console.log("TEST Cleanup complete.");
    return;
  }

  let runData = [];

  if (flags.run) {
    runData = JSON.parse(fs.readFileSync(flags.run, "utf8"));
  } else if (flags.runA && flags.runB) {
    const listA = JSON.parse(fs.readFileSync(flags.runA, "utf8"));
    const listB = JSON.parse(fs.readFileSync(flags.runB, "utf8"));

    const mapB = new Map(listB.map((item) => [item.id, item]));

    for (const itemA of listA) {
      const itemB = mapB.get(itemA.id);
      if (itemB) {
        runData.push({
          id: itemA.id,
          question: itemA.question,
          answer_A: itemA.answer,
          answer_B: itemB.answer,
        });
      }
    }
  } else {
    console.error("Error: Please provide --run or --run-a and --run-b, or specify --test.");
    process.exit(1);
  }

  if (runData.length === 0) {
    console.error("Error: No question/answer records loaded.");
    process.exit(1);
  }

  const { surveyQuestions, surveyKey } = shuffleSurvey(runData);

  writeSurveyMarkdown(surveyQuestions, flags.out);
  fs.writeFileSync(flags.key, JSON.stringify(surveyKey, null, 2), "utf8");

  console.log(`Successfully generated blind survey: ${flags.out}`);
  console.log(`Saved secret mapping key: ${flags.key}`);
}

main();
