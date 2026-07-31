/**
 * Рекурсивный TLS inventory по конфигам деплоя.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parseTlsFileContent } from "./parse-tls-file.js";
import type { TlsInventoryReport, TlsConfigRecord } from "./types.js";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  "reports",
]);

const TLS_FILE_PATTERNS: RegExp[] = [
  /\.conf$/i,
  /\.env$/i,
  /\.env\./i,
  /docker-compose\.ya?ml$/i,
  /compose\.ya?ml$/i,
  /nginx.*\.conf$/i,
  /apache.*\.conf$/i,
  /httpd.*\.conf$/i,
  /\.vhost$/i,
  /haproxy\.cfg$/i,
  /certificate.*\.ya?ml$/i,
  /traefik\.ya?ml$/i,
  /\.ingress\.ya?ml$/i,
  /ingress\.ya?ml$/i,
  /values\.ya?ml$/i,
];

function isTlsConfigFile(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower === ".env" || lower.startsWith(".env.")) return true;
  return TLS_FILE_PATTERNS.some((p) => p.test(name));
}

async function walkTlsFiles(dir: string, root: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walkTlsFiles(full, root)));
    } else if (entry.isFile() && isTlsConfigFile(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function summarize(records: TlsConfigRecord[]): TlsInventoryReport["summary"] {
  const kex = new Set<string>();
  let weak_protocols = 0;
  let records_with_issues = 0;

  for (const r of records) {
    for (const k of r.inferred.key_exchange) kex.add(k);
    const critical = r.findings.filter((f) => f.severity === "critical");
    if (critical.some((f) => f.code === "WEAK_TLS_PROTOCOL")) {
      weak_protocols += 1;
    }
    if (r.findings.some((f) => f.severity === "critical" || f.severity === "warning")) {
      records_with_issues += 1;
    }
  }

  return {
    weak_protocols,
    records_with_issues,
    inferred_kex: [...kex].sort(),
  };
}

export async function inventoryTlsDirectory(
  rootPath: string,
): Promise<TlsInventoryReport> {
  const root = path.resolve(rootPath);
  const st = await stat(root);
  if (!st.isDirectory()) {
    const content = await readFile(root, "utf8");
    const records = parseTlsFileContent(root, content);
    return {
      root,
      files_scanned: 1,
      records,
      summary: summarize(records),
    };
  }

  const files = await walkTlsFiles(root, root);
  const records: TlsConfigRecord[] = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    records.push(...parseTlsFileContent(file, content));
  }

  records.sort((a, b) => {
    const sev = severityRank(b) - severityRank(a);
    if (sev !== 0) return sev;
    return a.file.localeCompare(b.file) || a.line - b.line;
  });

  return {
    root,
    files_scanned: files.length,
    records,
    summary: summarize(records),
  };
}

function severityRank(r: TlsConfigRecord): number {
  if (r.findings.some((f) => f.severity === "critical")) return 3;
  if (r.findings.some((f) => f.severity === "warning")) return 2;
  return 1;
}
