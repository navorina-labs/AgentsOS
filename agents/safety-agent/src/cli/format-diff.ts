/**
 * Текстовый отчёт сравнения assess.
 */
import type { AssessDiffResult } from "../engine/assess-diff.js";

function sign(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}

export function formatAssessDiff(diff: AssessDiffResult): string {
  const s = diff.summary;
  const lines: string[] = [
    `SafetyOS assess diff: ${diff.before_label} → ${diff.after_label}`,
    "",
    `  Critical flows:     ${sign(s.critical_delta)}`,
    `  High flows:         ${sign(s.high_delta)}`,
    `  Assurance failed:   ${sign(s.assurance_failed_delta)}`,
    `  Assurance passed:   ${sign(s.assurance_passed_delta)}`,
    `  Agility score:      ${sign(s.agility_delta)}`,
    `  Governance fails:   ${sign(s.governance_fail_delta)}`,
    `  TLS drifts:         ${sign(s.tls_drift_delta)}`,
    `  TLS critical drift: ${sign(s.tls_drift_critical_delta)}`,
    "",
  ];

  if (s.flow_tier_changes.length) {
    lines.push("Изменения tier по потокам:");
    for (const c of s.flow_tier_changes) {
      lines.push(`  · ${c.id}: ${c.before} → ${c.after}`);
    }
    lines.push("");
  }

  if (s.new_governance_fails.length) {
    lines.push("Новые IFF/governance:");
    for (const m of s.new_governance_fails) {
      lines.push(`  ✗ ${m}`);
    }
    lines.push("");
  }

  if (s.resolved_governance_fails.length) {
    lines.push("Исправлено governance:");
    for (const m of s.resolved_governance_fails) {
      lines.push(`  ✓ ${m}`);
    }
    lines.push("");
  }

  if (s.new_tls_drifts.length) {
    lines.push("Новые TLS drift:");
    for (const m of s.new_tls_drifts.slice(0, 8)) {
      lines.push(`  ✗ ${m.split(":").slice(3).join(":") || m}`);
    }
    lines.push("");
  }

  if (s.resolved_tls_drifts.length) {
    lines.push("Исправлено TLS drift:");
    for (const m of s.resolved_tls_drifts.slice(0, 8)) {
      lines.push(`  ✓ ${m.split(":").slice(3).join(":") || m}`);
    }
    lines.push("");
  }

  lines.push(diff.improved ? "Итог: улучшение posture" : "Итог: без улучшения или регрессия");
  return lines.join("\n");
}
