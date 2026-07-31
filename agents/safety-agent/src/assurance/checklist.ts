/**
 * Assurance checklist — защита от ИИ-усиленных атак на реализацию (слой B).
 */
import { buildAiGovernanceReport } from "../engine/ai-governance-eval.js";
import {
  buildAiAssuranceItems,
  mergeAssuranceItems,
  summarizeAssurance,
} from "./ai-threats.js";
import { buildAiGovernanceAssuranceItems } from "./ai-governance-assurance.js";
import type { TlsReconcileReport } from "../inventory/types.js";
import { applicationCriticalFindings } from "../scanner/scan-context.js";
import type { ScanReport } from "../scanner/scan-directory.js";
import type { ThreatModel } from "../types/threat-model.js";

export type AssuranceStatus = "pass" | "fail" | "review" | "na";

export interface AssuranceItem {
  id: string;
  category: "secrets" | "implementation" | "operations" | "governance";
  title: string;
  status: AssuranceStatus;
  rationale: string;
}

export interface AssuranceReport {
  adversary_ai: boolean;
  passed: number;
  failed: number;
  review: number;
  items: AssuranceItem[];
}

export function buildAssuranceChecklist(
  model: ThreatModel,
  scan?: ScanReport,
  tlsReconcile?: TlsReconcileReport,
): AssuranceReport {
  const ai = model.adversary.ai_implementation;
  const items: AssuranceItem[] = [];

  const criticalScan = scan
    ? applicationCriticalFindings(scan.findings, scan.root).length
    : 0;
  const rsaPem =
    scan?.findings.some((f) => f.pattern_id === "rsa-key-pem") ?? false;

  items.push({
    id: "no-keys-in-repo",
    category: "secrets",
    title: "Нет приватных ключей в репозитории",
    status: !ai ? "na" : scan ? (rsaPem ? "fail" : "pass") : "review",
    rationale: scan
      ? rsaPem
        ? "scan: обнаружен RSA PRIVATE KEY"
        : "scan: PEM ключей не найдено"
      : "запустите safetyos scan для проверки",
  });

  items.push({
    id: "no-weak-hash-in-code",
    category: "implementation",
    title: "Нет MD5/SHA-1 в прикладном коде",
    status: !ai ? "na" : scan ? (criticalScan > 0 ? "fail" : "pass") : "review",
    rationale: scan
      ? `scan critical findings: ${criticalScan}`
      : "требуется safetyos scan",
  });

  items.push({
    id: "secret-scanning-ci",
    category: "operations",
    title: "Secret scanning в CI (gitleaks/trufflehog)",
    status: ai ? "review" : "na",
    rationale: "ручная проверка: подключён ли secret scanner в pipeline",
  });

  items.push({
    id: "dependency-audit",
    category: "operations",
    title: "Аудит зависимостей (npm audit / osv)",
    status: ai ? "review" : "na",
    rationale: "LLM часто предлагает уязвимые пакеты — нужен automated audit",
  });

  items.push({
    id: "crypto-agility-policy",
    category: "governance",
    title: "Declarative crypto policies в threat model",
    status: (model.policies?.length ?? 0) > 0 ? "pass" : ai ? "fail" : "pass",
    rationale:
      (model.policies?.length ?? 0) > 0
        ? `${model.policies!.length} policies`
        : "добавьте policies[] или профиль: safetyos profile apply",
  });

  items.push({
    id: "hndl-reencryption-plan",
    category: "governance",
    title: "План re-encryption при HNDL",
    status:
      model.adversary.quantum_record &&
      model.data_flows.some((f) => f.hndl_exposed)
        ? "review"
        : "pass",
    rationale:
      "при quantum_record + hndl_exposed нужен документированный план ротации",
  });

  items.push({
    id: "pqc-migration-owner",
    category: "governance",
    title: "Владелец PQC-миграции и срок y",
    status:
      model.organization.migration_years <= 5 ? "pass" : "review",
    rationale: `migration_years=${model.organization.migration_years}`,
  });

  if (tlsReconcile) {
    const crit = tlsReconcile.drifts.filter((d) => d.severity === "critical");
    const warn = tlsReconcile.drifts.filter((d) => d.severity === "warning");
    items.push({
      id: "tls-inventory-reconcile",
      category: "operations",
      title: "TLS конфиг согласован с threat model",
      status:
        crit.length > 0 ? "fail" : warn.length > 0 ? "review" : "pass",
      rationale:
        crit.length > 0
          ? `${crit.length} critical drift(s): weak TLS в конфиге или расхождение`
          : warn.length > 0
            ? `${warn.length} warning drift(s)`
            : "inventory reconcile без расхождений",
    });
  }

  const govReport = buildAiGovernanceReport(model);
  const merged = mergeAssuranceItems(
    items,
    mergeAssuranceItems(
      buildAiAssuranceItems(model, scan),
      buildAiGovernanceAssuranceItems(govReport),
    ),
  );
  const summary = summarizeAssurance(merged);

  return {
    adversary_ai: ai,
    passed: summary.passed,
    failed: summary.failed,
    review: summary.review,
    items: merged,
  };
}
