/**
 * Контекст scan: каталоги детекторов vs прикладной код.
 */
import path from "node:path";
import type { ScanFinding } from "./scan-directory.js";

/** Паттерны, срабатывающие на имена алгоритмов в метаданных/детекторах. */
const CATALOG_ONLY_PATTERN_IDS = new Set([
  "md5",
  "sha1",
  "rsa-string",
  "ecdsa",
  "ecdh",
  "aes128",
  "ml-kem",
  "deprecated-crypto-lib",
  "custom-crypto",
  "sslv3",
  "tls10",
]);

const CATALOG_PATH_MARKERS = [
  "registry/",
  "assurance/",
  "inventory/",
  "scanner/",
];

export function isCatalogContextPath(relativePath: string): boolean {
  const rel = relativePath.replace(/\\/g, "/");
  if (rel === "scanner/scan-context.ts" || rel.endsWith("/scan-context.ts")) {
    return true;
  }
  return CATALOG_PATH_MARKERS.some(
    (m) => rel.startsWith(m) || rel.includes(`/${m}`),
  );
}

export function shouldSkipPatternInFile(
  relativePath: string,
  patternId: string,
): boolean {
  if (!CATALOG_ONLY_PATTERN_IDS.has(patternId)) return false;
  return isCatalogContextPath(relativePath);
}

export function isDetectorCatalogFinding(
  finding: ScanFinding,
  scanRoot: string,
): boolean {
  const rel = path.relative(scanRoot, finding.file).replace(/\\/g, "/");
  return shouldSkipPatternInFile(rel, finding.pattern_id);
}

export function applicationCriticalFindings(
  findings: ScanFinding[],
  scanRoot: string,
): ScanFinding[] {
  return findings.filter(
    (f) => f.severity === "critical" && !isDetectorCatalogFinding(f, scanRoot),
  );
}
