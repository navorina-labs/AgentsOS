/**
 * Сравнение двух снимков assess (регрессии posture локально).
 */
import type { FullAssessment } from "./assess.js";

export interface AssessDiffSummary {
  critical_delta: number;
  high_delta: number;
  assurance_failed_delta: number;
  assurance_passed_delta: number;
  agility_delta: number;
  governance_fail_delta: number;
  tls_drift_delta: number;
  tls_drift_critical_delta: number;
  flow_tier_changes: Array<{
    id: string;
    before: string;
    after: string;
  }>;
  new_governance_fails: string[];
  resolved_governance_fails: string[];
  new_tls_drifts: string[];
  resolved_tls_drifts: string[];
}

export interface AssessDiffResult {
  before_label: string;
  after_label: string;
  summary: AssessDiffSummary;
  improved: boolean;
}

function tlsDriftKeys(full: FullAssessment): Set<string> {
  const drifts = full.tls?.reconcile.drifts ?? [];
  return new Set(
    drifts.map((d) => `${d.severity}:${d.kind}:${d.flow_id ?? ""}:${d.message}`),
  );
}

function tlsCriticalDriftCount(full: FullAssessment): number {
  return (
    full.tls?.reconcile.drifts.filter((d) => d.severity === "critical").length ??
    0
  );
}

function governanceFailMessages(full: FullAssessment): string[] {
  return [
    ...full.ai_governance.friend_or_foe.findings,
    ...full.ai_governance.ai_language.findings,
    ...full.ai_governance.flow_bindings.findings,
  ]
    .filter((f) => f.severity === "fail")
    .map((f) => f.message);
}

export function diffAssessments(
  before: FullAssessment,
  after: FullAssessment,
  labels?: { before?: string; after?: string },
): AssessDiffResult {
  const beforeGov = new Set(governanceFailMessages(before));
  const afterGov = new Set(governanceFailMessages(after));

  const new_governance_fails = [...afterGov].filter((m) => !beforeGov.has(m));
  const resolved_governance_fails = [...beforeGov].filter((m) => !afterGov.has(m));

  const beforeTls = tlsDriftKeys(before);
  const afterTls = tlsDriftKeys(after);
  const new_tls_drifts = [...afterTls].filter((k) => !beforeTls.has(k));
  const resolved_tls_drifts = [...beforeTls].filter((k) => !afterTls.has(k));
  const beforeTlsTotal = before.tls?.reconcile.drifts.length ?? 0;
  const afterTlsTotal = after.tls?.reconcile.drifts.length ?? 0;

  const beforeFlows = new Map(before.analyze.flows.map((f) => [f.id, f.tier]));
  const flow_tier_changes: AssessDiffSummary["flow_tier_changes"] = [];

  for (const f of after.analyze.flows) {
    const prev = beforeFlows.get(f.id);
    if (prev && prev !== f.tier) {
      flow_tier_changes.push({ id: f.id, before: prev, after: f.tier });
    }
  }

  const summary: AssessDiffSummary = {
    critical_delta:
      after.analyze.summary.critical - before.analyze.summary.critical,
    high_delta: after.analyze.summary.high - before.analyze.summary.high,
    assurance_failed_delta: after.assurance.failed - before.assurance.failed,
    assurance_passed_delta: after.assurance.passed - before.assurance.passed,
    agility_delta: after.agility.score - before.agility.score,
    governance_fail_delta: afterGov.size - beforeGov.size,
    tls_drift_delta: afterTlsTotal - beforeTlsTotal,
    tls_drift_critical_delta:
      tlsCriticalDriftCount(after) - tlsCriticalDriftCount(before),
    flow_tier_changes,
    new_governance_fails,
    resolved_governance_fails,
    new_tls_drifts,
    resolved_tls_drifts,
  };

  const improved =
    summary.critical_delta <= 0 &&
    summary.assurance_failed_delta <= 0 &&
    summary.governance_fail_delta <= 0 &&
    summary.tls_drift_critical_delta <= 0 &&
    (summary.critical_delta < 0 ||
      summary.assurance_failed_delta < 0 ||
      summary.governance_fail_delta < 0 ||
      summary.tls_drift_critical_delta < 0 ||
      summary.agility_delta > 0 ||
      resolved_governance_fails.length > 0 ||
      resolved_tls_drifts.length > 0);

  return {
    before_label: labels?.before ?? "baseline",
    after_label: labels?.after ?? "current",
    summary,
    improved,
  };
}
