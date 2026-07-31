/**
 * Crypto Agility Score — операционная готовность к смене алгоритмов.
 */
import {
  classifyAll,
  collectFromCrypto,
  hasClass,
} from "../registry/algorithms.js";
import type { AnalyzeReport, ThreatModel } from "../types/threat-model.js";
import { evaluateMosca } from "./mosca.js";

export interface AgilityReport {
  score: number;
  tier: "ready" | "progressing" | "at_risk" | "critical";
  factors: { id: string; weight: number; earned: number; note: string }[];
  recommendations: string[];
}

export function computeAgilityScore(
  model: ThreatModel,
  analyze?: AnalyzeReport,
): AgilityReport {
  const factors: AgilityReport["factors"] = [];
  const flows = model.data_flows;
  const n = flows.length || 1;

  const pqcKexFlows = flows.filter((f) =>
    hasClass(classifyAll(f.crypto.key_exchange ?? []), "pqc"),
  ).length;
  const noQuantumVuln = flows.filter(
    (f) => !hasClass(collectFromCrypto(f.crypto), "quantum_vulnerable"),
  ).length;
  const hasPolicies = (model.policies?.length ?? 0) > 0;
  const mosca = evaluateMosca(model);
  const criticalFlows = analyze?.summary.critical ?? 0;

  factors.push({
    id: "pqc_coverage",
    weight: 30,
    earned: Math.round((pqcKexFlows / n) * 30),
    note: `${pqcKexFlows}/${n} потоков с PQC key exchange`,
  });

  factors.push({
    id: "quantum_free_flows",
    weight: 25,
    earned: Math.round((noQuantumVuln / n) * 25),
    note: `${noQuantumVuln}/${n} потоков без quantum-vulnerable KEX/SIG`,
  });

  factors.push({
    id: "policy_defined",
    weight: 15,
    earned: hasPolicies ? 15 : 0,
    note: hasPolicies
      ? `${model.policies!.length} declarative policies`
      : "нет policies — добавьте safetyos export opa",
  });

  factors.push({
    id: "mosca_margin",
    weight: 20,
    earned: mosca.at_risk ? 0 : 20,
    note: mosca.at_risk
      ? `Mosca at_risk: margin ${mosca.margin_years}y`
      : `запас по Моске: ${Math.abs(mosca.margin_years)}y`,
  });

  factors.push({
    id: "low_critical_flows",
    weight: 10,
    earned:
      criticalFlows === 0 ? 10 : Math.max(0, 10 - criticalFlows * 3),
    note: `critical flows: ${criticalFlows}`,
  });

  const score = Math.min(
    100,
    Math.max(0, factors.reduce((s, f) => s + f.earned, 0)),
  );

  const recommendations: string[] = [];
  if (pqcKexFlows < n) {
    recommendations.push("Добавить ML-KEM (гибрид с X25519) на все edge/long потоки");
  }
  if (!hasPolicies) {
    recommendations.push("Определить policies[] и экспортировать OPA: safetyos export opa");
  }
  if (mosca.at_risk) {
    recommendations.push(
      "Сократить x (retention) или ускорить y (migration); проверить HNDL re-encryption",
    );
  }
  if (criticalFlows > 0) {
    recommendations.push("Закрыть critical потоки перед расширением CBOM в CI");
  }

  return {
    score,
    tier: scoreToAgilityTier(score),
    factors,
    recommendations,
  };
}

function scoreToAgilityTier(
  score: number,
): AgilityReport["tier"] {
  if (score >= 80) return "ready";
  if (score >= 55) return "progressing";
  if (score >= 30) return "at_risk";
  return "critical";
}
