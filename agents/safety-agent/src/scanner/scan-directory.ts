/**
 * Рекурсивное сканирование директории на криптографические паттерны.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { SCAN_EXTENSIONS, SCAN_PATTERNS, type ScanSeverity } from "./patterns.js";
import { shouldSkipPatternInFile } from "./scan-context.js";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "e2e",
]);

/** Мета-файлы SafetyOS (определения паттернов, не прикладной код). */
const SKIP_FILE_NAMES = new Set([
  "patterns.ts",
  "algorithms.ts",
  "scan-context.ts",
]);

function shouldSkipFile(relativePath: string): boolean {
  if (relativePath.endsWith(".test.ts")) return true;
  const base = relativePath.split("/").pop() ?? relativePath;
  if (SKIP_FILE_NAMES.has(base)) return true;
  return false;
}

export interface ScanFinding {
  file: string;
  line: number;
  column: number;
  pattern_id: string;
  severity: ScanSeverity;
  message: string;
  snippet: string;
  algorithm_hint?: string;
}

export interface ScanReport {
  root: string;
  files_scanned: number;
  findings: ScanFinding[];
}

async function walkFiles(dir: string, root: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walkFiles(full, root)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SCAN_EXTENSIONS.has(ext)) continue;
      const rel = path.relative(root, full);
      if (shouldSkipFile(rel)) continue;
      files.push(full);
    }
  }

  return files;
}

function scanFileContent(
  filePath: string,
  content: string,
  relativePath: string,
): ScanFinding[] {
  const lines = content.split("\n");
  const findings: ScanFinding[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    for (const pattern of SCAN_PATTERNS) {
      if (shouldSkipPatternInFile(relativePath, pattern.id)) continue;
      const match = pattern.regex.exec(line);
      if (!match) continue;

      findings.push({
        file: filePath,
        line: i + 1,
        column: (match.index ?? 0) + 1,
        pattern_id: pattern.id,
        severity: pattern.severity,
        message: pattern.message,
        snippet: line.trim().slice(0, 120),
        algorithm_hint: pattern.algorithm_hint,
      });
    }
  }

  return findings;
}

export async function scanDirectory(rootPath: string): Promise<ScanReport> {
  const root = path.resolve(rootPath);
  const st = await stat(root);
  if (!st.isDirectory()) {
    throw new Error(`Not a directory: ${root}`);
  }

  const files = await walkFiles(root, root);
  const findings: ScanFinding[] = [];

  for (const file of files) {
    const rel = path.relative(root, file);
    const content = await readFile(file, "utf8");
    findings.push(...scanFileContent(file, content, rel));
  }

  findings.sort((a, b) => {
    const sev = severityRank(b.severity) - severityRank(a.severity);
    if (sev !== 0) return sev;
    return a.file.localeCompare(b.file) || a.line - b.line;
  });

  return {
    root,
    files_scanned: files.length,
    findings,
  };
}

function severityRank(s: ScanSeverity): number {
  switch (s) {
    case "critical":
      return 3;
    case "warning":
      return 2;
    case "info":
      return 1;
  }
}
