/**
 * Умное обогащение threat model находками scan: привязка к потокам по тегам/путям.
 */
import { classifyAlgorithm } from "../registry/algorithms.js";
import type { ScanFinding, ScanReport } from "../scanner/scan-directory.js";
import type { CryptoBlock, DataFlow, ThreatModel } from "../types/threat-model.js";
import { draftFlowsFromScan } from "./draft-from-scan.js";

/** Путь файла → подсказки id/tags существующих потоков. */
const PATH_FLOW_HINTS: Array<{ pattern: RegExp; hints: string[] }> = [
  { pattern: /\/scanner\//i, hints: ["scanner", "tooling"] },
  { pattern: /\/assurance\//i, hints: ["assurance", "catalog"] },
  { pattern: /\/inventory\//i, hints: ["inventory", "tls", "edge"] },
  { pattern: /\/registry\//i, hints: ["registry", "catalog", "nist"] },
  { pattern: /\/engine\//i, hints: ["engine", "tooling"] },
  { pattern: /\/cli\//i, hints: ["cli", "tooling"] },
  { pattern: /\/generator\//i, hints: ["generator", "tooling"] },
  { pattern: /tls|ssl|https|ingress|traefik|nginx|cert/i, hints: ["tls", "api", "edge", "mtls", "public"] },
  { pattern: /backup|archive|s3|blob|cold/i, hints: ["backup", "archive", "at-rest", "ledger"] },
  { pattern: /auth|login|oauth|jwt|session/i, hints: ["auth", "identity", "session"] },
  { pattern: /payment|billing|stripe|card/i, hints: ["payment", "billing", "fintech"] },
  { pattern: /wallet|chain|web3|solana|eth|sign/i, hints: ["wallet", "web3", "chain", "identity"] },
  { pattern: /grpc|mtls|mesh|internal/i, hints: ["mtls", "internal", "mesh"] },
  { pattern: /copilot|llm|openai|agent|ai/i, hints: ["copilot", "ai", "support", "assistant"] },
  { pattern: /message|chat|e2ee|signal/i, hints: ["e2ee", "messaging", "session"] },
  { pattern: /db|postgres|mongo|redis|storage/i, hints: ["at-rest", "data", "database", "ledger"] },
];

export interface EnrichFromScanResult {
  model: ThreatModel;
  enriched_flow_ids: string[];
  new_flow_ids: string[];
  unmatched_findings: number;
}

function hintToCrypto(hints: Set<string>): CryptoBlock {
  const block: CryptoBlock = {
    key_exchange: [],
    signatures: [],
    symmetric: [],
    hash: [],
  };

  for (const hint of hints) {
    const c = classifyAlgorithm(hint);
    const name = c.normalized || hint;
    switch (c.class) {
      case "pqc":
      case "quantum_vulnerable":
        if (/DSA|SIG|FALCON|SLH/i.test(name)) {
          if (!block.signatures.includes(name)) block.signatures.push(name);
        } else if (!block.key_exchange.includes(name)) {
          block.key_exchange.push(name);
        }
        break;
      case "symmetric_safe":
        if (!block.symmetric.includes(name)) block.symmetric.push(name);
        break;
      case "weak":
        if (!block.hash.includes(name)) block.hash.push(name);
        break;
      default:
        if (!block.hash.includes(name)) block.hash.push(name);
    }
  }

  return block;
}

function unionCrypto(base: CryptoBlock, extra: CryptoBlock): CryptoBlock {
  return {
    key_exchange: [...new Set([...(base.key_exchange ?? []), ...extra.key_exchange])],
    signatures: [...new Set([...(base.signatures ?? []), ...extra.signatures])],
    symmetric: [...new Set([...(base.symmetric ?? []), ...extra.symmetric])],
    hash: [...new Set([...(base.hash ?? []), ...extra.hash])],
  };
}

function groupFindingsByFile(
  report: ScanReport,
): Map<string, ScanFinding[]> {
  const map = new Map<string, ScanFinding[]>();
  for (const f of report.findings) {
    const list = map.get(f.file) ?? [];
    list.push(f);
    map.set(f.file, list);
  }
  return map;
}

function scoreFlowMatch(filePath: string, flow: DataFlow): number {
  let score = 0;
  const rel = filePath.replace(/\\/g, "/");
  const hay = `${flow.id} ${flow.name} ${(flow.tags ?? []).join(" ")}`.toLowerCase();

  for (const { pattern, hints } of PATH_FLOW_HINTS) {
    if (!pattern.test(rel)) continue;
    for (const h of hints) {
      if (hay.includes(h)) score += 12;
    }
  }

  const base = (rel.split("/").pop() ?? "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase();
  if (base.length > 2 && hay.includes(base.replace(/[^a-z0-9]+/g, "-"))) {
    score += 6;
  }

  return score;
}

function collectHints(findings: ScanFinding[]): Set<string> {
  const hints = new Set<string>();
  for (const f of findings) {
    if (f.algorithm_hint) hints.add(f.algorithm_hint);
  }
  return hints;
}

function scanRefTag(file: string, findings: ScanFinding[]): string {
  const line = findings[0]?.line ?? 0;
  const short = file.replace(/\\/g, "/").split("/").slice(-2).join("/");
  return `scan-ref:${short}:${line}`;
}

/**
 * Обогащает существующие потоки crypto из scan; несопоставленное — новые scan-* потоки.
 */
export function enrichModelFromScan(
  base: ThreatModel,
  report: ScanReport,
  options?: { minMatchScore?: number },
): EnrichFromScanResult {
  const minScore = options?.minMatchScore ?? 10;
  const byFile = groupFindingsByFile(report);
  const flows = base.data_flows.map((f) => ({
    ...f,
    crypto: {
      key_exchange: [...(f.crypto.key_exchange ?? [])],
      signatures: [...(f.crypto.signatures ?? [])],
      symmetric: [...(f.crypto.symmetric ?? [])],
      hash: [...(f.crypto.hash ?? [])],
    },
    tags: [...(f.tags ?? [])],
  }));

  const enrichedIds = new Set<string>();
  const orphanFindings: ScanFinding[] = [];

  for (const [file, findings] of byFile) {
    const hints = collectHints(findings);
    let bestIdx = -1;
    let bestScore = 0;

    for (let i = 0; i < flows.length; i++) {
      const s = scoreFlowMatch(file, flows[i]!);
      if (s > bestScore) {
        bestScore = s;
        bestIdx = i;
      }
    }

    if (bestIdx >= 0 && bestScore >= minScore) {
      const flow = flows[bestIdx]!;
      flow.crypto = unionCrypto(flow.crypto, hintToCrypto(hints));
      const ref = scanRefTag(file, findings);
      if (!flow.tags!.includes(ref)) flow.tags!.push(ref);
      if (!flow.tags!.includes("scan-enriched")) flow.tags!.push("scan-enriched");
      enrichedIds.add(flow.id);
    } else {
      orphanFindings.push(...findings);
    }
  }

  const orphanReport: ScanReport = {
    ...report,
    findings: orphanFindings,
  };
  const drafted = draftFlowsFromScan(orphanReport);
  const existingIds = new Set(flows.map((f) => f.id));
  const newFlowIds: string[] = [];

  for (const flow of drafted) {
    let id = flow.id;
    let n = 1;
    while (existingIds.has(id)) {
      id = `${flow.id}-${n++}`;
    }
    existingIds.add(id);
    newFlowIds.push(id);
    flows.push({
      ...flow,
      id,
      tags: [...(flow.tags ?? [])],
    });
  }

  return {
    model: { ...base, data_flows: flows },
    enriched_flow_ids: [...enrichedIds],
    new_flow_ids: newFlowIds,
    unmatched_findings: orphanFindings.length,
  };
}
