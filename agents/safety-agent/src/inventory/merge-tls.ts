/**
 * Добавление TLS inventory как data_flows в threat model.
 */
import type { DataFlow, ThreatModel } from "../types/threat-model.js";
import type { TlsInventoryReport } from "./types.js";

function fileToId(file: string): string {
  return file
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .slice(0, 40);
}

export function dataFlowsFromTlsInventory(
  report: TlsInventoryReport,
): DataFlow[] {
  const byFile = new Map<string, TlsInventoryReport["records"]>();

  for (const r of report.records) {
    const list = byFile.get(r.file) ?? [];
    list.push(r);
    byFile.set(r.file, list);
  }

  const flows: DataFlow[] = [];

  for (const [file, records] of byFile) {
    const kex = new Set<string>();
    const sym = new Set<string>();
    const hash = new Set<string>();
    let hasCritical = false;

    for (const r of records) {
      r.inferred.key_exchange.forEach((x) => kex.add(x));
      r.inferred.symmetric.forEach((x) => sym.add(x));
      r.inferred.hash.forEach((x) => hash.add(x));
      if (r.findings.some((f) => f.severity === "critical")) {
        hasCritical = true;
      }
    }

    flows.push({
      id: `tls-config-${fileToId(file)}`,
      name: `TLS config: ${file.replace(report.root, "").replace(/^\//, "") || file}`,
      storage: hasCritical ? "long" : "ephemeral",
      hndl_exposed: true,
      crypto: {
        key_exchange: [...kex],
        signatures: [],
        symmetric: [...sym],
        hash: [...hash],
      },
      tags: ["tls", "from-inventory", "todo-review"],
    });
  }

  return flows;
}

export function mergeTlsInventoryIntoModel(
  model: ThreatModel,
  report: TlsInventoryReport,
): ThreatModel {
  const drafted = dataFlowsFromTlsInventory(report);
  const ids = new Set(model.data_flows.map((f) => f.id));
  const merged = [...model.data_flows];

  for (const flow of drafted) {
    let id = flow.id;
    let n = 1;
    while (ids.has(id)) {
      id = `${flow.id}-${n++}`;
    }
    ids.add(id);
    merged.push({ ...flow, id });
  }

  return { ...model, data_flows: merged };
}
