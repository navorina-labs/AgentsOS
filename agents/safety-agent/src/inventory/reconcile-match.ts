/**
 * Сопоставление TLS inventory records ↔ data_flows threat model.
 */
import type { DataFlow } from "../types/threat-model.js";
import type { TlsConfigRecord, TlsConfigSource } from "./types.js";

const SOURCE_FLOW_HINTS: Record<TlsConfigSource, string[]> = {
  nginx: ["nginx", "edge", "tls", "api", "public"],
  apache: ["apache", "edge", "tls", "api"],
  env: ["edge", "tls", "env"],
  docker: ["edge", "tls", "docker"],
  haproxy: ["edge", "haproxy", "tls"],
  traefik: ["traefik", "edge", "mesh", "mtls"],
  "k8s-ingress": ["ingress", "edge", "tls", "k8s"],
  "cert-manager": ["ingress", "edge", "tls", "cert"],
  generic: ["tls", "edge"],
};

export function isTlsFlow(flow: DataFlow): boolean {
  if (flow.tags?.some((t) => /^(tls|edge|ingress|nginx|apache|traefik)$/i.test(t))) {
    return true;
  }
  return /tls|https|ingress|nginx|apache|gateway|traefik/i.test(
    `${flow.id} ${flow.name}`,
  );
}

function flowHaystack(flow: DataFlow): string {
  return `${flow.id} ${flow.name} ${(flow.tags ?? []).join(" ")}`.toLowerCase();
}

export function scoreRecordToFlow(
  record: TlsConfigRecord,
  flow: DataFlow,
): number {
  let score = 0;
  const hay = flowHaystack(flow);
  const file = record.file.replace(/\\/g, "/").toLowerCase();

  for (const hint of SOURCE_FLOW_HINTS[record.source] ?? ["tls"]) {
    if (hay.includes(hint)) score += 10;
    if (file.includes(hint)) score += 4;
  }

  const base = (file.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
  if (base.length > 2 && hay.includes(base.replace(/[^a-z0-9]+/g, "-"))) {
    score += 6;
  }

  const modelKex = new Set(
    (flow.crypto.key_exchange ?? []).map((k) => k.toUpperCase()),
  );
  for (const k of record.inferred.key_exchange) {
    if (modelKex.has(k.toUpperCase())) score += 8;
  }

  return score;
}

export function matchRecordsToFlows(
  records: TlsConfigRecord[],
  tlsFlows: DataFlow[],
  minScore = 8,
): Map<string, string> {
  const recordToFlow = new Map<string, string>();
  if (tlsFlows.length === 0) return recordToFlow;

  for (const record of records) {
    let bestId = "";
    let bestScore = 0;
    for (const flow of tlsFlows) {
      const s = scoreRecordToFlow(record, flow);
      if (s > bestScore) {
        bestScore = s;
        bestId = flow.id;
      }
    }
    if (bestScore >= minScore) {
      recordToFlow.set(record.id, bestId);
    }
  }

  return recordToFlow;
}

export function flowsWithoutInventoryMatch(
  tlsFlows: DataFlow[],
  recordToFlow: Map<string, string>,
): DataFlow[] {
  const matchedFlowIds = new Set(recordToFlow.values());
  return tlsFlows.filter((f) => !matchedFlowIds.has(f.id));
}
