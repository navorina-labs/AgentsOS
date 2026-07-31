/**
 * Парсинг TLS из Kubernetes Ingress и Traefik (YAML, построчно).
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
  source: TlsConfigSource,
  snippet: string,
  protocols: string[],
  cipherRaw: string | null,
): TlsConfigRecord {
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

function traefikMinVersionToProtocols(value: string): string[] {
  const v = value.trim();
  if (/VersionTLS13|TLS13/i.test(v)) return ["TLSv1.3"];
  if (/VersionTLS12|TLS12/i.test(v)) return ["TLSv1.2"];
  if (/VersionTLS11|TLS11/i.test(v)) return ["TLSv1.1"];
  if (/VersionTLS10|TLS10|TLS1$/i.test(v)) return ["TLSv1.0"];
  return parseProtocolList(v);
}

function collectYamlListItems(lines: string[], startIndex: number): string[] {
  const items: string[] = [];
  for (let j = startIndex + 1; j < lines.length; j++) {
    const next = lines[j]!;
    if (!/^\s+-\s+/.test(next)) break;
    const item = next.replace(/^\s+-\s+/, "").replace(/['"]/g, "").trim();
    if (item) items.push(item);
  }
  return items;
}

function isKubernetesTlsFile(filePath: string): boolean {
  const base = path.basename(filePath).toLowerCase();
  if (/ingress/.test(base)) return true;
  if (/traefik/.test(base)) return true;
  if (/certificate/.test(base)) return true;
  if (/cert-manager/.test(base)) return true;
  if (/clusterissuer|issuer/.test(base)) return true;
  if (base === "values.yaml" || base === "values.yml") return true;
  return false;
}

export function parseKubernetesTlsContent(
  filePath: string,
  content: string,
): TlsConfigRecord[] {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".yaml" && ext !== ".yml") return [];

  const k8sRelated =
    isKubernetesTlsFile(filePath) ||
    /cert-manager\.io\//i.test(content) ||
    /kind:\s*(Ingress|Certificate|ClusterIssuer)/i.test(content);
  if (!k8sRelated) return [];

  recordCounter = 0;
  const records: TlsConfigRecord[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const lineNo = i + 1;

    const ingressProto = line.match(
      /nginx\.ingress\.kubernetes\.io\/ssl-protocols:\s*["']?([^"'#\n]+)/i,
    );
    if (ingressProto) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "k8s-ingress",
          line,
          parseProtocolList(ingressProto[1]!),
          null,
        ),
      );
    }

    const ingressCipher = line.match(
      /nginx\.ingress\.kubernetes\.io\/ssl-ciphers:\s*["']?([^"'#\n]+)/i,
    );
    if (ingressCipher) {
      records.push(
        buildRecord(filePath, lineNo, "k8s-ingress", line, [], ingressCipher[1]!),
      );
    }

    const albPolicy = line.match(
      /alb\.ingress\.kubernetes\.io\/ssl-policy:\s*["']?([^"'#\n]+)/i,
    );
    if (albPolicy) {
      const policy = albPolicy[1]!.toUpperCase();
      const protos: string[] = [];
      if (/TLS-1-0|TLS1_0/i.test(policy)) protos.push("TLSv1.0");
      if (/TLS-1-1|TLS1_1/i.test(policy)) protos.push("TLSv1.1");
      if (/TLS-1-2|TLS1_2/i.test(policy)) protos.push("TLSv1.2");
      if (/TLS-1-3|TLS1_3/i.test(policy)) protos.push("TLSv1.3");
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "k8s-ingress",
          line,
          protos.length > 0 ? protos : parseProtocolList(policy),
          null,
        ),
      );
    }

    const traefikMin = line.match(/minVersion:\s*(\S+)/i);
    if (traefikMin) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "traefik",
          line,
          traefikMinVersionToProtocols(traefikMin[1]!),
          null,
        ),
      );
    }

    const traefikCipherLine = line.match(/cipherSuites:\s*$/i);
    if (traefikCipherLine) {
      const suites = collectYamlListItems(lines, i);
      if (suites.length > 0) {
        records.push(
          buildRecord(
            filePath,
            lineNo,
            "traefik",
            line,
            [],
            suites.join(":"),
          ),
        );
      }
    }

    const traefikCipherInline = line.match(/cipherSuites:\s*\[([^\]]+)\]/i);
    if (traefikCipherInline) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "traefik",
          line,
          [],
          traefikCipherInline[1]!,
        ),
      );
    }

    const certMinTls = line.match(
      /(?:minTLSVersion|min_tls_version|tlsMinVersion):\s*["']?([^"'#\s#]+)/i,
    );
    if (certMinTls) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "cert-manager",
          line,
          traefikMinVersionToProtocols(certMinTls[1]!),
          null,
        ),
      );
    }

    const k8sTlsMin = line.match(
      /(?:sslProtocols|ssl-protocols|protocols):\s*["']?([^"'#\n]+)/i,
    );
    if (
      k8sTlsMin &&
      (line.includes("traefik") || /kind:\s*Ingress/i.test(lines.slice(Math.max(0, i - 15), i).join("\n")))
    ) {
      records.push(
        buildRecord(
          filePath,
          lineNo,
          "traefik",
          line,
          parseProtocolList(k8sTlsMin[1]!),
          null,
        ),
      );
    }
  }

  return records;
}
