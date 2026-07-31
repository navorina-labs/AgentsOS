/**
 * Локальный цикл защиты: scan → enrich → [sync TLS] → assess → diff baseline → отчёты.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { diffAssessments } from "../engine/assess-diff.js";
import { runFullAssessment, type FullAssessment } from "../engine/assess.js";
import { enrichModelFromScan } from "../generator/enrich-from-scan.js";
import { serializeThreatModel } from "../generator/init-threat-model.js";
import type { ThreatModel } from "../types/threat-model.js";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { scanDirectory } from "../scanner/scan-directory.js";
import { inventoryTlsDirectory } from "../inventory/tls-inventory.js";
import {
  applyTlsFlowSync,
  suggestTlsFlowSync,
} from "../inventory/suggest-tls-sync.js";
import { renderDefensePlaybook } from "../export/playbook.js";
import { renderAssessHtml } from "./assess-html-report.js";
import { formatAssessDiff } from "./format-diff.js";
import { formatFullAssessment } from "./format-assess.js";

export interface CycleOptions {
  modelPath: string;
  scanDir?: string;
  tlsPath?: string;
  /** Подтянуть crypto потоков из TLS inventory перед assess */
  syncTls?: boolean;
  outDir: string;
  writeEnrichedModel?: string;
  baselinePath?: string;
  saveBaseline?: boolean;
}

export interface CycleResult {
  assessment: FullAssessment;
  enriched_flow_ids: string[];
  new_flow_ids: number;
  tls_synced_flow_ids: string[];
  diff?: ReturnType<typeof diffAssessments>;
  paths: {
    assessment: string;
    html: string;
    cbom: string;
    playbook: string;
    tls_reconcile?: string;
    enriched_model?: string;
    baseline?: string;
  };
}

export async function runDefenseCycle(
  options: CycleOptions,
): Promise<CycleResult> {
  let model: ThreatModel = await loadThreatModelFromFile(options.modelPath);
  let enrichedIds: string[] = [];
  let newFlowIds: string[] = [];
  let tlsSyncedIds: string[] = [];

  const scan = options.scanDir
    ? await scanDirectory(options.scanDir)
    : undefined;

  if (scan && scan.findings.length > 0) {
    const enriched = enrichModelFromScan(model, scan);
    model = enriched.model;
    enrichedIds = enriched.enriched_flow_ids;
    newFlowIds = enriched.new_flow_ids;
  }

  const tlsInventory = options.tlsPath
    ? await inventoryTlsDirectory(options.tlsPath)
    : undefined;

  if (options.syncTls && tlsInventory) {
    const suggestions = suggestTlsFlowSync(model, tlsInventory);
    model = applyTlsFlowSync(model, suggestions);
    tlsSyncedIds = suggestions.map((s) => s.flow_id);
  }

  const assessment = runFullAssessment(model, { scan, tlsInventory });
  const outDir = path.resolve(options.outDir);
  await mkdir(outDir, { recursive: true });

  const assessmentPath = path.join(outDir, "assessment.json");
  const htmlPath = path.join(outDir, "assessment-latest.html");
  const cbomPath = path.join(outDir, "cbom.json");
  const playbookPath = path.join(outDir, "defense-playbook.md");

  await writeFile(assessmentPath, JSON.stringify(assessment, null, 2), "utf8");
  await writeFile(htmlPath, renderAssessHtml(assessment), "utf8");
  await writeFile(cbomPath, JSON.stringify(assessment.cbom, null, 2), "utf8");
  await writeFile(playbookPath, renderDefensePlaybook(assessment), "utf8");

  let tlsReconcilePath: string | undefined;
  if (assessment.tls) {
    tlsReconcilePath = path.join(outDir, "tls-reconcile.json");
    await writeFile(
      tlsReconcilePath,
      JSON.stringify(assessment.tls.reconcile, null, 2),
      "utf8",
    );
  }

  let enrichedModelPath: string | undefined;
  if (options.writeEnrichedModel) {
    enrichedModelPath = path.resolve(options.writeEnrichedModel);
    await mkdir(path.dirname(enrichedModelPath), { recursive: true });
    await writeFile(enrichedModelPath, serializeThreatModel(model), "utf8");
  }

  const baselinePath =
    options.baselinePath ?? path.join(outDir, "baseline-assessment.json");

  let diff: ReturnType<typeof diffAssessments> | undefined;
  if (existsSync(baselinePath) && !options.saveBaseline) {
    const raw = await readFile(baselinePath, "utf8");
    const baseline = JSON.parse(raw) as FullAssessment;
    diff = diffAssessments(baseline, assessment, {
      before: "baseline",
      after: "current",
    });
    await writeFile(
      path.join(outDir, "assess-diff.json"),
      JSON.stringify(diff, null, 2),
      "utf8",
    );
    await writeFile(
      path.join(outDir, "assess-diff.txt"),
      formatAssessDiff(diff),
      "utf8",
    );
  }

  if (options.saveBaseline || !existsSync(baselinePath)) {
    await writeFile(baselinePath, JSON.stringify(assessment, null, 2), "utf8");
  }

  return {
    assessment,
    enriched_flow_ids: enrichedIds,
    new_flow_ids: newFlowIds.length,
    tls_synced_flow_ids: tlsSyncedIds,
    diff,
    paths: {
      assessment: assessmentPath,
      html: htmlPath,
      cbom: cbomPath,
      playbook: playbookPath,
      tls_reconcile: tlsReconcilePath,
      enriched_model: enrichedModelPath,
      baseline: baselinePath,
    },
  };
}

export function formatCycleSummary(result: CycleResult): string {
  const lines = [
    formatFullAssessment(result.assessment),
    "",
    `Обогащено потоков из scan: ${result.enriched_flow_ids.length}`,
    `Новых scan-потоков: ${result.new_flow_ids}`,
    `TLS sync потоков: ${result.tls_synced_flow_ids.length}`,
    `HTML: ${result.paths.html}`,
    `CBOM: ${result.paths.cbom}`,
    `Playbook: ${result.paths.playbook}`,
  ];
  if (result.paths.tls_reconcile) {
    lines.push(`TLS reconcile: ${result.paths.tls_reconcile}`);
  }
  if (result.diff) {
    lines.push("", formatAssessDiff(result.diff));
  }
  return lines.join("\n");
}
