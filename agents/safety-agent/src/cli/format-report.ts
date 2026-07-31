/**
 * Форматирование отчётов analyze/scan для терминала.
 */
import type { AnalyzeReport } from "../types/threat-model.js";
import type { ScanReport } from "../scanner/scan-directory.js";

const TIER_ICON: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

export function formatAnalyzeReport(report: AnalyzeReport): string {
  const lines: string[] = [];

  lines.push(`\n══ SafetyOS Analysis — ${report.organization} ══\n`);

  lines.push("Mosca (организация):");
  lines.push(
    `  at_risk: ${report.mosca.at_risk}  margin: ${report.mosca.margin_years} лет`,
  );
  lines.push(
    `  x_max=${report.mosca.x_max_years}y  y_migrate=${report.mosca.y_migration_years}y  z_horizon=${report.mosca.z_horizon_years}y`,
  );
  lines.push(
    `  adversary: quantum_record=${report.adversary.quantum_record}  ai_impl=${report.adversary.ai_implementation}`,
  );
  lines.push("");

  lines.push(
    `Потоки: ${report.summary.total_flows}  |  critical=${report.summary.critical}  high=${report.summary.high}  medium=${report.summary.medium}  low=${report.summary.low}`,
  );
  if (report.summary.policy_blocks > 0) {
    lines.push(`  policy blocks: ${report.summary.policy_blocks}`);
  }
  lines.push("");

  for (const flow of report.flows) {
    const icon = TIER_ICON[flow.tier] ?? "•";
    lines.push(
      `${icon} [${flow.tier.toUpperCase()}] ${flow.score}/100 — ${flow.id} (${flow.name})`,
    );
    lines.push(
      `    confidentiality: ${flow.confidentiality_years}y  mosca_flow: ${flow.mosca_flow_at_risk}`,
    );

    for (const f of flow.findings) {
      lines.push(`    · [${f.severity}] ${f.code}: ${f.message}`);
    }
    for (const r of flow.recommendations) {
      lines.push(`    → ${r}`);
    }
    if (flow.policy_violations.length) {
      for (const v of flow.policy_violations) {
        lines.push(`    ⛔ ${v}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function formatScanReport(report: ScanReport): string {
  const lines: string[] = [];
  lines.push(`\n══ SafetyOS Crypto Scan — ${report.root} ══\n`);
  lines.push(`Файлов: ${report.files_scanned}  Находок: ${report.findings.length}\n`);

  if (report.findings.length === 0) {
    lines.push("Критичных паттернов не найдено.\n");
    return lines.join("\n");
  }

  for (const f of report.findings) {
    lines.push(
      `[${f.severity}] ${f.pattern_id} — ${pathRelative(f.file, report.root)}:${f.line}:${f.column}`,
    );
    lines.push(`  ${f.message}`);
    lines.push(`  ${f.snippet}`);
    lines.push("");
  }

  return lines.join("\n");
}

function pathRelative(file: string, root: string): string {
  if (file.startsWith(root)) {
    return file.slice(root.length).replace(/^\//, "") || file;
  }
  return file;
}
