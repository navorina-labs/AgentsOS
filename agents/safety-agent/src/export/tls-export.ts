/**
 * Экспорт TLS inventory / drift в CBOM и playbook.
 */
import type { CycloneDxBom, CbomComponent } from "./cbom.js";
import type { FullAssessment } from "../engine/assess.js";
import type { TlsInventoryReport, TlsReconcileReport } from "../inventory/types.js";

function basename(file: string): string {
  const parts = file.split("/");
  return parts[parts.length - 1] ?? file;
}

export function enrichCbomWithTls(
  bom: CycloneDxBom,
  inventory: TlsInventoryReport,
  reconcile: TlsReconcileReport,
): CycloneDxBom {
  const extra: CbomComponent[] = [];

  for (const r of inventory.records) {
    const matched = reconcile.matched?.find((m) => m.record_id === r.id);
    const crit = r.findings.filter((f) => f.severity === "critical");
    extra.push({
      type: "cryptographic-asset",
      name: `${r.source} ${basename(r.file)}:${r.line}`,
      bom_ref: `tls-config/${r.id}`,
      properties: [
        { name: "safetyos:asset-kind", value: "tls-runtime-config" },
        { name: "safetyos:tls-source", value: r.source },
        { name: "safetyos:tls-file", value: r.file },
        { name: "safetyos:tls-line", value: String(r.line) },
        {
          name: "safetyos:tls-protocols",
          value: r.protocols.join(",") || "unknown",
        },
        {
          name: "safetyos:tls-kex",
          value: r.inferred.key_exchange.join(",") || "—",
        },
        ...(matched
          ? [{ name: "safetyos:tls-flow-id", value: matched.flow_id }]
          : []),
        ...crit.map((f) => ({
          name: `safetyos:tls-finding-${f.code}`,
          value: f.message,
        })),
      ],
    });
  }

  reconcile.drifts.forEach((d, i) => {
    extra.push({
      type: "cryptographic-asset",
      name: `drift:${d.kind}`,
      bom_ref: `tls-drift/${d.kind}-${i}`,
      properties: [
        { name: "safetyos:asset-kind", value: "tls-drift" },
        { name: "safetyos:drift-severity", value: d.severity },
        { name: "safetyos:drift-kind", value: d.kind },
        { name: "safetyos:drift-message", value: d.message },
        ...(d.flow_id ? [{ name: "safetyos:tls-flow-id", value: d.flow_id }] : []),
        ...(d.file ? [{ name: "safetyos:tls-file", value: d.file }] : []),
      ],
    });
  });

  const meta = bom.metadata.properties ?? [];
  meta.push(
    {
      name: "safetyos:tls-inventory-records",
      value: String(reconcile.inventory_records),
    },
    {
      name: "safetyos:tls-drift-count",
      value: String(reconcile.drifts.length),
    },
    {
      name: "safetyos:tls-drift-critical",
      value: String(
        reconcile.drifts.filter((d) => d.severity === "critical").length,
      ),
    },
  );

  return {
    ...bom,
    metadata: { ...bom.metadata, properties: meta },
    components: [...bom.components, ...extra],
  };
}

export function renderTlsPlaybookSection(report: FullAssessment): string {
  if (!report.tls) return "";

  const { inventory, reconcile } = report.tls;
  const lines: string[] = [];

  lines.push("\n## 3. TLS inventory ↔ threat model\n");
  lines.push(
    `Записей в inventory: **${reconcile.inventory_records}** · TLS-потоков в модели: **${reconcile.tls_flows_in_model}** · Drift: **${reconcile.drifts.length}**\n`,
  );

  if (reconcile.matched?.length) {
    lines.push("### Сопоставление config → flow\n");
    lines.push("| Flow | Config |");
    lines.push("|------|--------|");
    for (const m of reconcile.matched.slice(0, 15)) {
      lines.push(`| \`${m.flow_id}\` | ${basename(m.file)} |`);
    }
    lines.push("");
  }

  const crit = reconcile.drifts.filter((d) => d.severity === "critical");
  if (crit.length > 0) {
    lines.push("### Критичные drift (исправить в конфиге)\n");
    for (const d of crit) {
      const flow = d.flow_id ? ` (\`${d.flow_id}\`)` : "";
      lines.push(`- **${d.kind}**${flow}: ${d.message}`);
    }
    lines.push("");
  }

  const warn = reconcile.drifts.filter((d) => d.severity === "warning");
  if (warn.length > 0) {
    lines.push("### Предупреждения\n");
    for (const d of warn.slice(0, 10)) {
      lines.push(`- ${d.message}`);
    }
    lines.push("");
  }

  lines.push("### Действия\n");
  lines.push("- `safetyos inventory suggest --apply` — подтянуть crypto потоков из конфигов");
  lines.push("- `safetyos inventory reconcile` — повторная сверка после правок");
  lines.push("- Миграция TLS: TLS 1.2/1.3 only, hybrid ML-KEM на edge\n");

  const weakRecords = inventory.records.filter((r) =>
    r.findings.some((f) => f.severity === "critical"),
  );
  if (weakRecords.length > 0) {
    lines.push("\n### Слабые конфиги\n");
    lines.push("| Source | File | Protocols |");
    lines.push("|--------|------|-----------|");
    for (const r of weakRecords.slice(0, 10)) {
      lines.push(
        `| ${r.source} | ${basename(r.file)} | ${r.protocols.join(" ") || "—"} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
