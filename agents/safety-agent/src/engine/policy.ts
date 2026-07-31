/**
 * Сопоставление declarative policies с потоками данных.
 */
import {
  collectFromCrypto,
  type ClassifiedAlgorithm,
} from "../registry/algorithms.js";
import type { DataFlow, Policy, StorageTier } from "../types/threat-model.js";

const LONG_TIERS: StorageTier[] = ["long", "permanent"];

function retentionMatches(tier: StorageTier, whenTier?: StorageTier): boolean {
  if (!whenTier) return true;
  if (whenTier === "long") {
    return LONG_TIERS.includes(tier);
  }
  return tier === whenTier;
}

function flowHasAlgorithm(
  classified: ClassifiedAlgorithm[],
  algorithm: string,
): boolean {
  const target = algorithm.trim().toUpperCase();
  return classified.some(
    (c) =>
      c.normalized.toUpperCase() === target ||
      c.raw.toUpperCase() === target ||
      c.normalized.toUpperCase().includes(target),
  );
}

export interface PolicyMatch {
  policy_id: string;
  action: Policy["action"];
  message: string;
}

export function evaluatePoliciesForFlow(
  flow: DataFlow,
  policies: Policy[] | undefined,
): PolicyMatch[] {
  if (!policies?.length) return [];

  const classified = collectFromCrypto(flow.crypto);
  const matches: PolicyMatch[] = [];

  for (const policy of policies) {
    const when = policy.when;
    if (
      when.retention_tier &&
      !retentionMatches(flow.storage, when.retention_tier)
    ) {
      continue;
    }
    if (
      when.has_algorithm &&
      !flowHasAlgorithm(classified, when.has_algorithm)
    ) {
      continue;
    }

    const rec = policy.recommend
      ? ` → recommend ${policy.recommend.key_exchange ?? ""}${
          policy.recommend.hybrid_with
            ? ` + hybrid ${policy.recommend.hybrid_with}`
            : ""
        }`
      : "";

    matches.push({
      policy_id: policy.id,
      action: policy.action,
      message: `Policy "${policy.id}" triggered (${policy.action})${rec}`,
    });
  }

  return matches;
}
