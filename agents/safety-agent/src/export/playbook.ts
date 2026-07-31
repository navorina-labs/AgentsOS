/**
 * Playbook миграции: квант + ИИ — markdown из полной оценки.
 */
import type { FullAssessment } from "../engine/assess.js";
import { renderTlsPlaybookSection } from "./tls-export.js";

export function renderDefensePlaybook(report: FullAssessment): string {
  const lines: string[] = [];
  const { analyze, quantum, assurance, agility } = report;

  lines.push("# SafetyOS — Playbook защиты (квант + ИИ)\n");
  lines.push(`Организация: **${analyze.organization}**`);
  lines.push(`Дата: ${new Date().toISOString().slice(0, 10)}\n`);

  lines.push("## 1. Квантовая угроза\n");
  lines.push(`- HNDL (перехват ciphertext): **${quantum.quantum_record ? "да" : "нет"}**`);
  lines.push(`- Моска at_risk: **${quantum.mosca_at_risk}** (margin ${quantum.mosca_margin_years} лет)`);
  lines.push(
    `- Потоки quantum-vulnerable: **${quantum.flows_quantum_vulnerable}**, с PQC: **${quantum.flows_with_pqc}**`,
  );
  lines.push("");

  if (quantum.reencrypt_queue.length > 0) {
    lines.push("### Очередь re-encryption (HNDL)\n");
    lines.push("| Приоритет | Поток | Срок x (лет) | HNDL |");
    lines.push("|-----------|-------|--------------|------|");
    for (const r of quantum.reencrypt_queue) {
      lines.push(
        `| ${r.urgency} | ${r.name} | ${r.confidentiality_years} | ${r.hndl_exposed ? "да" : "нет"} |`,
      );
    }
    lines.push("");
  }

  if (quantum.migration_steps.length > 0) {
    lines.push("### PQC-миграция (NIST)\n");
    for (const step of quantum.migration_steps.slice(0, 20)) {
      lines.push(`#### ${step.flow_name} — ${step.classical} → ${step.pqc_replacement}`);
      lines.push(`- ${step.nist_ref}`);
      lines.push(`- ${step.action}`);
      if (step.hybrid_transition) {
        lines.push(`- Hybrid: ${step.hybrid_transition}`);
      }
      lines.push("");
    }
  }

  for (const r of quantum.recommendations) {
    lines.push(`- ${r}`);
  }
  lines.push("");

  lines.push("## 2. ИИ-усиленные атаки (реализация)\n");
  if (assurance.adversary_ai) {
    lines.push(
      `Статус: ${assurance.passed} pass / ${assurance.failed} fail / ${assurance.review} review\n`,
    );
    for (const item of assurance.items) {
      if (item.status === "na") continue;
      lines.push(`- [${item.status.toUpperCase()}] **${item.title}** — ${item.rationale}`);
    }
  } else {
    lines.push("_Профиль adversary.ai_implementation: false — слой B не активен._\n");
  }

  if (report.ai_governance.configured || report.analyze.adversary.ai_implementation) {
    const g = report.ai_governance;
    lines.push("\n### 2.1 Свой / чужой (IFF)\n");
    if (!g.configured) {
      lines.push(
        "_Добавьте `ai_governance` в threat model (шаблон: `safetyos init`)._\n",
      );
    } else {
      lines.push(
        `**Свои (${g.friend_or_foe.own_count}):** orchestrator, HSM, approved MCP — могут задавать инструкции и tools.\n`,
      );
      lines.push(
        `**Чужие (${g.friend_or_foe.foreign_count}):** user, RAG, vendor model — только данные, с delimiter.\n`,
      );
      for (const f of g.friend_or_foe.findings.filter((x) => x.severity !== "ok")) {
        lines.push(`- [${f.severity}] ${f.message}`);
      }
    }

    lines.push("\n### 2.2 Язык ИИ (каналы)\n");
    if (g.configured) {
      lines.push(
        `Instruction: ${g.ai_language.instruction_channels.join(", ") || "—"}`,
      );
      lines.push(
        `Foreign: ${g.ai_language.foreign_channels.join(", ") || "—"}\n`,
      );
      for (const f of g.ai_language.findings.filter((x) => x.severity === "fail")) {
        lines.push(`- **FAIL** ${f.message}`);
      }
    }
  }

  if (report.ai_vs_ai.enabled) {
    lines.push("\n### 2.3 ИИ против ИИ (red team → blue team)\n");
    lines.push(
      "Если атакующий — автономный ИИ, типичная цепочка: ключи в git → prompt injection в RAG → tool abuse → слабый crypto в PR.\n",
    );
    if (report.ai_vs_ai.triggered_attacks.length > 0) {
      lines.push(
        `**Сработало по scan:** ${report.ai_vs_ai.triggered_attacks.join(", ")}\n`,
      );
    }
    lines.push("#### Векторы атаки\n");
    for (const v of report.ai_vs_ai.attack_vectors) {
      lines.push(`- **${v.title}** (${v.phase}): ${v.attacker_action}`);
    }
    lines.push("\n#### Приоритетные контрмеры\n");
    for (const d of report.ai_vs_ai.prioritized_defenses) {
      lines.push(`- **[${d.priority}] ${d.title}** — ${d.action}`);
    }
    lines.push("\n#### Чеклист оператора\n");
    for (const c of report.ai_vs_ai.operator_checklist) {
      lines.push(`- ${c}`);
    }
    lines.push("");
  }

  lines.push(renderTlsPlaybookSection(report));

  lines.push("\n## 4. Crypto Agility\n");
  lines.push(`Score: **${agility.score}/100** (${agility.tier})\n`);
  for (const r of agility.recommendations) {
    lines.push(`- ${r}`);
  }

  lines.push("\n## 5. Risk summary\n");
  lines.push(
    `critical=${analyze.summary.critical} high=${analyze.summary.high} medium=${analyze.summary.medium} low=${analyze.summary.low}`,
  );

  lines.push("\n---\n*Сгенерировано SafetyOS. Не заменяет криптоаудит и сертификацию.*\n");
  return lines.join("\n");
}
