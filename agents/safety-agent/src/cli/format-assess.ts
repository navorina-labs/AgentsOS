/**
 * Форматирование полной оценки safetyos assess (квант + ИИ).
 */
import type { FullAssessment } from "../engine/assess.js";
import { formatTlsReconcile } from "./format-inventory.js";

export function formatFullAssessment(report: FullAssessment): string {
  const lines: string[] = [];
  const { analyze, quantum, agility, assurance } = report;

  lines.push("\n══ SafetyOS — Defense Assessment (Quantum + AI) ══\n");
  lines.push(`Организация: ${analyze.organization}`);

  lines.push("\n── ⚛ Квантовый слой ──");
  lines.push(`  HNDL (quantum_record): ${quantum.quantum_record}`);
  lines.push(
    `  Моска: at_risk=${quantum.mosca_at_risk} margin=${quantum.mosca_margin_years}y`,
  );
  lines.push(
    `  Потоки: quantum-vuln=${quantum.flows_quantum_vulnerable}  PQC=${quantum.flows_with_pqc}  HNDL-flows=${quantum.hndl_exposed_flow_count}`,
  );

  if (quantum.reencrypt_queue.length > 0) {
    lines.push("\n  Очередь re-encryption:");
    for (const r of quantum.reencrypt_queue.slice(0, 5)) {
      lines.push(
        `    [${r.urgency}] ${r.name} (x=${r.confidentiality_years}y) — ${r.reasons[0] ?? ""}`,
      );
    }
  }

  if (quantum.migration_steps.length > 0) {
    lines.push("\n  PQC-миграция (NIST):");
    for (const s of quantum.migration_steps.slice(0, 5)) {
      lines.push(`    ${s.classical} → ${s.pqc_replacement} (${s.flow_name})`);
    }
  }

  for (const r of quantum.recommendations.slice(0, 4)) {
    lines.push(`  → ${r}`);
  }

  lines.push("\n── 🤖 ИИ-слой (реализация) ──");

  if (analyze.adversary.ai_implementation) {
    const g = report.ai_governance;
    lines.push(
      `  IFF/язык: configured=${g.configured}  own=${g.friend_or_foe.own_count} foreign=${g.friend_or_foe.foreign_count}  channels=${g.ai_language.channel_count}`,
    );
    for (const s of g.operator_summary) {
      lines.push(`    → ${s}`);
    }
    const govFails = [
      ...g.friend_or_foe.findings,
      ...g.ai_language.findings,
      ...g.flow_bindings.findings,
    ].filter((f) => f.severity === "fail");
    for (const f of govFails.slice(0, 5)) {
      lines.push(`    ✗ ${f.message}`);
    }
  }

  if (report.ai_vs_ai.enabled) {
    lines.push(
      `  Атаки (модель): ${report.ai_vs_ai.triggered_attacks.length} сработало из scan, векторов ${report.ai_vs_ai.attack_vectors.length}`,
    );
    if (report.ai_vs_ai.triggered_attacks.length > 0) {
      lines.push(
        `  triggered: ${report.ai_vs_ai.triggered_attacks.join(", ")}`,
      );
    }
    lines.push("  P0 защита (если я — атакующий ИИ, вы делаете):");
    for (const d of report.ai_vs_ai.prioritized_defenses.slice(0, 6)) {
      lines.push(`    [${d.priority}] ${d.title}`);
    }
  }

  if (assurance.adversary_ai) {
    lines.push(
      `  ${assurance.passed} pass / ${assurance.failed} fail / ${assurance.review} review`,
    );
    for (const item of assurance.items) {
      if (item.status === "na") continue;
      const icon =
        item.status === "pass"
          ? "✓"
          : item.status === "fail"
            ? "✗"
            : "?";
      lines.push(`  ${icon} [${item.status}] ${item.title}`);
    }
  } else {
    lines.push("  adversary.ai_implementation=false");
  }

  lines.push("\n── Risk (потоки) ──");
  lines.push(
    `  critical=${analyze.summary.critical} high=${analyze.summary.high} medium=${analyze.summary.medium} low=${analyze.summary.low}`,
  );

  lines.push(`\n── Crypto Agility: ${agility.score}/100 (${agility.tier}) ──`);

  if (report.tls) {
    lines.push(formatTlsReconcile(report.tls.reconcile));
  }

  lines.push(
    `\n── CBOM: ${report.cbom.components.length} components ──`,
  );
  lines.push("  Playbook: safetyos playbook -m <threat-model.yaml>\n");

  return lines.join("\n");
}
