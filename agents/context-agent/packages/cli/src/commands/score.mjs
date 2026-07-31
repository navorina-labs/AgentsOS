/** Score Context OS core quality with a practical methodology rubric */
import fs from "node:fs";
import path from "node:path";
import {
  loadManifest,
  parseGlobalFlags,
  routingMapPath,
} from "../lib/paths.mjs";

const SECTION_RULES = [
  { key: "purpose", label: "Purpose", points: 10, pattern: /^## Purpose\b/im },
  { key: "scope", label: "Scope", points: 20, pattern: /^## Scope\b/im },
  { key: "entities", label: "Key Entities", points: 15, pattern: /^## Key Entities\b/im },
  { key: "invariants", label: "Invariants", points: 15, pattern: /^## Invariants\b/im },
  { key: "sources", label: "Sources", points: 15, pattern: /^## Sources\b/im },
  { key: "exclusions", label: "Exclusions", points: 10, pattern: /^## Exclusions\b/im },
  { key: "outputs", label: "Typical Outputs", points: 5, pattern: /^## Typical Outputs\b/im },
];

function parseArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const opts = { ...global, json: false, min: 0 };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--json") opts.json = true;
    else if (a === "--min" && rest[i + 1]) opts.min = Number(rest[++i]);
  }
  return opts;
}

function sectionText(markdown, heading) {
  const startRe = new RegExp(`^## ${heading}\\b.*$`, "im");
  const start = startRe.exec(markdown);
  if (!start || start.index == null) return "";
  const from = start.index + start[0].length;
  const next = /^## .+$/im.exec(markdown.slice(from));
  const end = next?.index == null ? markdown.length : from + next.index;
  return markdown.slice(start.index, end);
}

function hasTemplatePlaceholder(text) {
  return /\{[^}\n]{1,120}\}|\{\}|{{[^}]+}}|\bTBD\b|\bTODO\b|\bN\/A\b/i.test(text);
}

function parseLastUpdated(text) {
  const row = text.match(/\|\s*last_updated\s*\|\s*([^|]+)\|/i);
  const inline = text.match(/last_updated\s*[:=]\s*(\d{4}-\d{2}-\d{2})/i);
  const raw = (row?.[1] ?? inline?.[1] ?? "").trim();
  const date = raw.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
  return date;
}

function parseVersion(text) {
  return text.match(/\|\s*version\s*\|\s*([^|]+)\|/i)?.[1]?.trim() ?? null;
}

function daysSince(dateString) {
  if (!dateString) return null;
  const t = Date.parse(`${dateString}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}

function hasNonEmptyTableRef(section) {
  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !/^\|[-\s|]+\|$/.test(line));
  return lines.some((line) => {
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 2) return false;
    if (/^(type|field|entity)$/i.test(cells[0])) return false;
    return cells.slice(1).some((cell) => cell && !hasTemplatePlaceholder(cell));
  });
}

function sourceReferences(section) {
  const references = [];
  for (const line of section.split("\n")) {
    if (!line.trim().startsWith("|") || /^\|[-\s|]+\|$/.test(line.trim())) continue;
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 2 || /^(type|field|entity)$/i.test(cells[0])) continue;
    const ref = cells[1].replace(/^`|`$/g, "").trim();
    if (ref && !hasTemplatePlaceholder(ref)) references.push(ref);
  }
  return references;
}

function localSourcePath(reference) {
  if (
    /^(?:https?:\/\/|mailto:|urn:|[a-z]+:\/\/)/i.test(reference) ||
    /^(?:dashboard|database|service|interview|analytics|internal)\b/i.test(reference)
  ) {
    return null;
  }
  const clean = reference.split("#")[0].split("?")[0].trim();
  if (!clean || /[*?[\]]/.test(clean)) return null;
  return /^(?:\.{0,2}\/|context-os\/|docs\/|src\/|packages\/|apps\/|services\/|lib\/|README\b)/i.test(clean)
    ? clean
    : null;
}

export function scoreCore(projectRoot, id, rel) {
  const full = path.join(projectRoot, rel);
  const warnings = [];
  const earned = {};

  if (!fs.existsSync(full)) {
    return {
      id,
      path: rel,
      score: 0,
      max_score: 100,
      warnings: [`missing core file: ${rel}`],
      earned,
    };
  }

  const text = fs.readFileSync(full, "utf8");
  const words = text.match(/\S+/g)?.length ?? 0;
  const sources = sourceReferences(sectionText(text, "Sources"));

  for (const rule of SECTION_RULES) {
    if (!rule.pattern.test(text)) {
      earned[rule.key] = 0;
      warnings.push(`missing section: ${rule.label}`);
      continue;
    }
    const body = sectionText(text, rule.label);
    if (hasTemplatePlaceholder(body)) {
      earned[rule.key] = Math.floor(rule.points / 2);
      warnings.push(`${rule.label}: still contains placeholders`);
    } else if (rule.key === "sources" && !hasNonEmptyTableRef(body)) {
      earned[rule.key] = Math.floor(rule.points / 2);
      warnings.push("Sources: no concrete source reference found");
    } else {
      earned[rule.key] = rule.points;
    }
  }

  const lastUpdated = parseLastUpdated(text);
  const version = parseVersion(text);
  const age = daysSince(lastUpdated);
  if (!lastUpdated) {
    earned.freshness = 0;
    warnings.push("freshness: last_updated missing");
  } else if (age != null && age > 90) {
    earned.freshness = 5;
    warnings.push(`freshness: last_updated is ${age} days old`);
  } else {
    earned.freshness = 10;
  }

  const score = Object.values(earned).reduce((sum, value) => sum + value, 0);
  return {
    id,
    path: rel,
    score,
    max_score: 100,
    last_updated: lastUpdated,
    version,
    word_count: words,
    source_references: sources,
    warnings,
    earned,
  };
}

function architectureReport(projectRoot, cores, maxWords) {
  const errors = [];
  const warnings = [];
  const routePath = routingMapPath(projectRoot);
  let routingMap = null;

  try {
    routingMap = JSON.parse(fs.readFileSync(routePath, "utf8"));
    if (!Array.isArray(routingMap.routes)) {
      errors.push("routing map: routes must be an array");
      routingMap = null;
    }
  } catch (err) {
    errors.push(`cannot read routing map: ${err instanceof Error ? err.message : String(err)}`);
  }

  const routed = new Set();
  for (const route of routingMap?.routes ?? []) {
    for (const id of route.cores ?? []) routed.add(id);
  }
  if (routingMap?.fallback_core) routed.add(routingMap.fallback_core);

  const orphanCores = cores.filter((core) => !routed.has(core.id)).map((core) => core.id);
  for (const id of orphanCores) errors.push(`${id}: declared in manifest but unreachable by routing`);

  const missingSources = [];
  for (const core of cores) {
    if (core.word_count > maxWords) {
      warnings.push(`${core.id}: ${core.word_count} words exceeds recommended ${maxWords}`);
    }
    for (const reference of core.source_references ?? []) {
      const local = localSourcePath(reference);
      if (!local) continue;
      const resolved = path.resolve(projectRoot, local);
      const insideRoot = resolved === projectRoot || resolved.startsWith(`${path.resolve(projectRoot)}${path.sep}`);
      if (!insideRoot) {
        missingSources.push({ core: core.id, reference });
        errors.push(`${core.id}: local source escapes project root: ${reference}`);
      } else if (!fs.existsSync(resolved)) {
        missingSources.push({ core: core.id, reference });
        errors.push(`${core.id}: local source not found: ${reference}`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    max_words: maxWords,
    routed_cores: [...routed].sort(),
    orphan_cores: orphanCores,
    missing_sources: missingSources,
    errors,
    warnings,
  };
}

export function buildScoreReport(projectRoot, minScore = 0, { maxWords = 2500 } = {}) {
  const manifest = loadManifest(projectRoot);
  const coreMap = {
    ...(manifest.cores ?? {}),
    ...(manifest.subcores ?? {}),
  };

  const cores = Object.entries(coreMap).map(([id, rel]) => scoreCore(projectRoot, id, rel));
  const mean = cores.length
    ? cores.reduce((sum, core) => sum + core.score, 0) / cores.length
    : 0;
  const architecture = architectureReport(projectRoot, cores, maxWords);
  const ok = cores.every((core) => core.score >= minScore) && architecture.ok;
  return {
    ok,
    min_score: minScore,
    mean_score: Number(mean.toFixed(1)),
    architecture,
    cores,
  };
}

export async function cmdScore(argv) {
  const opts = parseArgs(argv);
  const report = buildScoreReport(opts.root, opts.min);

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Core quality score: mean ${report.mean_score}/100${opts.min ? ` (min ${opts.min})` : ""}`);
    for (const core of report.cores) {
      console.log(`  ${core.score >= opts.min ? "ok" : "fail"}: ${core.id} ${core.score}/100 (${core.path})`);
      for (const warning of core.warnings) console.log(`    warn: ${warning}`);
    }
    console.log(`  ${report.architecture.ok ? "ok" : "fail"}: architecture`);
    for (const warning of report.architecture.warnings) console.log(`    warn: ${warning}`);
    for (const error of report.architecture.errors) console.error(`    error: ${error}`);
  }

  if (!report.ok) process.exitCode = 1;
}
