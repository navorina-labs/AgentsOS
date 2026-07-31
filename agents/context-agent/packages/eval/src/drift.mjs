/** Drift detection — changed repo files vs core Sources / path references */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const PATH_LIKE =
  /(?:^|[\s|`(])([\w@./-]+\.(?:ts|tsx|js|jsx|mjs|py|swift|md|json|sql|yaml|yml|toml|sh|rb|go|rs|html|css|scss|vue|svelte))(?:[`)\s,]|$)/gi;

/**
 * Extract file path references from a core markdown file.
 * @param {string} markdown
 * @returns {string[]}
 */
export function extractCorePathRefs(markdown) {
  const refs = new Set();

  const sourcesBlock = markdown.match(/## Sources[\s\S]*?(?=\n## |\n---\s*\n|$)/i);
  const scan = sourcesBlock ? sourcesBlock[0] : markdown;

  for (const line of scan.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("|--") || trimmed.startsWith("| Type")) continue;

    const backticks = [...trimmed.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
    for (const bt of backticks) {
      if (looksLikePath(bt)) refs.add(normalizeRef(bt));
    }

    const fileUrl = trimmed.match(/file:\/\/([^\)\s|]+)/);
    if (fileUrl) refs.add(normalizeRef(decodeURIComponent(fileUrl[1])));

    const tableCell = trimmed.match(/\|\s*(?:document|code|file|url)\s*\|\s*`?([^|`\n]+)`?\s*\|/i);
    if (tableCell && looksLikePath(tableCell[1].trim())) {
      refs.add(normalizeRef(tableCell[1].trim()));
    }

    const bullet = trimmed.match(/^[-*]\s+(`?)([\w@./-]+\.[a-z0-9]+)\1/i);
    if (bullet && looksLikePath(bullet[2])) refs.add(normalizeRef(bullet[2]));
  }

  for (const m of markdown.matchAll(PATH_LIKE)) {
    const p = m[1];
    if (looksLikePath(p) && !p.includes("{")) refs.add(normalizeRef(p));
  }

  return [...refs];
}

function looksLikePath(s) {
  if (!s || s.length < 3) return false;
  if (s.startsWith("http")) return false;
  if (s.includes("{") || s.includes("PLACEHOLDER")) return false;
  return s.includes("/") || /^src\//.test(s) || /^docs\//.test(s) || /\.[a-z0-9]+$/i.test(s);
}

function normalizeRef(ref) {
  return ref.replace(/^\.\//, "").replace(/\\/g, "/");
}

function globMatch(file, pattern) {
  const re = new RegExp(
    `^${pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, "§§")
      .replace(/\*/g, "[^/]*")
      .replace(/§§/g, ".*")}$`
  );
  return re.test(file);
}

function refMatchesFile(ref, file) {
  const r = normalizeRef(ref);
  const f = normalizeRef(file);
  if (r === f) return true;
  if (r.endsWith("*")) return f.startsWith(r.slice(0, -1));
  if (r.includes("*")) return globMatch(f, r);
  return path.basename(f) === path.basename(r) && f.endsWith(r.split("/").pop());
}

/**
 * @param {string} projectRoot
 * @param {object} manifest
 */
export function loadCoreInventory(projectRoot, manifest) {
  const cores = [];
  const maps = [
    ["core", manifest.cores ?? {}],
    ["subcore", manifest.subcores ?? {}],
  ];

  for (const [, map] of maps) {
    for (const [id, rel] of Object.entries(map)) {
      const abs = path.join(projectRoot, rel);
      if (!fs.existsSync(abs)) {
        cores.push({ id, rel, refs: [], missing: true, mtime: null, version: null });
        continue;
      }
      const text = fs.readFileSync(abs, "utf8");
      const versionMatch = text.match(/\|\s*version\s*\|\s*([^\|]+)\|/i);
      cores.push({
        id,
        rel,
        refs: extractCorePathRefs(text),
        missing: false,
        mtime: fs.statSync(abs).mtimeMs,
        version: versionMatch?.[1]?.trim() ?? null,
      });
    }
  }
  return cores;
}

/**
 * @param {string} baseRef e.g. origin/main
 * @param {string} [headRef] default HEAD
 * @param {string} [cwd]
 */
export function gitChangedFiles(baseRef, headRef = "HEAD", cwd = process.cwd()) {
  try {
    const out = execSync(`git diff --name-only ${baseRef}...${headRef}`, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    if (!out) return [];
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    try {
      const out = execSync(`git diff --name-only ${baseRef} ${headRef}`, {
        cwd,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      return out ? out.split("\n").map((l) => l.trim()).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
}

/**
 * @param {object} opts
 * @param {string} opts.projectRoot
 * @param {object} opts.manifest
 * @param {string[]} opts.changedFiles
 * @param {object} [opts.config]
 */
export function analyzeDrift(opts) {
  const cores = loadCoreInventory(opts.projectRoot, opts.manifest);
  const changed = new Set(opts.changedFiles.map(normalizeRef));
  const config = opts.config ?? {};

  const codePrefixes = config.codePrefixes ?? ["src/", "lib/", "app/", "packages/", "docs/"];
  const corePathPrefix = config.corePathPrefix ?? "context-os/";

  const issues = [];
  const suggestions = [];

  for (const core of cores) {
    if (core.missing) {
      issues.push({ kind: "missing_core", core: core.id, path: core.rel, severity: "error" });
      continue;
    }

    for (const ref of core.refs) {
      const abs = path.join(opts.projectRoot, ref.split("*")[0]);
      if (!ref.includes("*") && !fs.existsSync(abs)) {
        issues.push({
          kind: "orphan_source",
          core: core.id,
          ref,
          severity: "warn",
          message: `Core ${core.id} references missing file: ${ref}`,
        });
      }
    }
  }

  const changedCoreFiles = [...changed].filter((f) => f.startsWith(corePathPrefix));
  const changedCodeFiles = [...changed].filter((f) =>
    codePrefixes.some((p) => f.startsWith(p))
  );

  for (const file of changedCodeFiles) {
    const affectedCores = cores.filter((c) =>
      c.refs.some((ref) => refMatchesFile(ref, file))
    );

    if (affectedCores.length) {
      for (const core of affectedCores) {
        const coreUpdated = changedCoreFiles.some(
          (cf) => cf === core.rel || cf.endsWith(`/${core.id}.md`)
        );
        if (!coreUpdated) {
          issues.push({
            kind: "stale_core",
            core: core.id,
            changedFile: file,
            severity: "error",
            message: `${file} changed but ${core.id} (${core.rel}) was not updated`,
          });
          suggestions.push({
            action: "update_core",
            core: core.id,
            path: core.rel,
            reason: `Referenced by changed file ${file}`,
            checklist: [
              `Bump version in ${core.rel}`,
              "Update Key Entities / Sources if symbols moved",
              "Run: context-os eval route",
            ],
          });
        }
      }
    } else if (config.warnUnmapped !== false) {
      const mapped = (config.path_patterns ?? []).some((row) =>
        row.patterns?.some((p) => globMatch(file, p))
      );
      if (!mapped) {
        issues.push({
          kind: "unmapped_change",
          changedFile: file,
          severity: "warn",
          message: `${file} changed — no core Sources reference (consider updating technical-core or MAINTENANCE matrix)`,
        });
      } else {
        const row = config.path_patterns.find((r) =>
          r.patterns?.some((p) => globMatch(file, p))
        );
        const coreUpdated = row?.cores?.some((cid) => {
          const core = cores.find((c) => c.id === cid);
          return core && changedCoreFiles.includes(core.rel);
        });
        if (row && !coreUpdated) {
          issues.push({
            kind: "matrix_stale",
            cores: row.cores,
            changedFile: file,
            severity: "error",
            message: `${file} matches drift matrix → update ${row.cores.join(", ")}`,
          });
          for (const cid of row.cores) {
            const core = cores.find((c) => c.id === cid);
            if (core) {
              suggestions.push({
                action: "update_core",
                core: cid,
                path: core.rel,
                reason: `Drift matrix: ${file}`,
              });
            }
          }
        }
      }
    }
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warn");

  return {
    changed_files: [...changed],
    cores: cores.map((c) => ({ id: c.id, refs: c.refs.length, version: c.version })),
    issues,
    suggestions,
    ok: errors.length === 0,
    summary: {
      errors: errors.length,
      warnings: warnings.length,
      stale_cores: errors.filter((i) => i.kind === "stale_core").length,
      unmapped: warnings.filter((i) => i.kind === "unmapped_change").length,
    },
  };
}

export function formatDriftReport(result) {
  const lines = [
    `Drift check: ${result.ok ? "OK" : "FAIL"}`,
    `  changed files: ${result.changed_files.length}`,
    `  errors: ${result.summary.errors} · warnings: ${result.summary.warnings}`,
  ];

  if (result.issues.length) {
    lines.push("");
    for (const issue of result.issues) {
      lines.push(`  [${issue.severity}] ${issue.message ?? `${issue.kind} ${issue.core ?? issue.changedFile}`}`);
    }
  }

  if (result.suggestions.length) {
    lines.push("");
    lines.push("Suggestions:");
    for (const s of result.suggestions) {
      lines.push(`  → Update ${s.core} (${s.path}): ${s.reason}`);
    }
  }

  return lines.join("\n");
}

/**
 * @param {object} opts
 * @param {string} opts.projectRoot
 * @param {object} opts.manifest
 * @param {string} [opts.base]
 * @param {string} [opts.head]
 * @param {string[]} [opts.files]
 */
export function runDriftCheck(opts) {
  const configPath = path.join(opts.projectRoot, "context-os/drift-config.json");
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf8"))
    : {};

  const changedFiles =
    opts.files ??
    (opts.base ? gitChangedFiles(opts.base, opts.head ?? "HEAD", opts.projectRoot) : []);

  return analyzeDrift({
    projectRoot: opts.projectRoot,
    manifest: opts.manifest,
    changedFiles,
    config,
  });
}
