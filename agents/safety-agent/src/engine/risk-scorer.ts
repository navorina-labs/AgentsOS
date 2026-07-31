/**
 * Risk score 0–100 и tier по потоку данных.
 */
import {
  classifyAll,
  collectFromCrypto,
  hasClass,
} from "../registry/algorithms.js";
import type {
  AnalyzeReport,
  DataFlow,
  FlowAnalysis,
  FlowFinding,
  RiskTier,
  ThreatModel,
} from "../types/threat-model.js";
import { evaluateMosca, flowMoscaAtRisk, getConfidentialityYears } from "./mosca.js";
import { evaluatePoliciesForFlow } from "./policy.js";

function scoreToTier(score: number): RiskTier {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function scoreFlow(flow: DataFlow, model: ThreatModel): FlowAnalysis {
  const classified = collectFromCrypto(flow.crypto);
  const findings: FlowFinding[] = [];
  const recommendations: string[] = [];
  let score = 0;

  const x = getConfidentialityYears(flow, model);
  const hndl =
    flow.hndl_exposed === true || model.adversary.quantum_record === true;

  if (hasClass(classified, "quantum_vulnerable")) {
    score += 40;
    findings.push({
      code: "QUANTUM_VULN_KEX_OR_SIG",
      message:
        "Обнаружены алгоритмы, уязвимые к квантовому противнику (асимметрия до PQC)",
      severity: "critical",
    });
    recommendations.push(
      "Заменить key exchange на ML-KEM-768 (или ML-KEM-1024 для высокого профиля); на переходе — hybrid с X25519",
    );
  }

  if (hndl) {
    score += 25;
    findings.push({
      code: "HNDL_EXPOSURE",
      message:
        "Вероятен перехват ciphertext (HNDL): требуется re-encryption и ротация ключей, не только миграция TLS",
      severity: "critical",
    });
    recommendations.push(
      "План re-encryption для at-rest/archived данных; отказ от долгоживущих RSA-wrapped ключей",
    );
  }

  if (flowMoscaAtRisk(flow, model)) {
    score += 20;
    findings.push({
      code: "MOSCA_FLOW",
      message: `Для потока x+y>z (${x}+${model.organization.migration_years}>${model.organization.quantum_horizon_years})`,
      severity: "warning",
    });
  }

  const longStorage = flow.storage === "long" || flow.storage === "permanent";

  const hasAes128 = (flow.crypto.symmetric ?? []).some((s) =>
    /^AES-128/i.test(s),
  );
  if (hasAes128 && longStorage) {
    score += 12;
    findings.push({
      code: "AES128_LONG_RETENTION",
      message:
        "AES-128 при long/permanent storage — рассмотреть AES-256-GCM для запаса по квантовым атакам на симметрию",
      severity: "warning",
    });
    recommendations.push("Перейти на AES-256-GCM для долгоживущих данных");
  }

  if (hasClass(classified, "weak")) {
    score += 30;
    findings.push({
      code: "WEAK_ALGO",
      message: "Слабые алгоритмы (устаревшие хеши, малые ключи)",
      severity: "critical",
    });
    recommendations.push("Немедленно удалить слабые хеши и ключи");
  }

  const kex = classifyAll(flow.crypto.key_exchange ?? []);
  const hasPqcKex = hasClass(kex, "pqc");

  if (longStorage && !hasPqcKex && hasClass(classified, "quantum_vulnerable")) {
    score += 15;
    findings.push({
      code: "NO_PQC_LONG_STORAGE",
      message: "Долгое хранение без PQC key exchange",
      severity: "warning",
    });
  }

  if (hasClass(classified, "pqc") && !hasClass(classified, "quantum_vulnerable")) {
    score = Math.max(0, score - 20);
    findings.push({
      code: "PQC_PRESENT",
      message: "PQC присутствует, риск снижен",
      severity: "info",
    });
  }

  if (model.adversary.ai_implementation) {
    score += 5;
    findings.push({
      code: "AI_IMPL_THREAT",
      message:
        "Профиль противника включает ИИ-усиленные атаки на реализацию: нужен secret scanning и fuzz",
      severity: "info",
    });
    recommendations.push(
      "Включить secret scanning в CI; проверить constant-time и отсутствие ключей в репозитории",
    );
  }

  score = Math.min(100, Math.max(0, score));

  const policyMatches = evaluatePoliciesForFlow(flow, model.policies);
  const policy_violations = policyMatches
    .filter((m) => m.action === "block")
    .map((m) => m.message);

  for (const m of policyMatches) {
    if (m.action === "block") score = Math.min(100, score + 10);
    findings.push({
      code: `POLICY_${m.policy_id.toUpperCase()}`,
      message: m.message,
      severity: m.action === "block" ? "critical" : "warning",
    });
  }

  const tier = scoreToTier(score);

  return {
    id: flow.id,
    name: flow.name,
    confidentiality_years: x,
    score,
    tier,
    mosca_flow_at_risk: flowMoscaAtRisk(flow, model),
    findings,
    recommendations: [...new Set(recommendations)],
    policy_violations,
  };
}

export function analyzeThreatModel(model: ThreatModel): AnalyzeReport {
  const mosca = evaluateMosca(model);
  const flows = model.data_flows.map((f) => scoreFlow(f, model));

  const summary = {
    total_flows: flows.length,
    critical: flows.filter((f) => f.tier === "critical").length,
    high: flows.filter((f) => f.tier === "high").length,
    medium: flows.filter((f) => f.tier === "medium").length,
    low: flows.filter((f) => f.tier === "low").length,
    policy_blocks: flows.reduce((n, f) => n + f.policy_violations.length, 0),
  };

  return {
    organization: model.organization.name,
    mosca,
    adversary: model.adversary,
    flows,
    summary,
  };
}
