/**
 * Наложение отраслевого профиля на threat model.
 */
import { DEFAULT_AI_GOVERNANCE } from "../registry/ai-governance-defaults.js";
import type { Policy, ThreatModel } from "../types/threat-model.js";
import type { SecurityProfile } from "./types.js";
import { mergeStarterFlows } from "./merge-flows.js";

export interface ApplyProfileOptions {
  mergeStarterFlows?: boolean;
}

function mergePolicies(
  base: Policy[] | undefined,
  extra: Policy[] | undefined,
): Policy[] {
  const map = new Map<string, Policy>();
  for (const p of base ?? []) {
    map.set(p.id, p);
  }
  for (const p of extra ?? []) {
    map.set(p.id, p);
  }
  return [...map.values()];
}

export function applyProfileToModel(
  model: ThreatModel,
  profile: SecurityProfile,
  options?: ApplyProfileOptions,
): ThreatModel {
  const data_flows = options?.mergeStarterFlows
    ? mergeStarterFlows(model.data_flows, profile.starter_flows)
    : model.data_flows;

  let ai_governance = model.ai_governance;
  if (
    profile.adversary.ai_implementation &&
    !ai_governance &&
    profile.apply_ai_governance_template !== false
  ) {
    ai_governance = DEFAULT_AI_GOVERNANCE;
  }

  return {
    ...model,
    organization: {
      ...model.organization,
      migration_years:
        profile.organization_defaults.migration_years,
      quantum_horizon_years:
        profile.organization_defaults.quantum_horizon_years,
    },
    adversary: { ...profile.adversary },
    defaults: {
      confidentiality_years:
        profile.defaults?.confidentiality_years ??
        model.defaults?.confidentiality_years ??
        7,
    },
    data_flows,
    policies: mergePolicies(model.policies, profile.recommended_policies),
    ai_governance,
  };
}
