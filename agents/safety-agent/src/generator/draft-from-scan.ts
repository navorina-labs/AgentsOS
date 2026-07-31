/**
 * Черновик data_flow из результатов scan (merge scan → threat model).
 */
import { classifyAlgorithm } from "../registry/algorithms.js";
import { enrichModelFromScan } from "./enrich-from-scan.js";
import type { ScanFinding, ScanReport } from "../scanner/scan-directory.js";
import type { CryptoBlock, DataFlow, ThreatModel } from "../types/threat-model.js";
import { buildInitThreatModel, serializeThreatModel } from "./init-threat-model.js";

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

function groupFindingsByFile(findings: ScanFinding[]): Map<string, ScanFinding[]> {
  const map = new Map<string, ScanFinding[]>();
  for (const f of findings) {
    const list = map.get(f.file) ?? [];
    list.push(f);
    map.set(f.file, list);
  }
  return map;
}

function fileToFlowId(filePath: string): string {
  const base = filePath.split("/").pop() ?? "scan";
  return base
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .slice(0, 48);
}

export function draftFlowsFromScan(report: ScanReport): DataFlow[] {
  const byFile = groupFindingsByFile(report.findings);
  const flows: DataFlow[] = [];

  for (const [file, findings] of byFile) {
    const hints = new Set<string>();
    for (const f of findings) {
      if (f.algorithm_hint) hints.add(f.algorithm_hint);
    }
    const hasCritical = findings.some((f) => f.severity === "critical");
    const id = `scan-${fileToFlowId(file)}`;

    flows.push({
      id,
      name: `Scan: ${file.replace(report.root, "").replace(/^\//, "") || file}`,
      storage: hasCritical ? "long" : "short",
      hndl_exposed: false,
      crypto: hintToCrypto(hints),
      tags: ["auto-from-scan", "todo-review"],
    });
  }

  if (flows.length === 0 && report.findings.length > 0) {
    const allHints = new Set(
      report.findings
        .map((f) => f.algorithm_hint)
        .filter((h): h is string => Boolean(h)),
    );
    flows.push({
      id: "scan-aggregate",
      name: "Aggregate scan findings",
      storage: "short",
      crypto: hintToCrypto(allHints),
      tags: ["auto-from-scan"],
    });
  }

  return flows;
}

export function mergeScanIntoThreatModel(
  base: ThreatModel,
  report: ScanReport,
): ThreatModel {
  return enrichModelFromScan(base, report).model;
}

export function draftThreatModelFromScan(
  report: ScanReport,
  orgName: string,
): ThreatModel {
  const base = buildInitThreatModel({ organizationName: orgName });
  return mergeScanIntoThreatModel(base, report);
}

export function serializeDraftFromScan(
  report: ScanReport,
  orgName: string,
): string {
  const model = draftThreatModelFromScan(report, orgName);
  return serializeThreatModel(model);
}
