/**
 * Вывод алгоритмов из openssl/nginx cipher suite строк.
 */
const WEAK_PROTOCOLS = new Set(["SSLv2", "SSLv3", "TLSv1", "TLSv1.0", "TLSv1.1"]);

export function normalizeProtocol(token: string): string {
  const t = token.trim().toUpperCase();
  const map: Record<string, string> = {
    TLSV1: "TLSv1.0",
    TLS1: "TLSv1.0",
    TLSV1_0: "TLSv1.0",
    TLSV1_1: "TLSv1.1",
    TLSV1_2: "TLSv1.2",
    TLSV1_3: "TLSv1.3",
    TLS1_0: "TLSv1.0",
    TLS1_1: "TLSv1.1",
    TLS1_2: "TLSv1.2",
    TLS1_3: "TLSv1.3",
    SSLV3: "SSLv3",
    SSLV2: "SSLv2",
  };
  if (map[t]) return map[t];
  if (/^TLSV1\.0$/i.test(token)) return "TLSv1.0";
  if (/^TLSV1\.1$/i.test(token)) return "TLSv1.1";
  if (/^TLSV1\.2$/i.test(token)) return "TLSv1.2";
  if (/^TLSV1\.3$/i.test(token)) return "TLSv1.3";
  return token.trim();
}

export function parseProtocolList(raw: string): string[] {
  return raw
    .split(/\s+/)
    .map((p) => p.replace(/;/g, ""))
    .filter(Boolean)
    .map(normalizeProtocol);
}

export function isWeakProtocol(proto: string): boolean {
  return WEAK_PROTOCOLS.has(proto) || /^TLSv1\.0?$/i.test(proto) || /^TLSv1\.1$/i.test(proto);
}

export function inferFromCipherSuites(cipherRaw: string): {
  key_exchange: string[];
  symmetric: string[];
  hash: string[];
} {
  const key_exchange = new Set<string>();
  const symmetric = new Set<string>();
  const hash = new Set<string>();

  const tokens = cipherRaw
    .split(":")
    .flatMap((part) => part.split(/[\s,]+/))
    .map((t) => t.trim())
    .filter((t) => t && !t.startsWith("!") && !t.startsWith("-"));

  for (const token of tokens) {
    const u = token.toUpperCase();
    if (/ECDHE?/i.test(token)) {
      if (/ECDSA/i.test(token)) key_exchange.add("ECDHE-ECDSA");
      else if (/RSA/i.test(token)) key_exchange.add("ECDHE-RSA");
      else key_exchange.add("ECDHE-P256");
    }
    if (/^DHE-/i.test(token) || /DHE-RSA/i.test(token)) {
      key_exchange.add("DHE-RSA");
    }
    if (/^RSA\b/i.test(token) || /-RSA-/i.test(token)) {
      key_exchange.add("RSA-2048");
    }
    if (/AES-256-GCM|AES256-GCM/i.test(u)) symmetric.add("AES-256-GCM");
    if (/AES-128-GCM|AES128-GCM/i.test(u)) symmetric.add("AES-128-GCM");
    if (/CHACHA20/i.test(u)) symmetric.add("ChaCha20-Poly1305");
    if (/SHA256|SHA-256/i.test(u)) hash.add("SHA-256");
    if (/SHA384|SHA-384/i.test(u)) hash.add("SHA-384");
    if (/MD5/i.test(u)) hash.add("MD5");
  }

  return {
    key_exchange: [...key_exchange],
    symmetric: [...symmetric],
    hash: [...hash],
  };
}

export function analyzeProtocols(protocols: string[]): TlsConfigFindingLite[] {
  const findings: TlsConfigFindingLite[] = [];
  for (const p of protocols) {
    if (isWeakProtocol(p)) {
      findings.push({
        severity: "critical",
        code: "WEAK_TLS_PROTOCOL",
        message: `Устаревший протокол: ${p}`,
      });
    }
  }
  if (protocols.length > 0 && !protocols.some((p) => /TLSv1\.3/i.test(p))) {
    findings.push({
      severity: "info",
      code: "NO_TLS13",
      message: "TLS 1.3 не указан — рассмотреть включение",
    });
  }
  return findings;
}

export interface TlsConfigFindingLite {
  severity: "critical" | "warning" | "info";
  code: string;
  message: string;
}

export function analyzeInferred(inferred: {
  key_exchange: string[];
  symmetric: string[];
  hash: string[];
}): TlsConfigFindingLite[] {
  const findings: TlsConfigFindingLite[] = [];
  if (inferred.hash.includes("MD5")) {
    findings.push({
      severity: "critical",
      code: "CIPHER_MD5",
      message: "Cipher suite содержит MD5",
    });
  }
  if (inferred.symmetric.includes("AES-128-GCM") && !inferred.symmetric.includes("AES-256-GCM")) {
    findings.push({
      severity: "warning",
      code: "AES128_ONLY",
      message: "Только AES-128-GCM в cipher list",
    });
  }
  if (
    inferred.key_exchange.length > 0 &&
    !inferred.key_exchange.some((k) => /ML-KEM|KYBER/i.test(k))
  ) {
    findings.push({
      severity: "info",
      code: "NO_PQC_IN_TLS",
      message: "В конфиге нет PQC/hybrid (ожидаемо до внедрения на edge)",
    });
  }
  return findings;
}
