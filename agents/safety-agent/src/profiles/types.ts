/**
 * Типы отраслевых профилей SafetyOS.
 */
import { z } from "zod";
import { DataFlowSchema, PolicySchema } from "../types/threat-model.js";

export const SecurityProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  organization_defaults: z.object({
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
  recommended_policies: z.array(PolicySchema).optional(),
  starter_flows: z.array(DataFlowSchema).optional(),
  apply_ai_governance_template: z.boolean().optional(),
});

export type SecurityProfile = z.infer<typeof SecurityProfileSchema>;
