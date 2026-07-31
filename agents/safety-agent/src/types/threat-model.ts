/**
 * Zod-схемы Threat Model DSL (синхрон с schemas/threat-model.schema.json).
 */
import { z } from "zod";
import {
  AiGovernanceSchema,
  FlowAiContextSchema,
} from "./ai-governance.js";

export const StorageTierSchema = z.enum([
  "ephemeral",
  "short",
  "long",
  "permanent",
]);

export const CryptoBlockSchema = z.object({
  key_exchange: z.array(z.string()).default([]),
  signatures: z.array(z.string()).default([]),
  symmetric: z.array(z.string()).default([]),
  hash: z.array(z.string()).default([]),
});

export const DataFlowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  confidentiality_years: z.number().min(0).optional(),
  storage: StorageTierSchema,
  hndl_exposed: z.boolean().optional(),
  crypto: CryptoBlockSchema,
  tags: z.array(z.string()).optional(),
  /** Привязка потока к каналам языка ИИ (IFF). */
  ai_context: FlowAiContextSchema.optional(),
});

export const PolicyWhenSchema = z.object({
  retention_tier: StorageTierSchema.optional(),
  has_algorithm: z.string().optional(),
});

export const PolicySchema = z.object({
  id: z.string().min(1),
  when: PolicyWhenSchema,
  action: z.enum(["block", "warn", "recommend"]),
  recommend: z
    .object({
      key_exchange: z.string().optional(),
      hybrid_with: z.string().optional(),
    })
    .optional(),
});

export const ThreatModelSchema = z.object({
  version: z.literal("1"),
  organization: z.object({
    name: z.string().min(1),
    migration_years: z.number().min(0),
    quantum_horizon_years: z.number().min(0),
  }),
  adversary: z.object({
    classical: z.boolean(),
    quantum_record: z.boolean(),
    ai_implementation: z.boolean(),
  }),
  defaults: z
    .object({
      confidentiality_years: z.number().min(0),
    })
    .optional(),
  data_flows: z.array(DataFlowSchema).min(1),
  policies: z.array(PolicySchema).optional(),
  /** Свой/чужой + каналы языка ИИ (при adversary.ai_implementation). */
  ai_governance: AiGovernanceSchema.optional(),
});

export type StorageTier = z.infer<typeof StorageTierSchema>;
export type CryptoBlock = z.infer<typeof CryptoBlockSchema>;
export type DataFlow = z.infer<typeof DataFlowSchema>;
export type Policy = z.infer<typeof PolicySchema>;
export type ThreatModel = z.infer<typeof ThreatModelSchema>;

export type RiskTier = "critical" | "high" | "medium" | "low";

export interface FlowFinding {
  code: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

export interface FlowAnalysis {
  id: string;
  name: string;
  confidentiality_years: number;
  score: number;
  tier: RiskTier;
  mosca_flow_at_risk: boolean;
  findings: FlowFinding[];
  recommendations: string[];
  policy_violations: string[];
}

export interface AnalyzeReport {
  organization: string;
  mosca: {
    at_risk: boolean;
    margin_years: number;
    x_max_years: number;
    y_migration_years: number;
    z_horizon_years: number;
  };
  adversary: ThreatModel["adversary"];
  flows: FlowAnalysis[];
  summary: {
    total_flows: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    policy_blocks: number;
  };
}
