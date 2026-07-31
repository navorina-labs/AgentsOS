/** Verify core metadata lifecycle against a git base */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { loadManifest, parseGlobalFlags } from "../lib/paths.mjs";

function metadata(markdown) {
  const value = (field) =>
    markdown.match(new RegExp(`\\|\\s*${field}\\s*\\|\\s*([^|]+)\\|`, "i"))?.[1]?.trim() ?? null;
  return {
    version: value("version"),
    last_updated: value("last_updated"),
  };
}

function semverParts(version) {
  const match = version?.match(/^(\d+)\.(\d+)\.(\d+)$/);
  return match ? match.slice(1).map(Number) : null;
}

function semverGreater(current, previous) {
  const a = semverParts(current);
  const b = semverParts(previous);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date ?? "") && !Number.isNaN(Date.parse(`${date}T00:00:00Z`));
}

export function verifyCoreContent({ id, rel, previous, current }) {
  const errors = [];
  const currentMeta = metadata(current);

  if (!semverParts(currentMeta.version)) {
    errors.push(`${id}: version must use x.y.z semver`);
  }
  if (!validDate(currentMeta.last_updated)) {
    errors.push(`${id}: last_updated must use a valid YYYY-MM-DD date`);
  }

  if (previous == null) {
    return { id, path: rel, status: "new", metadata: currentMeta, errors };
  }
  if (previous === current) {
    return { id, path: rel, status: "unchanged", metadata: currentMeta, errors: [] };
  }

  const previousMeta = metadata(previous);
  if (!semverGreater(currentMeta.version, previousMeta.version)) {
    errors.push(
      `${id}: changed content requires version greater than ${previousMeta.version ?? "missing"}`
    );
  }
  if (
    !validDate(previousMeta.last_updated) ||
    !validDate(currentMeta.last_updated) ||
    currentMeta.last_updated < previousMeta.last_updated
  ) {
    errors.push(
      `${id}: changed content requires last_updated not before ${previousMeta.last_updated ?? "missing"}`
    );
  }

  return {
    id,
    path: rel,
    status: "changed",
    previous: previousMeta,
    metadata: currentMeta,
    errors,
  };
}

function git(projectRoot, args, options = {}) {
  const output = execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: options.quiet ? ["ignore", "pipe", "ignore"] : ["ignore", "pipe", "pipe"],
  });
  return options.raw ? output : output.trim();
}

function previousFile(projectRoot, base, gitPath) {
  try {
    return git(projectRoot, ["show", `${base}:${gitPath}`], { quiet: true, raw: true });
  } catch {
    return null;
  }
}

export function buildCoreVersionReport(projectRoot, base) {
  try {
    git(projectRoot, ["rev-parse", "--verify", base], { quiet: true });
  } catch {
    throw new Error(`git base not found: ${base}`);
  }

  const gitRoot = git(projectRoot, ["rev-parse", "--show-toplevel"]);
  const projectPrefix = path.relative(gitRoot, projectRoot);
  const manifest = loadManifest(projectRoot);
  const coreMap = { ...(manifest.cores ?? {}), ...(manifest.subcores ?? {}) };
  const cores = [];

  for (const [id, rel] of Object.entries(coreMap)) {
    const full = path.join(projectRoot, rel);
    if (!fs.existsSync(full)) {
      cores.push({ id, path: rel, status: "missing", errors: [`${id}: core file missing`] });
      continue;
    }
    const gitPath = path.join(projectPrefix, rel).split(path.sep).join("/");
    cores.push(
      verifyCoreContent({
        id,
        rel,
        previous: previousFile(projectRoot, base, gitPath),
        current: fs.readFileSync(full, "utf8"),
      })
    );
  }

  const errors = cores.flatMap((core) => core.errors);
  return {
    ok: errors.length === 0,
    base,
    changed: cores.filter((core) => core.status === "changed").length,
    added: cores.filter((core) => core.status === "new").length,
    unchanged: cores.filter((core) => core.status === "unchanged").length,
    cores,
    errors,
  };
}

export async function cmdCores(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0] && !rest[0].startsWith("-") ? rest[0] : "verify";
  if (sub !== "verify") {
    throw new Error("Usage: context-os cores verify --base <git-ref> [--json]");
  }

  let base = null;
  let json = false;
  for (let i = 1; i < rest.length; i++) {
    if (rest[i] === "--base" && rest[i + 1]) base = rest[++i];
    else if (rest[i] === "--json") json = true;
  }
  if (!base) throw new Error("context-os cores verify requires --base <git-ref>");

  const report = buildCoreVersionReport(global.root, base);
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(
      `Core version check: ${report.ok ? "OK" : "FAILED"} (${report.changed} changed, ${report.added} new, ${report.unchanged} unchanged)`
    );
    for (const core of report.cores.filter((item) => item.status !== "unchanged")) {
      console.log(`  ${core.errors.length ? "fail" : "ok"}: ${core.id} ${core.status}`);
    }
    for (const error of report.errors) console.error(`    error: ${error}`);
  }
  if (!report.ok) process.exitCode = 1;
}
