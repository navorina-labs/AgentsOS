import assert from "node:assert/strict";
import { compareAuditSnapshots } from "../src/commands/audit.mjs";

function snapshot(overrides = {}) {
  return {
    id: overrides.id ?? "snapshot",
    report_ok: overrides.report_ok ?? true,
    thresholds: {
      min_score: overrides.min_score ?? 85,
      max_route_tokens: overrides.max_route_tokens ?? 1000,
    },
    metrics: {
      maturity_rank: overrides.maturity_rank ?? 5,
      mean_score: overrides.mean_score ?? 90,
      routing_f1: overrides.routing_f1 ?? 1,
      max_route_tokens_est: overrides.max_tokens ?? 500,
      drift_errors: overrides.drift_errors ?? 0,
    },
    cores: overrides.cores ?? {
      "technical-core": { score: 90, version: "1.0.0", words: 300 },
    },
  };
}

const stable = compareAuditSnapshots(snapshot({ id: "a" }), snapshot({ id: "b" }));
assert.equal(stable.ok, true);
assert.equal(stable.regressions.length, 0);

const regressed = compareAuditSnapshots(
  snapshot({ id: "a" }),
  snapshot({
    id: "b",
    mean_score: 80,
    max_tokens: 700,
    max_route_tokens: 1500,
    cores: { "technical-core": { score: 80, version: "1.1.0", words: 350 } },
  })
);
assert.equal(regressed.ok, false);
assert.match(regressed.regressions.join("\n"), /mean core score decreased/);
assert.match(regressed.regressions.join("\n"), /maximum routed tokens increased/);
assert.match(regressed.regressions.join("\n"), /budget policy was relaxed/);
assert.match(regressed.regressions.join("\n"), /technical-core score decreased/);

console.log("audit history regression rules ok");
