/**
 * Квантовый слой защиты: HNDL, Mosca, очередь PQC-миграции (NIST).
 */
import { collectFromCrypto, hasClass } from "../registry/algorithms.js";
import {
  matchMigrationForAlgorithms,
  type NistMigrationPath,
} from "../registry/nist-migration.js";
import type { AnalyzeReport, DataFlow, ThreatModel } from "../types/threat-model.js";
import { evaluateMosca, getConfidentialityYears } from "./mosca.js";

export type ReencryptUrgency = "immediate" | "high" | "medium" | "low";

export interface ReencryptPriority {
  flow_id: string;
  name: string;
  urgency: ReencryptUrgency;
  confidentiality_years: number;
  hndl_exposed: boolean;
  reasons: string[];
}

export interface MigrationStep {
  priority: number;
  flow_id: string;
  flow_name: string;
  classical: string;
  pqc_replacement: string;
  hybrid_transition?: string;
  nist_ref: string;
  action: string;
}

export interface QuantumPostureReport {
  active: boolean;
  quantum_record: boolean;
  mosca_at_risk: boolean;
  mosca_margin_years: number;
  hndl_exposed_flow_count: number;
  flows_quantum_vulnerable: number;
  flows_with_pqc: number;
  reencrypt_queue: ReencryptPriority[];
  migration_steps: MigrationStep[];
  recommendations: string[];
}

function urgencyForFlow(
  flow: DataFlow,
  model: ThreatModel,
  analyzeFlow?: { tier: string; score: number },
): ReencryptUrgency {
  const x = getConfidentialityYears(flow, model);
  const hndl = flow.hndl_exposed || model.adversary.quantum_record;
  const vuln = hasClass(collectFromCrypto(flow.crypto), "quantum_vulnerable");

  if (hndl && vuln && (flow.storage === "permanent" || x >= 15)) {
    return "immediate";
  }
  if (hndl && vuln) return "high";
  if (analyzeFlow?.tier === "critical") return "high";
  if (vuln && (flow.storage === "long" || flow.storage === "permanent")) {
    return "medium";
  }
  if (vuln) return "low";
  return "low";
}

export function buildQuantumPosture(
  model: ThreatModel,
  analyze: AnalyzeReport,
): QuantumPostureReport {
  const mosca = evaluateMosca(model);
  const active =
    model.adversary.quantum_record ||
    mosca.at_risk ||
    model.data_flows.some((f) =>
      hasClass(collectFromCrypto(f.crypto), "quantum_vulnerable"),
    );

  const reencrypt_queue: ReencryptPriority[] = [];
  const migrationStepsMap = new Map<string, MigrationStep>();
  let flowsQuantumVuln = 0;
  let flowsWithPqc = 0;
  let hndlCount = 0;

  for (const flow of model.data_flows) {
    const classified = collectFromCrypto(flow.crypto);
    const vuln = hasClass(classified, "quantum_vulnerable");
    const pqc = hasClass(classified, "pqc");
    if (vuln) flowsQuantumVuln += 1;
    if (pqc) flowsWithPqc += 1;

    const hndl = Boolean(flow.hndl_exposed || model.adversary.quantum_record);
    if (hndl) hndlCount += 1;

    if (!vuln && !hndl) continue;

    const analyzeFlow = analyze.flows.find((f) => f.id === flow.id);
    const urgency = urgencyForFlow(flow, model, analyzeFlow);
    const reasons: string[] = [];
    if (hndl) reasons.push("HNDL: ciphertext мог быть перехвачен");
    if (vuln) reasons.push("Квантово-уязвимые алгоритмы в потоке");
    if (mosca.at_risk) reasons.push(`Моска x+y>z (margin ${mosca.margin_years}y)`);

    if (urgency === "immediate" || urgency === "high" || vuln) {
      reencrypt_queue.push({
        flow_id: flow.id,
        name: flow.name,
        urgency,
        confidentiality_years: getConfidentialityYears(flow, model),
        hndl_exposed: hndl,
        reasons,
      });
    }

    const algos = [
      ...(flow.crypto.key_exchange ?? []),
      ...(flow.crypto.signatures ?? []),
      ...(flow.crypto.hash ?? []),
    ];
    const paths = matchMigrationForAlgorithms(algos);
    for (const path of paths) {
      const key = `${flow.id}:${path.classical}`;
      if (migrationStepsMap.has(key)) continue;
      migrationStepsMap.set(key, {
        priority: urgencyRank(urgency),
        flow_id: flow.id,
        flow_name: flow.name,
        classical: path.classical,
        pqc_replacement: path.pqc_replacement,
        hybrid_transition: path.hybrid_transition,
        nist_ref: path.nist_ref,
        action: buildAction(path, hndl),
      });
    }
  }

  reencrypt_queue.sort(
    (a, b) => urgencyRank(b.urgency) - urgencyRank(a.urgency),
  );

  const migration_steps = [...migrationStepsMap.values()].sort(
    (a, b) => a.priority - b.priority,
  );

  const recommendations = buildQuantumRecommendations(
    model,
    mosca,
    hndlCount,
    flowsQuantumVuln,
    flowsWithPqc,
  );

  return {
    active,
    quantum_record: model.adversary.quantum_record,
    mosca_at_risk: mosca.at_risk,
    mosca_margin_years: mosca.margin_years,
    hndl_exposed_flow_count: hndlCount,
    flows_quantum_vulnerable: flowsQuantumVuln,
    flows_with_pqc: flowsWithPqc,
    reencrypt_queue,
    migration_steps,
    recommendations,
  };
}

function urgencyRank(u: ReencryptUrgency): number {
  switch (u) {
    case "immediate":
      return 1;
    case "high":
      return 2;
    case "medium":
      return 3;
    case "low":
      return 4;
  }
}

function buildAction(path: NistMigrationPath, hndl: boolean): string {
  const hybrid = path.hybrid_transition
    ? ` Переход: ${path.hybrid_transition}.`
    : "";
  const reenc = hndl
    ? " Выполнить re-encryption архивов с новым KEM."
    : "";
  return `Заменить ${path.classical} → ${path.pqc_replacement}.${hybrid}${reenc}`;
}

function buildQuantumRecommendations(
  model: ThreatModel,
  mosca: ReturnType<typeof evaluateMosca>,
  hndlCount: number,
  flowsQuantumVuln: number,
  flowsWithPqc: number,
): string[] {
  const recs: string[] = [];

  if (model.adversary.quantum_record && hndlCount > 0) {
    recs.push(
      "HNDL: считать перехваченный ciphertext компрометированным после появления CRQC — план re-encryption обязателен",
    );
  }
  if (mosca.at_risk) {
    recs.push(
      `Сократить retention x и/или срок миграции y (сейчас ${model.organization.migration_years}y); horizon z=${model.organization.quantum_horizon_years}y считать внешним сценарием, а не управляемым рычагом`,
    );
  }
  if (flowsQuantumVuln > flowsWithPqc) {
    recs.push(
      `PQC gap: ${flowsQuantumVuln - flowsWithPqc} поток(ов) без ML-KEM/ML-DSA — приоритет edge TLS и long-term at-rest`,
    );
  }
  recs.push(
    "TLS: hybrid ML-KEM + X25519 на всех публичных endpoint до полного cutover",
  );
  recs.push(
    "Архивы: обернуть симметрические ключи через ML-KEM-768/1024, не RSA-OAEP",
  );

  return recs;
}
