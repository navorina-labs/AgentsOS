/**
 * Полная оценка: analyze + agility + assurance.
 */
import { buildAssuranceChecklist } from "../assurance/checklist.js";
import {
  buildAiVsAiDefenseReport,
  type AiVsAiDefenseReport,
} from "../assurance/ai-vs-ai-defense.js";
import { buildCbomFromThreatModel } from "../export/cbom.js";
import type { CycloneDxBom } from "../export/cbom.js";
import { enrichCbomWithTls } from "../export/tls-export.js";
import { reconcileTlsWithModel } from "../inventory/reconcile.js";
import type { TlsInventoryReport, TlsReconcileReport } from "../inventory/types.js";
import type { ScanReport } from "../scanner/scan-directory.js";
import type { AnalyzeReport, ThreatModel } from "../types/threat-model.js";
import { computeAgilityScore, type AgilityReport } from "./agility-score.js";
import {
  buildQuantumPosture,
  type QuantumPostureReport,
} from "./quantum-posture.js";
import {
  buildAiGovernanceReport,
  type AiGovernanceReport,
} from "./ai-governance-eval.js";
import { analyzeThreatModel } from "./risk-scorer.js";

export interface FullAssessment {
  analyze: AnalyzeReport;
  quantum: QuantumPostureReport;
  agility: AgilityReport;
  assurance: ReturnType<typeof buildAssuranceChecklist>;
  cbom: CycloneDxBom;
  tls?: {
    inventory: TlsInventoryReport;
    reconcile: TlsReconcileReport;
  };
  ai_vs_ai: AiVsAiDefenseReport;
  ai_governance: AiGovernanceReport;
}

export interface AssessmentOptions {
  scan?: ScanReport;
  tlsInventory?: TlsInventoryReport;
}

export function runFullAssessment(
  model: ThreatModel,
  options?: AssessmentOptions,
): FullAssessment {
  const analyze = analyzeThreatModel(model);
  const quantum = buildQuantumPosture(model, analyze);
  const agility = computeAgilityScore(model, analyze);
  const tlsReconcile = options?.tlsInventory
    ? reconcileTlsWithModel(model, options.tlsInventory)
    : undefined;
  const assurance = buildAssuranceChecklist(
    model,
    options?.scan,
    tlsReconcile,
  );
  const ai_vs_ai = buildAiVsAiDefenseReport(model, options?.scan);
  const ai_governance = buildAiGovernanceReport(model);
  let cbom = buildCbomFromThreatModel(model, analyze);
  if (options?.tlsInventory && tlsReconcile) {
    cbom = enrichCbomWithTls(cbom, options.tlsInventory, tlsReconcile);
  }

  return {
    analyze,
    quantum,
    agility,
    assurance,
    cbom,
    ai_vs_ai,
    ai_governance,
    tls:
      options?.tlsInventory && tlsReconcile
        ? { inventory: options.tlsInventory, reconcile: tlsReconcile }
        : undefined,
  };
}
