/**
 * Предложения: обновить crypto TLS-потоков из inventory (без записи файла).
 */
import type { DataFlow, ThreatModel } from "../types/threat-model.js";
import { isTlsFlow, matchRecordsToFlows } from "./reconcile-match.js";
import type { TlsInventoryReport } from "./types.js";

export interface TlsFlowSyncSuggestion {
  flow_id: string;
  action: "update_crypto" | "add_tag";
  reason: string;
  crypto_patch?: DataFlow["crypto"];
  tags_add?: string[];
}

export function suggestTlsFlowSync(
  model: ThreatModel,
  inventory: TlsInventoryReport,
): TlsFlowSyncSuggestion[] {
  const tlsFlows = model.data_flows.filter(isTlsFlow);
  const recordToFlow = matchRecordsToFlows(inventory.records, tlsFlows);
  const suggestions: TlsFlowSyncSuggestion[] = [];

  const byFlow = new Map<string, typeof inventory.records>();
  for (const record of inventory.records) {
    const fid = recordToFlow.get(record.id);
    if (!fid) continue;
    const list = byFlow.get(fid) ?? [];
    list.push(record);
    byFlow.set(fid, list);
  }

  for (const [flowId, records] of byFlow) {
    const kex = new Set<string>();
    const sym = new Set<string>();
    const hash = new Set<string>();
    for (const r of records) {
      r.inferred.key_exchange.forEach((x) => kex.add(x));
      r.inferred.symmetric.forEach((x) => sym.add(x));
      r.inferred.hash.forEach((x) => hash.add(x));
    }
    suggestions.push({
      flow_id: flowId,
      action: "update_crypto",
      reason: `Синхронизировать с ${records.length} записью(ями) inventory`,
      crypto_patch: {
        key_exchange: [...kex],
        signatures: [],
        symmetric: [...sym],
        hash: [...hash],
      },
      tags_add: ["tls-synced"],
    });
  }

  return suggestions;
}

/** Применить предложения к модели (crypto + теги). */
export function applyTlsFlowSync(
  model: ThreatModel,
  suggestions: TlsFlowSyncSuggestion[],
): ThreatModel {
  const byId = new Map(suggestions.map((s) => [s.flow_id, s]));
  const data_flows = model.data_flows.map((flow) => {
    const s = byId.get(flow.id);
    if (!s?.crypto_patch) return flow;
    const tags = [...new Set([...(flow.tags ?? []), ...(s.tags_add ?? [])])];
    return {
      ...flow,
      tags,
      crypto: {
        key_exchange: [...s.crypto_patch.key_exchange],
        signatures: [...(s.crypto_patch.signatures ?? [])],
        symmetric: [...s.crypto_patch.symmetric],
        hash: [...s.crypto_patch.hash],
      },
    };
  });
  return { ...model, data_flows };
}
