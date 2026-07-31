/**
 * Локальный запуск opa test на сгенерированном bundle.
 */
import { spawnSync } from "node:child_process";
import { loadThreatModelFromFile } from "../parser/load-threat-model.js";
import { writeOpaTestBundle } from "../export/opa-test-bundle.js";

export interface OpaTestResult {
  ran: boolean;
  ok: boolean;
  skipped_reason?: string;
  bundle_dir: string;
  stdout: string;
  stderr: string;
}

export async function runOpaPolicyTest(
  modelPath: string,
  outDir: string,
): Promise<OpaTestResult> {
  const model = await loadThreatModelFromFile(modelPath);
  const { dir } = await writeOpaTestBundle(model, outDir);

  const which = spawnSync("which", ["opa"], { encoding: "utf8" });
  if (which.status !== 0) {
    return {
      ran: false,
      ok: true,
      skipped_reason: "opa CLI не установлен (brew install opa)",
      bundle_dir: dir,
      stdout: "",
      stderr: "",
    };
  }

  const test = spawnSync("opa", ["test", dir, "--verbose"], {
    encoding: "utf8",
  });

  return {
    ran: true,
    ok: test.status === 0,
    bundle_dir: dir,
    stdout: test.stdout ?? "",
    stderr: test.stderr ?? "",
  };
}
