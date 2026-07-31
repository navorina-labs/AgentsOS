/**
 * Шаблон threat-model.yaml для нового проекта.
 */
import { stringify } from "yaml";
import { DEFAULT_AI_GOVERNANCE } from "../registry/ai-governance-defaults.js";
import type { ThreatModel } from "../types/threat-model.js";

export interface InitOptions {
  organizationName: string;
  migrationYears?: number;
  quantumHorizonYears?: number;
  confidentialityYears?: number;
}

export function buildInitThreatModel(opts: InitOptions): ThreatModel {
  return {
    version: "1",
    organization: {
      name: opts.organizationName,
      migration_years: opts.migrationYears ?? 3,
      quantum_horizon_years: opts.quantumHorizonYears ?? 10,
    },
    adversary: {
      classical: true,
      quantum_record: true,
      ai_implementation: true,
    },
    defaults: {
      confidentiality_years: opts.confidentialityYears ?? 7,
    },
    data_flows: [
      {
        id: "public-api-tls",
        name: "Public API / TLS",
        storage: "ephemeral",
        hndl_exposed: true,
        crypto: {
          key_exchange: ["ECDHE-P256"],
          signatures: [],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        tags: ["edge", "tls", "todo-review"],
      },
      {
        id: "data-at-rest",
        name: "Databases / object storage",
        storage: "long",
        hndl_exposed: false,
        crypto: {
          key_exchange: ["RSA-2048"],
          signatures: [],
          symmetric: ["AES-256-GCM"],
          hash: ["SHA-256"],
        },
        tags: ["at-rest", "todo-review"],
      },
    ],
    policies: [
      {
        id: "no-rsa-long-retention",
        when: { retention_tier: "long", has_algorithm: "RSA-2048" },
        action: "block",
        recommend: { key_exchange: "ML-KEM-768", hybrid_with: "X25519" },
      },
    ],
    ai_governance: DEFAULT_AI_GOVERNANCE,
  };
}

export function serializeThreatModel(model: ThreatModel): string {
  const header = `# SafetyOS threat model — сгенерировано safetyos init
# Документация: docs/02-threat-model.md

`;
  return header + stringify(model, { lineWidth: 0 });
}
