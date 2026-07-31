/**
 * Паттерны слабой/уязвимой криптографии в исходниках и конфигах.
 */
export type ScanSeverity = "critical" | "warning" | "info";

export interface ScanPattern {
  id: string;
  regex: RegExp;
  severity: ScanSeverity;
  message: string;
  algorithm_hint?: string;
}

export const SCAN_PATTERNS: ScanPattern[] = [
  {
    id: "rsa-key-pem",
    regex: /BEGIN RSA PRIVATE KEY/i,
    severity: "critical",
    message: "RSA private key в исходниках",
    algorithm_hint: "RSA",
  },
  {
    id: "rsa-string",
    regex: /\bRSA-?(1024|2048|4096)\b/i,
    severity: "warning",
    message: "Упоминание RSA key size",
    algorithm_hint: "RSA-2048",
  },
  {
    id: "ecdsa",
    regex: /\bECDSA\b/i,
    severity: "warning",
    message: "ECDSA (квантово уязвим для долгоживущих ключей)",
    algorithm_hint: "ECDSA",
  },
  {
    id: "ecdh",
    regex: /\bECDHE?(-P256|-P384)?\b/i,
    severity: "warning",
    message: "ECDH/ECDHE key exchange",
    algorithm_hint: "ECDHE-P256",
  },
  {
    id: "md5",
    regex: /\bmd5\b|createHash\s*\(\s*['"]md5['"]\s*\)/i,
    severity: "critical",
    message: "MD5",
    algorithm_hint: "MD5",
  },
  {
    id: "sha1",
    regex: /\bsha-?1\b|createHash\s*\(\s*['"]sha1['"]\s*\)/i,
    severity: "critical",
    message: "SHA-1",
    algorithm_hint: "SHA-1",
  },
  {
    id: "des",
    regex: /\b3DES\b|\bDES\b/i,
    severity: "critical",
    message: "DES/3DES",
    algorithm_hint: "DES",
  },
  {
    id: "aes128",
    regex: /\bAES-?128\b/i,
    severity: "info",
    message: "AES-128 (при долгом retention рассмотреть AES-256)",
    algorithm_hint: "AES-128",
  },
  {
    id: "ml-kem",
    regex: /\bML-KEM/i,
    severity: "info",
    message: "PQC ML-KEM обнаружен",
    algorithm_hint: "ML-KEM-768",
  },
  {
    id: "openssh-private",
    regex: /BEGIN OPENSSH PRIVATE KEY/i,
    severity: "critical",
    message: "OpenSSH private key в исходниках",
    algorithm_hint: "RSA",
  },
  {
    id: "ec-private",
    regex: /BEGIN EC PRIVATE KEY/i,
    severity: "critical",
    message: "EC private key в исходниках",
  },
  {
    id: "aws-access-key",
    regex: /AKIA[0-9A-Z]{16}/,
    severity: "critical",
    message: "Возможный AWS Access Key ID",
  },
  {
    id: "generic-api-key",
    regex: /(?:api[_-]?key|secret[_-]?key)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i,
    severity: "warning",
    message: "Захардкоженный API/secret key",
  },
  {
    id: "tls10",
    regex: /\bTLSv1\.0\b|\bTLSv1\b(?!\.)/i,
    severity: "warning",
    message: "Устаревший TLS 1.0",
  },
  {
    id: "sslv3",
    regex: /\bSSLv3\b/i,
    severity: "critical",
    message: "SSLv3 отключён (POODLE)",
  },
  {
    id: "openai-api-key",
    regex: /sk-proj-[a-zA-Z0-9_-]{20,}|OPENAI_API_KEY\s*=\s*['"]?sk-/i,
    severity: "critical",
    message: "OpenAI API key в коде/конфиге",
  },
  {
    id: "anthropic-api-key",
    regex: /sk-ant-[a-zA-Z0-9_-]{20,}|ANTHROPIC_API_KEY\s*=/i,
    severity: "critical",
    message: "Anthropic API key",
  },
  {
    id: "huggingface-token",
    regex: /hf_[a-zA-Z0-9]{30,}|HUGGINGFACE(?:_HUB)?_TOKEN\s*=/i,
    severity: "critical",
    message: "Hugging Face token",
  },
  {
    id: "custom-crypto",
    regex: /createCipher\s*\(\s*['"]aes/i,
    severity: "warning",
    message: "Устаревший createCipher без AEAD (типично для ИИ-кода)",
  },
  {
    id: "deprecated-crypto-lib",
    regex: /\bnode-forge\b|\bcrypto-js\b.*\bMD5\b/i,
    severity: "warning",
    message: "Устаревшая crypto-библиотека",
  },
];

export const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".go",
  ".java",
  ".rs",
  ".yaml",
  ".yml",
  ".json",
  ".env",
  ".toml",
  ".conf",
  ".cfg",
]);
