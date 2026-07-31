/**
 * CI gate: fail assess при нарушении assurance / IFF / critical flows.
 */
import type { FullAssessment } from "./assess.js";

export interface AssessGateOptions {
  maxAssuranceFailures?: number;
  maxCriticalFlows?: number;
  maxTlsCriticalDrifts?: number;
  failOnGovernance?: boolean;
}

export interface AssessGateResult {
  pass: boolean;
  failures: string[];
}

export function evaluateAssessGate(
  report: FullAssessment,
  opts: AssessGateOptions = {},
): AssessGateResult {
  const failures: string[] = [];
  const maxAssurance = opts.maxAssuranceFailures ?? 0;
  const maxCritical = opts.maxCriticalFlows ?? 0;

  if (report.assurance.failed > maxAssurance) {
    failures.push(
      `assurance: ${report.assurance.failed} failed (max ${maxAssurance})`,
    );
  }

  if (report.analyze.summary.critical > maxCritical) {
    failures.push(
      `risk: ${report.analyze.summary.critical} critical flows (max ${maxCritical})`,
    );
  }

  if (opts.maxTlsCriticalDrifts !== undefined) {
    const tlsCrit =
      report.tls?.reconcile.drifts.filter((d) => d.severity === "critical")
        .length ?? 0;
    if (tlsCrit > opts.maxTlsCriticalDrifts) {
      failures.push(
        `tls: ${tlsCrit} critical drift(s) (max ${opts.maxTlsCriticalDrifts})`,
      );
    }
  }

  if (opts.failOnGovernance !== false && report.analyze.adversary.ai_implementation) {
    const govFails = [
      ...report.ai_governance.friend_or_foe.findings,
      ...report.ai_governance.ai_language.findings,
      ...report.ai_governance.flow_bindings.findings,
    ].filter((f) => f.severity === "fail");
    for (const f of govFails) {
      failures.push(`ai_governance: ${f.message}`);
    }
  }

  return { pass: failures.length === 0, failures };
}
