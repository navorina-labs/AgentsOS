/**
 * Rego для IFF (свой/чужой) и языка ИИ — OPA gate на ai_governance.
 */
import type { ThreatModel } from "../types/threat-model.js";
import type { AiLanguageChannel } from "../types/ai-governance.js";

export function generateOpaAiGovernance(model: ThreatModel): string | null {
  if (!model.adversary.ai_implementation) return null;

  const gov = model.ai_governance;
  const channels = gov?.ai_language.channels ?? [];
  const channelLiterals = channels.map(channelToRego).join(",\n");

  return `# SafetyOS — AI governance (IFF + язык ИИ)
# Organization: ${model.organization.name}
package safetyos.ai

default allow := true

ai_violations contains msg if {
  input.adversary.ai_implementation == true
  not input.ai_governance
  msg := "ai_governance required when adversary.ai_implementation is true"
}

ai_violations contains msg if {
  some ch in input.ai_governance.ai_language.channels
  ch.role == "instruction"
  ch.trust != "own"
  msg := sprintf("channel %v: instruction requires trust=own", [ch.id])
}

ai_violations contains msg if {
  some ch in input.ai_governance.ai_language.channels
  ch.trust == "foreign"
  ch.role == "data"
  not ch.delimiter_start
  msg := sprintf("channel %v: foreign data channel needs delimiter_start", [ch.id])
}

ai_violations contains msg if {
  some ch in input.ai_governance.ai_language.channels
  ch.trust == "foreign"
  ch.role == "data"
  not ch.delimiter_end
  msg := sprintf("channel %v: foreign data channel needs delimiter_end", [ch.id])
}

ai_violations contains msg if {
  some ch in input.ai_governance.ai_language.channels
  ch.trust == "unknown"
  ch.role == "tool_io"
  not ch.sanitize
  msg := sprintf("channel %v: tool_io/unknown should set sanitize=true", [ch.id])
}

# Declared channels from threat model (reference)
expected_channels := [
${channelLiterals || "  # none"}
]

deny contains msg if {
  some v in ai_violations
  msg := v
}
`;
}

function channelToRego(ch: AiLanguageChannel): string {
  const parts = [
    `"id": "${ch.id}"`,
    `"trust": "${ch.trust}"`,
    `"role": "${ch.role}"`,
  ];
  if (ch.delimiter_start) parts.push(`"delimiter_start": ${JSON.stringify(ch.delimiter_start)}`);
  if (ch.delimiter_end) parts.push(`"delimiter_end": ${JSON.stringify(ch.delimiter_end)}`);
  if (ch.strip_instruction_like) parts.push(`"strip_instruction_like": true`);
  if (ch.sanitize) parts.push(`"sanitize": true`);
  return `  { ${parts.join(", ")} }`;
}

export function opaAiGovernanceOutPath(policyOut: string): string {
  const dir = policyOut.includes("/") ? policyOut.replace(/\/[^/]+$/, "") : ".";
  const base = dir === policyOut ? "." : dir;
  return `${base}/ai-governance.rego`;
}
