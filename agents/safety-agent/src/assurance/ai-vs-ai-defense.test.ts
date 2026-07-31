import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AI_ATTACK_VECTORS,
  AI_DEFENSE_STEPS,
  buildAiVsAiDefenseReport,
} from "./ai-vs-ai-defense.js";

test("ai-vs-ai: disabled when ai_implementation false", () => {
  const r = buildAiVsAiDefenseReport({
    adversary: { ai_implementation: false, quantum: false },
  } as never);
  assert.equal(r.enabled, false);
  assert.equal(r.attack_vectors.length, 0);
});

test("ai-vs-ai: enabled with P0 defenses", () => {
  const r = buildAiVsAiDefenseReport({
    adversary: { ai_implementation: true, quantum: false },
  } as never);
  assert.equal(r.enabled, true);
  assert.equal(r.attack_vectors.length, AI_ATTACK_VECTORS.length);
  assert.ok(r.prioritized_defenses.every((d) => d.priority === "P0"));
  assert.ok(AI_DEFENSE_STEPS.length > 5);
});

test("ai-vs-ai: triggers from scan", () => {
  const r = buildAiVsAiDefenseReport(
    { adversary: { ai_implementation: true, quantum: false } } as never,
    {
      root: ".",
      files_scanned: 1,
      findings: [
        {
          pattern_id: "openai-api-key",
          severity: "critical",
          file: "x.ts",
          line: 1,
          column: 1,
          message: "OpenAI API key",
          snippet: "sk-",
        },
      ],
    },
  );
  assert.ok(r.triggered_attacks.includes("atk-keys-in-repo"));
  assert.ok(
    r.prioritized_defenses.some((d) => d.id === "def-secret-scan-ci"),
  );
});
