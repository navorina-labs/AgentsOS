/** Resolve context-os root inside a project */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function loadProfileDefs() {
  const p = path.join(packageRoot(), "templates", "profiles.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export const PROFILE_DEFS = loadProfileDefs();

export function profileNames() {
  return Object.keys(PROFILE_DEFS);
}

export function parseGlobalFlags(argv) {
  const opts = { root: process.cwd() };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) {
      opts.root = path.resolve(argv[++i]);
    } else {
      rest.push(a);
    }
  }
  return { opts, rest };
}

export function contextOsDir(projectRoot) {
  return path.join(projectRoot, "context-os");
}

export function manifestPath(projectRoot) {
  return path.join(contextOsDir(projectRoot), "manifest.json");
}

export function routingMapPath(projectRoot) {
  return path.join(contextOsDir(projectRoot), "router", "routing-map.json");
}

export function routerEmbeddingsPath(projectRoot) {
  return path.join(contextOsDir(projectRoot), "router", "embeddings.json");
}

export function loadManifest(projectRoot) {
  const p = manifestPath(projectRoot);
  if (!fs.existsSync(p)) {
    throw new Error(`manifest not found: ${p}. Run: context-os init`);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function packageRoot() {
  return path.resolve(moduleDir, "../..");
}

export function templateProfileDir(profile) {
  return path.join(packageRoot(), "templates", profile, "context-os");
}
