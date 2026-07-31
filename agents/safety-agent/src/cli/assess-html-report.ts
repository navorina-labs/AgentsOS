/**
 * HTML dashboard для safetyos assess (квант + ИИ + risk + assurance).
 */
import type { FullAssessment } from "../engine/assess.js";
import type { AssuranceStatus } from "../assurance/checklist.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const TIER_COLOR: Record<string, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#ca8a04",
  low: "#16a34a",
};

const STATUS_ICON: Record<AssuranceStatus, string> = {
  pass: "✓",
  fail: "✗",
  review: "?",
  na: "—",
};

function summaryCard(title: string, body: string, accent?: string): string {
  const border = accent ? `border-top: 3px solid ${accent};` : "";
  return `<div class="card" style="${border}"><h3>${escapeHtml(title)}</h3>${body}</div>`;
}

export function renderAssessHtml(report: FullAssessment): string {
  const { analyze, quantum, agility, assurance, ai_governance, ai_vs_ai } =
    report;
  const date = new Date().toISOString().slice(0, 10);

  const tlsCrit =
    report.tls?.reconcile.drifts.filter((d) => d.severity === "critical")
      .length ?? 0;

  const cards = [
    summaryCard(
      "Mosca",
      `<p class="big ${quantum.mosca_at_risk ? "bad" : "ok"}">${
        quantum.mosca_at_risk ? "AT RISK" : "OK"
      }</p><p class="meta">margin ${quantum.mosca_margin_years}y</p>`,
      quantum.mosca_at_risk ? TIER_COLOR.critical : TIER_COLOR.low,
    ),
    summaryCard(
      "Crypto Agility",
      `<p class="big">${agility.score}<span class="unit">/100</span></p><p class="meta">${escapeHtml(agility.tier)}</p>`,
      agility.score >= 70 ? TIER_COLOR.low : TIER_COLOR.medium,
    ),
    summaryCard(
      "Assurance (ИИ)",
      `<p class="big"><span class="ok">${assurance.passed}</span> / <span class="bad">${assurance.failed}</span> / <span class="warn">${assurance.review}</span></p><p class="meta">pass / fail / review</p>`,
      assurance.failed > 0 ? TIER_COLOR.critical : TIER_COLOR.low,
    ),
    summaryCard(
      "Quantum flows",
      `<p class="big">${quantum.flows_quantum_vulnerable}</p><p class="meta">vuln · PQC ${quantum.flows_with_pqc}</p>`,
      quantum.flows_quantum_vulnerable > 0 ? TIER_COLOR.high : TIER_COLOR.low,
    ),
    ...(report.tls
      ? [
          summaryCard(
            "TLS drift",
            `<p class="big ${tlsCrit > 0 ? "bad" : "ok"}">${report.tls.reconcile.drifts.length}</p><p class="meta">critical ${tlsCrit} · matched ${report.tls.reconcile.matched?.length ?? 0}</p>`,
            tlsCrit > 0 ? TIER_COLOR.critical : TIER_COLOR.low,
          ),
        ]
      : []),
  ].join("");

  const flowRows = analyze.flows
    .map(
      (f) => `<tr>
        <td>${escapeHtml(f.name)}</td>
        <td><span class="pill" style="background:${TIER_COLOR[f.tier] ?? "#666"}">${escapeHtml(f.tier)}</span></td>
        <td>${f.score}</td>
        <td>${f.confidentiality_years}y</td>
        <td>${f.mosca_flow_at_risk ? "да" : "нет"}</td>
      </tr>`,
    )
    .join("");

  const reencryptRows = quantum.reencrypt_queue
    .slice(0, 12)
    .map(
      (r) =>
        `<tr><td>${escapeHtml(r.urgency)}</td><td>${escapeHtml(r.name)}</td><td>${r.confidentiality_years}y</td><td>${r.hndl_exposed ? "да" : "нет"}</td></tr>`,
    )
    .join("");

  const migrationRows = quantum.migration_steps
    .slice(0, 12)
    .map(
      (s) =>
        `<tr><td>${escapeHtml(s.flow_name)}</td><td>${escapeHtml(s.classical)}</td><td>${escapeHtml(s.pqc_replacement)}</td><td class="meta">${escapeHtml(s.nist_ref)}</td></tr>`,
    )
    .join("");

  const assuranceRows = assurance.items
    .filter((i) => i.status !== "na")
    .map(
      (i) =>
        `<tr><td>${STATUS_ICON[i.status]} ${escapeHtml(i.status)}</td><td>${escapeHtml(i.title)}</td><td class="meta">${escapeHtml(i.rationale)}</td></tr>`,
    )
    .join("");

  let iffSection = "";
  if (analyze.adversary.ai_implementation) {
    const govFails = [
      ...ai_governance.friend_or_foe.findings,
      ...ai_governance.ai_language.findings,
      ...ai_governance.flow_bindings.findings,
    ].filter((f) => f.severity === "fail");

    iffSection = `
    <section>
      <h2>Свой / чужой · язык ИИ</h2>
      <p class="meta">configured=${ai_governance.configured} · own=${ai_governance.friend_or_foe.own_count} · foreign=${ai_governance.friend_or_foe.foreign_count}</p>
      <ul>${ai_governance.operator_summary.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      ${govFails.length > 0 ? `<ul class="fails">${govFails.map((f) => `<li>${escapeHtml(f.message)}</li>`).join("")}</ul>` : ""}
    </section>`;

    if (ai_vs_ai.enabled) {
      iffSection += `
    <section>
      <h2>ИИ против ИИ</h2>
      <p class="meta">triggered: ${escapeHtml(ai_vs_ai.triggered_attacks.join(", ") || "—")}</p>
      <ul>${ai_vs_ai.prioritized_defenses.slice(0, 8).map((d) => `<li><strong>${d.priority}</strong> ${escapeHtml(d.title)}</li>`).join("")}</ul>
    </section>`;
    }
  }

  let tlsSection = "";
  if (report.tls) {
    const { inventory, reconcile } = report.tls;
    const driftRows = reconcile.drifts
      .slice(0, 20)
      .map((d) => {
        const sevColor =
          d.severity === "critical"
            ? TIER_COLOR.critical
            : d.severity === "warning"
              ? TIER_COLOR.high
              : "#64748b";
        return `<tr>
        <td><span class="pill" style="background:${sevColor}">${escapeHtml(d.severity)}</span></td>
        <td class="meta">${escapeHtml(d.kind)}</td>
        <td>${d.flow_id ? `<code>${escapeHtml(d.flow_id)}</code>` : "—"}</td>
        <td>${escapeHtml(d.message)}</td>
      </tr>`;
      })
      .join("");

    const invRows = inventory.records
      .slice(0, 15)
      .map((r) => {
        const crit = r.findings.some((f) => f.severity === "critical");
        const matched = reconcile.matched?.find((m) => m.record_id === r.id);
        return `<tr>
        <td>${crit ? "🔴" : "🟢"}</td>
        <td>${escapeHtml(r.source)}</td>
        <td class="meta">${escapeHtml(r.file.split("/").pop() ?? r.file)}:${r.line}</td>
        <td>${escapeHtml(r.protocols.join(" ") || "—")}</td>
        <td>${escapeHtml(r.inferred.key_exchange.join(", ") || "—")}</td>
        <td>${matched ? `<code>${escapeHtml(matched.flow_id)}</code>` : "—"}</td>
      </tr>`;
      })
      .join("");

    const matchList =
      reconcile.matched && reconcile.matched.length > 0
        ? `<ul class="meta">${reconcile.matched
            .slice(0, 8)
            .map(
              (m) =>
                `<li><code>${escapeHtml(m.flow_id)}</code> ← ${escapeHtml(m.file.split("/").pop() ?? m.file)}</li>`,
            )
            .join("")}</ul>`
        : "";

    tlsSection = `
    <section>
      <h2>TLS inventory ↔ threat model</h2>
      <p class="meta">scanned ${inventory.files_scanned} files · ${reconcile.inventory_records} records · ${reconcile.tls_flows_in_model} TLS flows in model</p>
      ${matchList}
      <h3>Конфиги</h3>
      <table><thead><tr><th></th><th>Source</th><th>File</th><th>Protocols</th><th>KEX</th><th>Flow</th></tr></thead><tbody>${invRows || "<tr><td colspan=6>нет</td></tr>"}</tbody></table>
      <h3>Drift / расхождения</h3>
      <table><thead><tr><th>Severity</th><th>Kind</th><th>Flow</th><th>Message</th></tr></thead><tbody>${driftRows || "<tr><td colspan=4>нет</td></tr>"}</tbody></table>
      <p class="meta">Команды: safetyos inventory reconcile · safetyos inventory suggest · safetyos inventory tls --merge</p>
    </section>`;
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>SafetyOS Assess — ${escapeHtml(analyze.organization)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1100px; margin: 0 auto; padding: 1.5rem; background: #0b0f14; color: #e8edf4; }
    h1 { font-size: 1.6rem; margin: 0 0 0.25rem; }
    h2 { font-size: 1.15rem; margin: 2rem 0 0.75rem; border-bottom: 1px solid #243044; padding-bottom: 0.35rem; }
    h3 { font-size: 0.85rem; text-transform: uppercase; color: #94a3b8; margin: 1rem 0 0.5rem; }
    .subtitle { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .card { background: #141c27; border-radius: 10px; padding: 1rem; }
    .card h3 { font-size: 0.85rem; text-transform: uppercase; color: #94a3b8; margin: 0 0 0.5rem; }
    .big { font-size: 1.75rem; font-weight: 700; margin: 0; }
    .unit { font-size: 1rem; color: #64748b; font-weight: 400; }
    .meta { color: #94a3b8; font-size: 0.85rem; }
    .ok { color: #4ade80; } .bad { color: #f87171; } .warn { color: #fbbf24; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; background: #141c27; border-radius: 8px; margin-top: 0.5rem; }
    th, td { padding: 0.55rem 0.75rem; text-align: left; border-bottom: 1px solid #1e293b; }
    th { color: #94a3b8; }
    .pill { padding: 0.1rem 0.45rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #fff; }
    ul { margin: 0.5rem 0; padding-left: 1.25rem; }
    .fails { color: #fca5a5; }
    footer { margin-top: 3rem; color: #475569; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>SafetyOS — Defense Assessment</h1>
  <p class="subtitle">${escapeHtml(analyze.organization)} · ${date}</p>
  <div class="grid">${cards}</div>
  <section>
    <h2>Риск по потокам</h2>
    <table><thead><tr><th>Поток</th><th>Tier</th><th>Score</th><th>x</th><th>Mosca</th></tr></thead><tbody>${flowRows}</tbody></table>
  </section>
  <section>
    <h2>Квантовый слой</h2>
    ${reencryptRows ? `<h3>Re-encryption</h3><table><thead><tr><th>Urgency</th><th>Flow</th><th>x</th><th>HNDL</th></tr></thead><tbody>${reencryptRows}</tbody></table>` : ""}
    ${migrationRows ? `<h3>PQC migration</h3><table><thead><tr><th>Flow</th><th>From</th><th>To</th><th>NIST</th></tr></thead><tbody>${migrationRows}</tbody></table>` : ""}
  </section>
  ${iffSection}
  <section>
    <h2>Assurance</h2>
    <table><thead><tr><th>Status</th><th>Check</th><th>Note</th></tr></thead><tbody>${assuranceRows}</tbody></table>
  </section>
  ${tlsSection}
  <footer>SafetyOS · safetyos assess --html</footer>
</body>
</html>`;
}
