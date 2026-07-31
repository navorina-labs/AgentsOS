/**
 * NIST PQC migration mapping (FIPS 203/204) — классика → PQC замена.
 */
export interface NistMigrationPath {
  classical: string;
  pqc_replacement: string;
  role: "key_exchange" | "signature" | "hash";
  nist_ref: string;
  hybrid_transition?: string;
}

export const NIST_MIGRATION_TABLE: NistMigrationPath[] = [
  {
    classical: "RSA-2048",
    pqc_replacement: "ML-KEM-768",
    role: "key_exchange",
    nist_ref: "FIPS 203 (ML-KEM)",
    hybrid_transition: "X25519 + ML-KEM-768",
  },
  {
    classical: "RSA-4096",
    pqc_replacement: "ML-KEM-1024",
    role: "key_exchange",
    nist_ref: "FIPS 203 (ML-KEM)",
    hybrid_transition: "X25519 + ML-KEM-1024",
  },
  {
    classical: "ECDHE-P256",
    pqc_replacement: "ML-KEM-768",
    role: "key_exchange",
    nist_ref: "FIPS 203 (ML-KEM)",
    hybrid_transition: "ECDHE-P256 + ML-KEM-768",
  },
  {
    classical: "ECDH-P256",
    pqc_replacement: "ML-KEM-768",
    role: "key_exchange",
    nist_ref: "FIPS 203 (ML-KEM)",
  },
  {
    classical: "ECDSA-P256",
    pqc_replacement: "ML-DSA-65",
    role: "signature",
    nist_ref: "FIPS 204 (ML-DSA)",
  },
  {
    classical: "SHA-1",
    pqc_replacement: "SHA-256",
    role: "hash",
    nist_ref: "NIST SP 800-131A (deprecated SHA-1)",
  },
  {
    classical: "MD5",
    pqc_replacement: "SHA-256",
    role: "hash",
    nist_ref: "RFC 6151 (MD5 deprecated)",
  },
];

export function findMigrationPath(
  algorithm: string,
): NistMigrationPath | undefined {
  const norm = algorithm.trim().toUpperCase();
  return NIST_MIGRATION_TABLE.find(
    (p) =>
      p.classical.toUpperCase() === norm ||
      norm.includes(p.classical.toUpperCase()),
  );
}

export function matchMigrationForAlgorithms(
  algorithms: string[],
): NistMigrationPath[] {
  const seen = new Set<string>();
  const paths: NistMigrationPath[] = [];
  for (const algo of algorithms) {
    const path = findMigrationPath(algo);
    if (path && !seen.has(path.classical)) {
      seen.add(path.classical);
      paths.push(path);
    }
  }
  return paths;
}
