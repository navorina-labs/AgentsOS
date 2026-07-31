#!/usr/bin/env node
/** Offline test: semantic routing with fake embeddings (no API key) */
import { routeQuestionFromVector } from "../src/semantic-router.mjs";

const index = {
  routes: [
    {
      cores: ["revenue-core", "business-core"],
      embedding: [1, 0, 0, 0],
    },
    {
      cores: ["operational-core", "technical-core"],
      embedding: [0, 1, 0, 0],
    },
    {
      cores: ["billing-core"],
      embedding: [0, 0, 1, 0],
    },
  ],
};

const qMrr = [0.95, 0.05, 0, 0];
const qDeploy = [0.05, 0.9, 0.05, 0];

const r1 = routeQuestionFromVector(qMrr, index);
const r2 = routeQuestionFromVector(qDeploy, index);

if (!r1.includes("revenue-core")) {
  console.error("FAIL: MRR question should route to revenue-core, got", r1);
  process.exit(1);
}
if (!r2.includes("operational-core")) {
  console.error("FAIL: deploy question should route to operational-core, got", r2);
  process.exit(1);
}

console.log("semantic offline ok", { mrr: r1, deploy: r2 });
