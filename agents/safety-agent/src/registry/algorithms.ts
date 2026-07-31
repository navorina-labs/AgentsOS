/**
 * Классификация криptoалгоритмов для risk engine.
 */
export type AlgorithmClass =
  | "pqc"
  | "quantum_vulnerable"
  | "symmetric_safe"
  | "weak"
  | "unknown";

export interface ClassifiedAlgorithm {
  raw: string;
  normalized: string;
  class: AlgorithmClass;
}

const WEAK_PATTERNS: RegExp[] = [
  /^MD5$/i,
  /^SHA-?1$/i,
  /^DES$/i,
  /^3DES$/i,
  /^RC4$/i,
  /RSA-1024/i,
  /RSA-512/i,
];

const PQC_PATTERNS: RegExp[] = [
  /^ML-KEM/i,
  /^ML-DSA/i,
  /^SLH-DSA/i,
  /^FN-DSA/i,
  /^FALCON/i,
  /^KYBER/i,
  /^DILITHIUM/i,
];

const QUANTUM_VULN_PATTERNS: RegExp[] = [
  /^RSA/i,
  /^DSA$/i,
  /^DH$/i,
  /^ECDH/i,
  /^ECDHE/i,
  /^ECDSA/i,
  /^Ed25519$/i,
  /^Ed448$/i,
];

const SYMMETRIC_SAFE_PATTERNS: RegExp[] = [
  /^AES-256/i,
  /^AES256/i,
  /^ChaCha20/i,
  /^CHACHA20/i,
];

export function normalizeAlgorithmName(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

export function classifyAlgorithm(name: string): ClassifiedAlgorithm {
  const normalized = normalizeAlgorithmName(name);
  const raw = name;

  if (WEAK_PATTERNS.some((p) => p.test(normalized))) {
    return { raw, normalized, class: "weak" };
  }
  if (PQC_PATTERNS.some((p) => p.test(normalized))) {
    return { raw, normalized, class: "pqc" };
  }
  if (QUANTUM_VULN_PATTERNS.some((p) => p.test(normalized))) {
    return { raw, normalized, class: "quantum_vulnerable" };
  }
  if (SYMMETRIC_SAFE_PATTERNS.some((p) => p.test(normalized))) {
    return { raw, normalized, class: "symmetric_safe" };
  }
  if (/^SHA-(256|384|512)$/i.test(normalized)) {
    return { raw, normalized, class: "symmetric_safe" };
  }
  if (/^AES-128/i.test(normalized)) {
    return { raw, normalized, class: "unknown" };
  }

  return { raw, normalized, class: "unknown" };
}

export function classifyAll(names: string[]): ClassifiedAlgorithm[] {
  return names.map(classifyAlgorithm);
}

export function collectFromCrypto(crypto: {
  key_exchange?: string[];
  signatures?: string[];
  symmetric?: string[];
  hash?: string[];
}): ClassifiedAlgorithm[] {
  const all = [
    ...(crypto.key_exchange ?? []),
    ...(crypto.signatures ?? []),
    ...(crypto.symmetric ?? []),
    ...(crypto.hash ?? []),
  ];
  return classifyAll(all);
}

export function hasClass(
  items: ClassifiedAlgorithm[],
  cls: AlgorithmClass,
): boolean {
  return items.some((i) => i.class === cls);
}
