/**
 * Assurance по IFF и языку ИИ из отчёта governance.
 */
import type { AiGovernanceReport } from "../engine/ai-governance-eval.js";
import type { AssuranceItem } from "./checklist.js";

export function buildAiGovernanceAssuranceItems(
  report: AiGovernanceReport,
): AssuranceItem[] {
  if (!report.configured && report.friend_or_foe.findings.length === 0) {
    return [];
  }

  const items: AssuranceItem[] = [];

  const missing = report.friend_or_foe.findings.find(
    (f) => f.code === "governance-missing",
  );
  if (missing) {
    items.push({
      id: "ai-governance-defined",
      category: "governance",
      title: "Задан ai_governance (свой/чужой + язык ИИ)",
      status: "fail",
      rationale: missing.message,
    });
    return items;
  }

  const failCount = [
    ...report.friend_or_foe.findings,
    ...report.ai_language.findings,
    ...report.flow_bindings.findings,
  ].filter((f) => f.severity === "fail").length;

  items.push({
    id: "ai-iff-language-valid",
    category: "governance",
    title: "IFF и язык ИИ проходят структурную проверку",
    status: failCount > 0 ? "fail" : "pass",
    rationale:
      failCount > 0
        ? `${failCount} fail — см. safetyos assess (блок IFF/язык)`
        : "каналы, delimiters, правила согласованы",
  });

  items.push({
    id: "ai-iff-foreign-delimited",
    category: "operations",
    title: "Foreign-каналы с delimiter (язык ИИ)",
    status: report.ai_language.findings.some(
      (f) => f.code === "lang-foreign-no-delimiter",
    )
      ? "fail"
      : "pass",
    rationale: `foreign: ${report.ai_language.foreign_channels.join(", ") || "—"}`,
  });

  items.push({
    id: "ai-flow-ai-context",
    category: "governance",
    title: "AI-потоки привязаны к каналам (ai_context)",
    status:
      report.flow_bindings.flows_missing_context.length > 0 ? "review" : "pass",
    rationale:
      report.flow_bindings.flows_missing_context.length > 0
        ? `без ai_context: ${report.flow_bindings.flows_missing_context.join(", ")}`
        : "все AI-теги привязаны или тегов нет",
  });

  return items;
}
