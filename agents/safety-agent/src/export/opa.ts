/**
 * Экспорт policies threat model в Rego (OPA).
 */
import type { Policy, ThreatModel } from "../types/threat-model.js";

export function generateOpaFromThreatModel(model: ThreatModel): string {
  const lines: string[] = [
    "# SafetyOS — auto-generated OPA policies",
    "# Organization:",
    ` #   ${model.organization.name}`,
    "package safetyos",
    "",
    "default allow := true",
    "",
    "# Violations block deployment when enforced externally",
    "violations contains msg if {",
    "  some flow in input.data_flows",
    "  some v in flow_violations(flow)",
    "  msg := v",
    "}",
    "",
    "flow_violations(flow) := [msg | {",
    "  some policy in policies",
    "  policy_matches(flow, policy)",
    "  policy.action == \"block\"",
    "  msg := sprintf(\"policy %s: %s\", [policy.id, flow.id])",
    "}]",
    "",
    "policies := [",
  ];

  const policies = model.policies ?? [];
  if (policies.length === 0) {
    lines.push("  # no policies defined in threat model");
    lines.push("]");
  } else {
    for (let i = 0; i < policies.length; i++) {
      lines.push(policyToRegoLiteral(policies[i]!) + (i < policies.length - 1 ? "," : ""));
    }
    lines.push("]");
  }

  lines.push(
    "",
    "policy_matches(flow, policy) if {",
    "  policy.when.retention_tier",
    "  retention_tier_match(flow.storage, policy.when.retention_tier)",
    "  policy.when.has_algorithm",
    "  algorithm_in_flow(flow, policy.when.has_algorithm)",
    "}",
    "",
    "policy_matches(flow, policy) if {",
    "  not policy.when.retention_tier",
    "  policy.when.has_algorithm",
    "  algorithm_in_flow(flow, policy.when.has_algorithm)",
    "}",
    "",
    "retention_tier_match(storage, \"long\") if {",
    "  storage == \"long\"",
    "}",
    "retention_tier_match(storage, \"long\") if {",
    "  storage == \"permanent\"",
    "}",
    "retention_tier_match(storage, tier) if {",
    "  tier != \"long\"",
    "  storage == tier",
    "}",
    "",
    "algorithm_in_flow(flow, algo) if {",
    "  algo in flow.crypto.key_exchange",
    "}",
    "algorithm_in_flow(flow, algo) if {",
    "  algo in flow.crypto.signatures",
    "}",
    "algorithm_in_flow(flow, algo) if {",
    "  some a in flow.crypto.key_exchange",
    "  contains(lower(a), lower(algo))",
    "}",
  );

  return lines.join("\n");
}

function policyToRegoLiteral(p: Policy): string {
  const whenParts: string[] = [];
  if (p.when.retention_tier) {
    whenParts.push(`"retention_tier": "${p.when.retention_tier}"`);
  }
  if (p.when.has_algorithm) {
    whenParts.push(`"has_algorithm": "${p.when.has_algorithm}"`);
  }
  const when = whenParts.length ? `{ ${whenParts.join(", ")} }` : "{}";
  return `  {"id": "${p.id}", "action": "${p.action}", "when": ${when}}`;
}
