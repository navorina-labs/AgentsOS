/**
 * Форматирование TLS inventory и reconcile.
 */
import type { TlsInventoryReport, TlsReconcileReport } from "../inventory/types.js";

export function formatTlsInventory(report: TlsInventoryReport): string {
  const lines: string[] = [];
  lines.push(`\n══ TLS Inventory — ${report.root} ══\n`);
  lines.push(
    `Файлов: ${report.files_scanned}  Записей: ${report.records.length}  С issues: ${report.summary.records_with_issues}`,
  );
  lines.push(`KEX в конфигах: ${report.summary.inferred_kex.join(", ") || "—"}\n`);

  if (report.records.length === 0) {
    lines.push("TLS-директивы не найдены.\n");
    return lines.join("\n");
  }

  for (const r of report.records) {
    const crit = r.findings.filter((f) => f.severity === "critical").length;
    const icon = crit > 0 ? "🔴" : r.findings.length ? "🟡" : "🟢";
    lines.push(`${icon} ${r.source} ${r.file}:${r.line}`);
    lines.push(`  ${r.snippet}`);
    if (r.protocols.length) lines.push(`  protocols: ${r.protocols.join(" ")}`);
    if (r.inferred.key_exchange.length) {
      lines.push(`  kex: ${r.inferred.key_exchange.join(", ")}`);
    }
    for (const f of r.findings) {
      lines.push(`  · [${f.severity}] ${f.code}: ${f.message}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function formatTlsReconcile(report: TlsReconcileReport): string {
  const lines: string[] = [];
  lines.push("\n── TLS Reconcile (model ↔ config) ──\n");
  lines.push(
    `Inventory records: ${report.inventory_records}  TLS flows in model: ${report.tls_flows_in_model}`,
  );

  if (report.matched?.length) {
    lines.push("\nСопоставлено record → flow:");
    for (const m of report.matched.slice(0, 20)) {
      lines.push(`  · ${m.flow_id} ← ${m.file.split("/").pop()}`);
    }
  }
  if (report.unmatched_flow_ids?.length) {
    lines.push(`Потоки без конфига: ${report.unmatched_flow_ids.join(", ")}`);
  }

  if (report.drifts.length === 0) {
    lines.push("Расхождений не обнаружено.\n");
    return lines.join("\n");
  }

  for (const d of report.drifts) {
    const icon =
      d.severity === "critical" ? "⛔" : d.severity === "warning" ? "⚠" : "ℹ";
    const flow = d.flow_id ? ` (${d.flow_id})` : "";
    lines.push(`${icon} [${d.kind}]${flow} ${d.message}`);
  }
  lines.push("");
  return lines.join("\n");
}
