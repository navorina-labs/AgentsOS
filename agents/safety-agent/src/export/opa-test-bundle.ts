/**
 * OPA test bundle: policy.rego + ai-governance.rego + _test.rego.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ThreatModel } from "../types/threat-model.js";
import { generateOpaAiGovernance } from "./opa-ai-governance.js";
import { generateOpaFromThreatModel } from "./opa.js";

export function threatModelToOpaInput(model: ThreatModel): object {
  return {
    organization: model.organization,
    adversary: model.adversary,
    data_flows: model.data_flows,
    policies: model.policies ?? [],
    ai_governance: model.ai_governance ?? null,
  };
}

export function generateOpaTestRego(model: ThreatModel): string {
  const input = JSON.stringify(threatModelToOpaInput(model), null, 2);
  return `# SafetyOS — OPA tests (auto)
package sec_test

import data.safetyos.ai

input_valid := ${input}

test_ai_governance_no_deny if {
  count(ai.deny) == 0 with input as input_valid
}

test_ai_required_when_adversary_ai if {
  count(ai.deny) > 0 with input as {
    "adversary": {"ai_implementation": true}
  }
}
`;
}

export async function writeOpaTestBundle(
  model: ThreatModel,
  outDir: string,
): Promise<{ dir: string; files: string[] }> {
  const dir = path.resolve(outDir);
  await mkdir(dir, { recursive: true });

  const policyPath = path.join(dir, "policy.rego");
  const aiPath = path.join(dir, "ai-governance.rego");
  const testPath = path.join(dir, "safetyos_test.rego");

  await writeFile(policyPath, generateOpaFromThreatModel(model), "utf8");
  const aiRego = generateOpaAiGovernance(model);
  const files = [policyPath, testPath];
  if (aiRego) {
    await writeFile(aiPath, aiRego, "utf8");
    files.splice(1, 0, aiPath);
  }
  await writeFile(testPath, generateOpaTestRego(model), "utf8");

  return { dir, files };
}
