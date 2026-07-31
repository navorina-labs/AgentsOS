#!/usr/bin/env node
/** Generate blind A/B questionnaire from eval run OL*-A/B.md pairs. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PILOT_IDS = [
  "OL01",
  "OL03",
  "OL05",
  "OL08",
  "OL09",
  "OL12",
  "OL15",
  "OL16",
  "OL18",
  "OL20",
];

const DEFAULT_RUN = path.join(
  root,
  "experiments/oiloop/runs/run-1781660908"
);
const DEFAULT_QUESTIONS = path.join(
  "/Users/alex0nder/Projects/Oiloop/context-os/eval/questions.json"
);
const OUT_DIR = path.join(root, "research/human-blind-pilot-oiloop");
const KEY_PATH = path.join(root, "research/human-blind-pilot-oiloop-shuffle-key.json");
const CSV_PATH = path.join(root, "research/human-blind-pilot-oiloop.csv");

function parseArgs(argv) {
  const opts = { runDir: DEFAULT_RUN, questionsPath: DEFAULT_QUESTIONS, seed: 1781660908 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--run" && argv[i + 1]) opts.runDir = path.resolve(argv[++i]);
    else if (a === "--questions" && argv[i + 1])
      opts.questionsPath = path.resolve(argv[++i]);
    else if (a === "--seed" && argv[i + 1]) opts.seed = Number(argv[++i]);
  }
  return opts;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function extractAnswer(mdPath) {
  const text = fs.readFileSync(mdPath, "utf8");
  const idx = text.indexOf("## Answer");
  if (idx === -1) return text.trim();
  return text.slice(idx + "## Answer".length).trim();
}

function loadQuestions(questionsPath) {
  const data = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  const map = new Map(data.questions.map((q) => [q.id, q.question]));
  return map;
}

function main() {
  const opts = parseArgs(process.argv);
  const rand = mulberry32(opts.seed);
  const questions = loadQuestions(opts.questionsPath);
  const orderedIds = shuffle(PILOT_IDS, rand);

  const key = {
    generated_at: new Date().toISOString(),
    source_run: opts.runDir,
    seed: opts.seed,
    question_order: orderedIds,
    mapping: {},
  };

  let questionnaire = `# Human Blind Pilot — Oiloop (10 questions)

**Instructions:** For each question, read both answers. Pick which is more useful for making a decision about Oiloop. Do not guess which system produced which answer.

**Choices per question:** Answer 1 preferred · Answer 2 preferred · Equal · Neither useful

Record choices in \`research/human-blind-pilot-oiloop.csv\` (column \`display_id\`, not OL id).

---

`;

  let ratingSheet = `# Rating Sheet (quick reference)

| # | display_id | Preference (1 / 2 / Equal / Neither) | Notes |
|---|------------|----------------------------------------|-------|
`;

  orderedIds.forEach((qid, displayIdx) => {
    const displayId = `Q${String(displayIdx + 1).padStart(2, "0")}`;
    const aPath = path.join(opts.runDir, `${qid}-A.md`);
    const bPath = path.join(opts.runDir, `${qid}-B.md`);
    if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) {
      console.error(`Missing pair for ${qid} in ${opts.runDir}`);
      process.exit(1);
    }

    const answer1IsB = rand() >= 0.5;
    const answer1Condition = answer1IsB ? "B" : "A";
    const answer2Condition = answer1IsB ? "A" : "B";
    const answer1 = extractAnswer(answer1IsB ? bPath : aPath);
    const answer2 = extractAnswer(answer1IsB ? aPath : bPath);

    key.mapping[displayId] = {
      question_id: qid,
      question_text: questions.get(qid) ?? "",
      answer1_condition: answer1Condition,
      answer2_condition: answer2Condition,
    };

    questionnaire += `## ${displayId}

**Question:** ${questions.get(qid) ?? qid}

### Answer 1

${answer1}

### Answer 2

${answer2}

---

`;

    ratingSheet += `| ${displayIdx + 1} | ${displayId} | | |\n`;
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "QUESTIONNAIRE.md"), questionnaire);
  fs.writeFileSync(path.join(OUT_DIR, "RATING-SHEET.md"), ratingSheet);
  fs.writeFileSync(KEY_PATH, JSON.stringify(key, null, 2));

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(
      CSV_PATH,
      "display_id,preference,notes\n" +
        orderedIds
          .map((_, i) => `Q${String(i + 1).padStart(2, "0")},,`)
          .join("\n") +
        "\n"
    );
  }

  console.log(`Wrote ${OUT_DIR}/QUESTIONNAIRE.md`);
  console.log(`Wrote ${OUT_DIR}/RATING-SHEET.md`);
  console.log(`Wrote ${KEY_PATH} (gitignored — keep private until decode)`);
  console.log(`Template: ${CSV_PATH}`);
}

main();
