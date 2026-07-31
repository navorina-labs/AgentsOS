/**
 * Assurance против ИИ-усиленных атак (слой B) — расширенный чеклист.
 */
import { isDetectorCatalogFinding } from "../scanner/scan-context.js";
import type { ScanReport } from "../scanner/scan-directory.js";
import type { ThreatModel } from "../types/threat-model.js";
import {
  buildAiVsAiAssuranceItems,
  buildAiVsAiDefenseReport,
} from "./ai-vs-ai-defense.js";
import type { AssuranceItem, AssuranceStatus } from "./checklist.js";

const AI_SECRET_PATTERNS = [
  "openai-api-key",
  "anthropic-api-key",
  "huggingface-token",
  "generic-api-key",
];

export function buildAiAssuranceItems(
  model: ThreatModel,
  scan?: ScanReport,
): AssuranceItem[] {
  if (!model.adversary.ai_implementation) return [];

  const items: AssuranceItem[] = [];
  const aiSecrets =
    scan?.findings.filter((f) => AI_SECRET_PATTERNS.includes(f.pattern_id)) ??
    [];

  items.push({
    id: "no-ai-keys-in-repo",
    category: "secrets",
    title: "Нет API-ключей LLM/AI в репозитории",
    status: scan ? (aiSecrets.length > 0 ? "fail" : "pass") : "review",
    rationale: scan
      ? aiSecrets.length > 0
        ? `найдено: ${aiSecrets.map((f) => f.pattern_id).join(", ")}`
        : "AI key patterns не обнаружены"
      : "запустите safetyos scan",
  });

  items.push({
    id: "no-custom-crypto",
    category: "implementation",
    title: "Нет самописной криптографии (ИИ часто генерирует XOR/ROT)",
    status: scan
      ? scan.findings.some((f) => f.pattern_id === "custom-crypto")
        ? "fail"
        : "pass"
      : "review",
    rationale:
      "паттерны: CryptoJS без режима, createCipher без GCM, собственные KDF",
  });

  items.push({
    id: "constant-time-review",
    category: "implementation",
    title: "Constant-time для сравнения секретов и MAC",
    status: "review",
    rationale:
      "ИИ-код часто использует === для токенов — аудит crypto.compare / timingSafeEqual",
  });

  items.push({
    id: "ai-pr-review-crypto",
    category: "operations",
    title: "Обязательный human review crypto-diff от Copilot/LLM",
    status: "review",
    rationale: "автогенерация не заменяет ревью криптографических PR",
  });

  items.push({
    id: "rag-no-secrets",
    category: "operations",
    title: "RAG/контекст LLM без ключей и PII",
    status: "review",
    rationale:
      "утечка в промпт → дообучение/логи провайдера; политика redaction",
  });

  items.push({
    id: "depinsecure-crypto-libs",
    category: "operations",
    title: "Зафиксированы версии crypto-библиотек (lockfile)",
    status: scan?.findings.some(
      (f) =>
        f.pattern_id === "deprecated-crypto-lib" &&
        !isDetectorCatalogFinding(f, scan.root),
    )
      ? "fail"
      : scan
        ? "pass"
        : "review",
    rationale:
      "LLM предлагает устаревшие пакеты — pin openssl/node-forge/etc.",
  });

  const vsAi = buildAiVsAiDefenseReport(model, scan);
  return mergeAssuranceItems(items, buildAiVsAiAssuranceItems(vsAi));
}

export function mergeAssuranceItems(
  base: AssuranceItem[],
  extra: AssuranceItem[],
): AssuranceItem[] {
  const map = new Map<string, AssuranceItem>();
  for (const i of base) map.set(i.id, i);
  for (const i of extra) map.set(i.id, i);
  return [...map.values()];
}

export function summarizeAssurance(items: AssuranceItem[]): {
  passed: number;
  failed: number;
  review: number;
} {
  return {
    passed: items.filter((i) => i.status === "pass").length,
    failed: items.filter((i) => i.status === "fail").length,
    review: items.filter((i) => i.status === "review").length,
  };
}

export function worstAssuranceStatus(
  items: AssuranceItem[],
): AssuranceStatus {
  if (items.some((i) => i.status === "fail")) return "fail";
  if (items.some((i) => i.status === "review")) return "review";
  if (items.some((i) => i.status === "pass")) return "pass";
  return "na";
}
