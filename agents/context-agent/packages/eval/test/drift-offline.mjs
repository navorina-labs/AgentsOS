#!/usr/bin/env node
/** Drift unit test — stale core detection without git */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeDrift, extractCorePathRefs } from "../src/drift.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(__dirname, "drift-fixture");

const sample = `
## Sources
- \`src/api/billing.ts\`
- \`docs/PRD.md\`
| file | \`src/core/router.ts\` | handler |
`;

const refs = extractCorePathRefs(sample);
if (!refs.includes("src/api/billing.ts") || !refs.includes("docs/PRD.md")) {
  console.error("FAIL extractCorePathRefs", refs);
  process.exit(1);
}

const manifest = {
  cores: {
    "billing-core": "context-os/cores/billing-core.md",
    "technical-core": "context-os/cores/technical-core.md",
  },
  subcores: {},
};

const result = analyzeDrift({
  projectRoot: fixture,
  manifest,
  changedFiles: ["src/api/billing.ts"],
  config: {},
});

const stale = result.issues.find((i) => i.kind === "stale_core" && i.core === "billing-core");
if (!stale) {
  console.error("FAIL expected stale_core for billing-core", result.issues);
  process.exit(1);
}

const okResult = analyzeDrift({
  projectRoot: fixture,
  manifest,
  changedFiles: ["src/api/billing.ts", "context-os/cores/billing-core.md"],
  config: {},
});

if (!okResult.ok) {
  console.error("FAIL expected ok when core updated", okResult.issues);
  process.exit(1);
}

console.log("drift ok", { stale: stale.message, refs: refs.length });
