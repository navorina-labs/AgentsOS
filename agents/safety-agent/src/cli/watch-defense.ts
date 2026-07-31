/**
 * Локальный watch: пересчёт assess при изменении threat model.
 */
import { watch } from "node:fs";
import path from "node:path";
import { runDefenseCycle, formatCycleSummary } from "./run-cycle.js";

export interface WatchOptions {
  modelPath: string;
  scanDir?: string;
  tlsPath?: string;
  syncTls?: boolean;
  outDir: string;
  debounceMs?: number;
}

export function startDefenseWatch(options: WatchOptions): void {
  const debounceMs = options.debounceMs ?? 600;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  const run = async () => {
    if (running) return;
    running = true;
    try {
      const result = await runDefenseCycle({
        modelPath: options.modelPath,
        scanDir: options.scanDir,
        tlsPath: options.tlsPath,
        syncTls: options.syncTls,
        outDir: options.outDir,
      });
      const stamp = new Date().toISOString();
      console.log(`\n── ${stamp} ──`);
      console.log(formatCycleSummary(result));
    } catch (e) {
      console.error(e instanceof Error ? e.message : String(e));
    } finally {
      running = false;
    }
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void run();
    }, debounceMs);
  };

  const modelAbs = path.resolve(options.modelPath);
  console.log(`Watch: ${modelAbs}`);
  if (options.scanDir) console.log(`Scan:  ${path.resolve(options.scanDir)}`);
  console.log(`Out:   ${path.resolve(options.outDir)}`);
  console.log("Ctrl+C для выхода\n");

  watch(modelAbs, schedule);
  void run();
}
