/**
 * Оценка по неравенству Моски: x + y > z.
 */
import type { DataFlow, ThreatModel } from "../types/threat-model.js";

export interface MoscaResult {
  at_risk: boolean;
  margin_years: number;
  x_max_years: number;
  y_migration_years: number;
  z_horizon_years: number;
}

export function getConfidentialityYears(
  flow: DataFlow,
  model: ThreatModel,
): number {
  return (
    flow.confidentiality_years ??
    model.defaults?.confidentiality_years ??
    defaultYearsForStorage(flow.storage)
  );
}

function defaultYearsForStorage(storage: DataFlow["storage"]): number {
  switch (storage) {
    case "ephemeral":
      return 0.5;
    case "short":
      return 3;
    case "long":
      return 10;
    case "permanent":
      return 25;
  }
}

export function evaluateMosca(model: ThreatModel): MoscaResult {
  const y = model.organization.migration_years;
  const z = model.organization.quantum_horizon_years;

  const xMax = Math.max(
    ...model.data_flows.map((f) => getConfidentialityYears(f, model)),
  );

  const margin = xMax + y - z;

  return {
    at_risk: margin > 0,
    margin_years: Math.round(margin * 100) / 100,
    x_max_years: xMax,
    y_migration_years: y,
    z_horizon_years: z,
  };
}

export function flowMoscaAtRisk(
  flow: DataFlow,
  model: ThreatModel,
): boolean {
  const x = getConfidentialityYears(flow, model);
  const y = model.organization.migration_years;
  const z = model.organization.quantum_horizon_years;
  return x + y > z;
}
