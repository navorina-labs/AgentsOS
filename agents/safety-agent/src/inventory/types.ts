/**
 * TLS inventory — типы для парсинга конфигов транспорта.
 */
export type TlsConfigSource =
  | "nginx"
  | "apache"
  | "env"
  | "docker"
  | "haproxy"
  | "traefik"
  | "k8s-ingress"
  | "cert-manager"
  | "generic";

export interface TlsConfigFinding {
  severity: "critical" | "warning" | "info";
  code: string;
  message: string;
}

export interface TlsConfigRecord {
  id: string;
  file: string;
  line: number;
  source: TlsConfigSource;
  snippet: string;
  protocols: string[];
  cipher_suites: string[];
  inferred: {
    key_exchange: string[];
    symmetric: string[];
    hash: string[];
  };
  findings: TlsConfigFinding[];
}

export interface TlsInventoryReport {
  root: string;
  files_scanned: number;
  records: TlsConfigRecord[];
  summary: {
    weak_protocols: number;
    records_with_issues: number;
    inferred_kex: string[];
  };
}

export interface TlsDriftItem {
  kind: "weak_in_config" | "model_config_mismatch" | "undocumented_endpoint";
  severity: "critical" | "warning" | "info";
  message: string;
  flow_id?: string;
  file?: string;
}

export interface TlsReconcileMatch {
  record_id: string;
  flow_id: string;
  file: string;
}

export interface TlsReconcileReport {
  inventory_records: number;
  tls_flows_in_model: number;
  drifts: TlsDriftItem[];
  matched?: TlsReconcileMatch[];
  unmatched_flow_ids?: string[];
}
