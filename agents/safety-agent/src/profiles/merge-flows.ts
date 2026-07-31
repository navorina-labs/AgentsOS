/**
 * Слияние starter_flows профиля с data_flows модели (по id).
 */
import type { DataFlow } from "../types/threat-model.js";

export function mergeStarterFlows(
  existing: DataFlow[],
  starter: DataFlow[] | undefined,
): DataFlow[] {
  if (!starter?.length) return existing;
  const map = new Map(existing.map((f) => [f.id, f]));
  for (const flow of starter) {
    if (!map.has(flow.id)) {
      map.set(flow.id, flow);
    }
  }
  return [...map.values()];
}
