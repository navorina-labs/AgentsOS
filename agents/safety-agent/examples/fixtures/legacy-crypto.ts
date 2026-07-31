// Fixture: намеренно слабые паттерны для safetyos scan
import { createHash } from "node:crypto";

const LEGACY = {
  kex: "RSA-2048",
  sign: "ECDSA-P256",
};

export function weakDigest(data: string): string {
  return createHash("md5").update(data).digest("hex");
}

export const PRIVATE_KEY_PEM = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAexample
-----END RSA PRIVATE KEY-----`;

export { LEGACY };
