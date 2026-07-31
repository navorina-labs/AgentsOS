/**
 * Парсинг Apache httpd SSL* директив.
 */
import path from "node:path";
import type { TlsConfigRecord, TlsConfigSource } from "./types.js";
import {
  analyzeInferred,
  analyzeProtocols,
  inferFromCipherSuites,
  parseProtocolList,
} from "./infer-ciphers.js";

let recordCounter = 0;

function nextId(file: string, line: number): string {
  recordCounter += 1;
  return `tls-${recordCounter}-${path.basename(file)}-${line}`;
}

function buildRecord(
  file: string,
  line: number,
  snippet: string,
  protocols: string[],
  cipherRaw: string | null,
): TlsConfigRecord {
  const source: TlsConfigSource = "apache";
  const inferred = cipherRaw
    ? inferFromCipherSuites(cipherRaw)
    : { key_exchange: [], symmetric: [], hash: [] };
  return {
    id: nextId(file, line),
    file,
    line,
    source,
    snippet: snippet.trim().slice(0, 160),
    protocols,
    cipher_suites: cipherRaw ? [cipherRaw.trim()] : [],
    inferred,
    findings: [
      ...analyzeProtocols(protocols),
      ...analyzeInferred(inferred),
    ],
  };
}

function isApacheTlsFile(filePath: string): boolean {
  const base = path.basename(filePath).toLowerCase();
  return (
    base.includes("apache") ||
    base.endsWith(".vhost") ||
    /httpd.*\.conf$/i.test(base) ||
    /apache.*\.conf$/i.test(base)
  );
}

export function parseApacheTlsContent(
  filePath: string,
  content: string,
): TlsConfigRecord[] {
  if (!isApacheTlsFile(filePath) && !content.match(/\bSSL(?:Protocol|Cipher)/i)) {
    return [];
  }

  recordCounter = 0;
  const records: TlsConfigRecord[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const lineNo = i + 1;

    const sslProto = line.match(/^\s*SSLProtocol\s+(.+)$/i);
    if (sslProto) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          line,
          parseProtocolList(sslProto[1]!),
          null,
        ),
      );
    }

    const sslCipher = line.match(/^\s*SSLCipherSuite\s+(.+)$/i);
    if (sslCipher) {
      records.push(
        buildRecord(filePath, lineNo, line, [], sslCipher[1]!),
      );
    }

    const sslProxyProto = line.match(/^\s*SSLProxyProtocol\s+(.+)$/i);
    if (sslProxyProto) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          line,
          parseProtocolList(sslProxyProto[1]!),
          null,
        ),
      );
    }

    const sslProxyCipher = line.match(/^\s*SSLProxyCipherSuite\s+(.+)$/i);
    if (sslProxyCipher) {
      records.push(
        buildRecord(filePath, lineNo, line, [], sslProxyCipher[1]!),
      );
    }
  }

  return records;
}
