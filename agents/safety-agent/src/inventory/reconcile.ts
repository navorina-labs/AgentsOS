/**
 * Сверка threat model (TLS-потоки) с TLS inventory конфигов.
 */
import { classifyAll, hasClass } from "../registry/algorithms.js";
import type { DataFlow, ThreatModel } from "../types/threat-model.js";
import {
  flowsWithoutInventoryMatch,
  isTlsFlow,
  matchRecordsToFlows,
} from "./reconcile-match.js";
import type {
  TlsConfigRecord,
  TlsDriftItem,
  TlsInventoryReport,
  TlsReconcileReport,
} from "./types.js";

function aggregateRecordKex(records: TlsConfigRecord[]): Set<string> {
  const set = new Set<string>();
  for (const r of records) {
    for (const k of r.inferred.key_exchange) set.add(k.toUpperCase());
  }
  return set;
}

function flowKexSet(flow: DataFlow): Set<string> {
  return new Set(
    (flow.crypto.key_exchange ?? []).map((k) => k.toUpperCase()),
  );
}

function modelClaimsPqc(flow: DataFlow): boolean {
  return hasClass(classifyAll(flow.crypto.key_exchange ?? []), "pqc");
}

function inventoryHasQuantumVulnOnly(kex: Set<string>): boolean {
  if (kex.size === 0) return false;
  const pqc = [...kex].some((k) => /ML-KEM|KYBER/i.test(k));
  return !pqc;
}

function pathBasename(file: string): string {
  const parts = file.split("/");
  return parts[parts.length - 1] ?? file;
}

export function reconcileTlsWithModel(
  model: ThreatModel,
  inventory: TlsInventoryReport,
): TlsReconcileReport {
  const drifts: TlsDriftItem[] = [];
  const tlsFlows = model.data_flows.filter(isTlsFlow);
  const recordToFlow = matchRecordsToFlows(inventory.records, tlsFlows);
  const matched: NonNullable<TlsReconcileReport["matched"]> = [];

  for (const [recordId, flowId] of recordToFlow) {
    const record = inventory.records.find((r) => r.id === recordId);
    if (record) {
      matched.push({
        record_id: recordId,
        flow_id: flowId,
        file: record.file,
      });
    }
  }

  for (const record of inventory.records) {
    const flowId = recordToFlow.get(record.id);
    for (const f of record.findings) {
      if (f.severity === "critical") {
        drifts.push({
          kind: "weak_in_config",
          severity: "critical",
          message: `${pathBasename(record.file)}:${record.line} [${record.source}] — ${f.message}`,
          file: record.file,
          flow_id: flowId,
        });
      } else if (f.severity === "warning" && flowId) {
        drifts.push({
          kind: "weak_in_config",
          severity: "warning",
          message: `${pathBasename(record.file)}:${record.line} — ${f.message}`,
          file: record.file,
          flow_id: flowId,
        });
      }
    }
  }

  for (const flow of tlsFlows) {
    const matchedRecords = inventory.records.filter(
      (record) => recordToFlow.get(record.id) === flow.id,
    );
    const invKex = aggregateRecordKex(matchedRecords);
    const modelKex = flowKexSet(flow);
    if (
      modelClaimsPqc(flow) &&
      inventoryHasQuantumVulnOnly(invKex) &&
      invKex.size > 0
    ) {
      drifts.push({
        kind: "model_config_mismatch",
        severity: "warning",
        message: `Поток "${flow.name}": в модели PQC, в конфигах нет ML-KEM (${[...invKex].join(", ")})`,
        flow_id: flow.id,
      });
    }

    if (modelKex.size > 0 && invKex.size > 0) {
      const overlap = [...modelKex].some((k) =>
        [...invKex].some((i) => i.includes(k) || k.includes(i)),
      );
      if (!overlap) {
        drifts.push({
          kind: "model_config_mismatch",
          severity: "info",
          message: `Поток "${flow.id}": KEX в модели не совпадает с inventory (${[...modelKex].join(", ")} vs ${[...invKex].join(", ")})`,
          flow_id: flow.id,
        });
      }
    }
  }

  const unmatchedFlows = flowsWithoutInventoryMatch(tlsFlows, recordToFlow);
  for (const flow of unmatchedFlows) {
    drifts.push({
      kind: "undocumented_endpoint",
      severity: "info",
      message: `Поток "${flow.id}" в модели, но нет сопоставленного TLS-конфига в inventory`,
      flow_id: flow.id,
    });
  }

  if (inventory.records.length > 0 && tlsFlows.length === 0) {
    drifts.push({
      kind: "undocumented_endpoint",
      severity: "warning",
      message:
        "TLS inventory нашёл конфиги, но в threat model нет потоков с тегом tls/edge",
    });
  }

  const unmatchedRecordIds = inventory.records
    .filter((r) => !recordToFlow.has(r.id))
    .map((r) => r.id);
  if (unmatchedRecordIds.length > 0 && tlsFlows.length > 0) {
    drifts.push({
      kind: "undocumented_endpoint",
      severity: "info",
      message: `${unmatchedRecordIds.length} записей inventory без привязки к потоку (safetyos inventory merge или добавьте теги)`,
    });
  }

  return {
    inventory_records: inventory.records.length,
    tls_flows_in_model: tlsFlows.length,
    drifts,
    matched,
    unmatched_flow_ids: unmatchedFlows.map((f) => f.id),
  };
}
