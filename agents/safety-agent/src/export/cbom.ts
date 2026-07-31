/**
 * CycloneDX 1.6 CBOM — инвентарь криптографии из threat model.
 */
import { classifyAlgorithm } from "../registry/algorithms.js";
import { findMigrationPath } from "../registry/nist-migration.js";
import type { AnalyzeReport, DataFlow, ThreatModel } from "../types/threat-model.js";

export interface CbomComponent {
  type: "cryptographic-asset";
  name: string;
  version?: string;
  bom_ref: string;
  properties?: { name: string; value: string }[];
}

export interface CycloneDxBom {
  bomFormat: "CycloneDX";
  specVersion: "1.6";
  version: 1;
  metadata: {
    timestamp: string;
    component: {
      type: "application";
      name: string;
      version: string;
    };
    properties?: { name: string; value: string }[];
  };
  components: CbomComponent[];
  dependencies?: { ref: string; dependsOn: string[] }[];
}

function flowAlgorithms(flow: DataFlow): string[] {
  const c = flow.crypto;
  return [
    ...(c.key_exchange ?? []),
    ...(c.signatures ?? []),
    ...(c.symmetric ?? []),
    ...(c.hash ?? []),
  ];
}

export function buildCbomFromThreatModel(
  model: ThreatModel,
  report?: AnalyzeReport,
): CycloneDxBom {
  const componentMap = new Map<string, CbomComponent>();
  const flowDeps = new Map<string, string[]>();

  for (const flow of model.data_flows) {
    const refs: string[] = [];
    for (const algo of flowAlgorithms(flow)) {
      const classified = classifyAlgorithm(algo);
      const ref = `crypto/${classified.normalized}`;
      refs.push(ref);

      if (!componentMap.has(ref)) {
        const props = [
          { name: "safetyos:algorithm-class", value: classified.class },
          { name: "safetyos:nist-status", value: nistStatus(classified.class) },
          ...nistMigrationProperties(algo, classified.class),
        ];
        componentMap.set(ref, {
          type: "cryptographic-asset",
          name: classified.normalized,
          bom_ref: ref,
          properties: props,
        });
      }
    }

    const flowRef = `flow/${flow.id}`;
    componentMap.set(flowRef, {
      type: "cryptographic-asset",
      name: flow.name,
      bom_ref: flowRef,
      properties: [
        { name: "safetyos:storage-tier", value: flow.storage },
        {
          name: "safetyos:confidentiality-years",
          value: String(
            flow.confidentiality_years ??
              model.defaults?.confidentiality_years ??
              0,
          ),
        },
        { name: "safetyos:hndl-exposed", value: String(flow.hndl_exposed ?? false) },
        ...(report
          ? [
              {
                name: "safetyos:risk-tier",
                value:
                  report.flows.find((f) => f.id === flow.id)?.tier ?? "unknown",
              },
              {
                name: "safetyos:risk-score",
                value: String(
                  report.flows.find((f) => f.id === flow.id)?.score ?? 0,
                ),
              },
            ]
          : []),
      ],
    });
    flowDeps.set(flowRef, refs);
  }

  return {
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      component: {
        type: "application",
        name: model.organization.name,
        version: "1.0.0",
      },
      properties: [
        { name: "safetyos:mosca-at-risk", value: String(report?.mosca.at_risk ?? false) },
        {
          name: "safetyos:migration-years",
          value: String(model.organization.migration_years),
        },
        {
          name: "safetyos:quantum-horizon-years",
          value: String(model.organization.quantum_horizon_years),
        },
      ],
    },
    components: [...componentMap.values()],
    dependencies: [...flowDeps.entries()].map(([ref, dependsOn]) => ({
      ref,
      dependsOn,
    })),
  };
}

function nistMigrationProperties(
  algorithm: string,
  algoClass: string,
): { name: string; value: string }[] {
  if (algoClass === "pqc") {
    return [{ name: "safetyos:nist-migration-state", value: "migrated-pqc" }];
  }
  const path = findMigrationPath(algorithm);
  if (!path) return [];
  return [
    { name: "safetyos:nist-migration-state", value: "migration-required" },
    { name: "safetyos:nist-migration-target", value: path.pqc_replacement },
    { name: "safetyos:nist-migration-role", value: path.role },
    { name: "safetyos:nist-ref", value: path.nist_ref },
    ...(path.hybrid_transition
      ? [{ name: "safetyos:nist-hybrid-transition", value: path.hybrid_transition }]
      : []),
  ];
}

function nistStatus(cls: string): string {
  switch (cls) {
    case "pqc":
      return "nist-standardized-pqc-2024";
    case "quantum_vulnerable":
      return "deprecated-post-quantum";
    case "weak":
      return "deprecated";
    case "symmetric_safe":
      return "acceptable-symmetric";
    default:
      return "review-required";
  }
}
