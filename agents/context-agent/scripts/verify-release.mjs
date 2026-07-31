/** Validate package versions and an optional release tag before publishing */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(moduleDir, "..");
const packageFiles = [
  "packages/schemas/package.json",
  "packages/eval/package.json",
  "packages/cli/package.json",
];

const packages = packageFiles.map((rel) => ({
  rel,
  data: JSON.parse(fs.readFileSync(path.join(root, rel), "utf8")),
}));
const versions = new Set(packages.map(({ data }) => data.version));

if (versions.size !== 1) {
  throw new Error(
    `release packages must share one version: ${packages
      .map(({ data }) => `${data.name}@${data.version}`)
      .join(", ")}`
  );
}

const version = packages[0].data.version;
const cli = packages.find(({ data }) => data.name === "context-os")?.data;
if (cli?.dependencies?.["@context-os/eval"] !== version) {
  throw new Error(
    `context-os must depend on @context-os/eval@${version}; got ${cli?.dependencies?.["@context-os/eval"] ?? "missing"}`
  );
}

const tagIndex = process.argv.indexOf("--tag");
if (tagIndex >= 0) {
  const tag = process.argv[tagIndex + 1];
  if (!tag) throw new Error("--tag requires a value");
  const tagVersion = tag.replace(/^(?:cli-)?v/, "");
  if (tagVersion !== version) {
    throw new Error(`release tag ${tag} does not match package version ${version}`);
  }
}

console.log(`release contract ok: ${packages.map(({ data }) => `${data.name}@${data.version}`).join(", ")}`);
