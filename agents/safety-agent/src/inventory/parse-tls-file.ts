/**
 * Парсинг одного файла: nginx, .env, docker-compose, haproxy.
 */
import path from "node:path";
import type { TlsConfigRecord, TlsConfigSource } from "./types.js";
import {
  analyzeInferred,
  analyzeProtocols,
  inferFromCipherSuites,
  parseProtocolList,
} from "./infer-ciphers.js";
import { parseApacheTlsContent } from "./parse-apache-tls.js";
import { parseKubernetesTlsContent } from "./parse-kubernetes-tls.js";

let recordCounter = 0;

function nextId(file: string, line: number): string {
  recordCounter += 1;
  return `tls-${recordCounter}-${path.basename(file)}-${line}`;
}

function buildRecord(
  file: string,
  line: number,
  source: TlsConfigSource,
  snippet: string,
  protocols: string[],
  cipherRaw: string | null,
): TlsConfigRecord {
  const cipher_suites = cipherRaw ? [cipherRaw.trim()] : [];
  const inferred = cipherRaw
    ? inferFromCipherSuites(cipherRaw)
    : { key_exchange: [], symmetric: [], hash: [] };

  const findings = [
    ...analyzeProtocols(protocols),
    ...analyzeInferred(inferred),
  ];

  return {
    id: nextId(file, line),
    file,
    line,
    source,
    snippet: snippet.trim().slice(0, 160),
    protocols,
    cipher_suites,
    inferred,
    findings,
  };
}

export function parseTlsFileContent(
  filePath: string,
  content: string,
): TlsConfigRecord[] {
  recordCounter = 0;
  const records: TlsConfigRecord[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const lineNo = i + 1;

    const nginxProto = line.match(/ssl_protocols\s+([^;#]+)/i);
    if (nginxProto) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "nginx",
          line,
          parseProtocolList(nginxProto[1]!),
          null,
        ),
      );
    }

    const nginxCipher = line.match(/ssl_ciphers\s+([^;#]+)/i);
    if (nginxCipher) {
      records.push(
        buildRecord(filePath, lineNo, "nginx", line, [], nginxCipher[1]!),
      );
    }

    const haproxyBind = line.match(/bind\s+.*\bssl\b/i);
    const haproxyCipher = line.match(/ssl-default-bind-ciphers\s+([^\s#]+)/i);
    if (haproxyCipher) {
      records.push(
        buildRecord(filePath, lineNo, "haproxy", line, [], haproxyCipher[1]!),
      );
    } else if (haproxyBind && line.match(/tlsv1\.0|sslv3/i)) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "haproxy",
          line,
          parseProtocolList(line),
          null,
        ),
      );
    }

    const envMatchers: { re: RegExp; src: TlsConfigSource }[] = [
      { re: /\b(SSL_PROTOCOLS|TLS_MIN_VERSION|NODE_TLS_MIN_VERSION)\s*=\s*([^\s#]+)/i, src: "env" },
      { re: /\b(SSL_CIPHER_SUITE|SSL_CIPHERS|HTTPS_CIPHER)\s*=\s*([^\s#]+)/i, src: "env" },
    ];

    for (const { re, src } of envMatchers) {
      const m = line.match(re);
      if (!m) continue;
      const value = m[2]!;
      if (/TLS|SSL/i.test(m[1]!) && /VERSION|PROTOCOL/i.test(m[1]!)) {
        records.push(
          buildRecord(filePath, lineNo, src, line, parseProtocolList(value), null),
        );
      } else {
        records.push(buildRecord(filePath, lineNo, src, line, [], value));
      }
    }

    if (
      /SSL_PROTOCOLS|ssl_protocols/i.test(line) &&
      path.extname(filePath).toLowerCase() === ".yml"
    ) {
      const yamlProto = line.match(/['"]?SSL_PROTOCOLS['"]?\s*[:=]\s*['"]?([^'"]+)/i);
      if (yamlProto) {
        records.push(
          buildRecord(
            filePath,
            lineNo,
            "docker",
            line,
            parseProtocolList(yamlProto[1]!),
            null,
          ),
        );
      }
    }
  }

  records.push(...parseApacheTlsContent(filePath, content));
  records.push(...parseKubernetesTlsContent(filePath, content));
  return records;
}
