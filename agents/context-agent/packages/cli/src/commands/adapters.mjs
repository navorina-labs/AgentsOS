/** Install tool-specific agent instructions without overwriting user content */
import fs from "node:fs";
import path from "node:path";
import { parseGlobalFlags } from "../lib/paths.mjs";

const START = "<!-- context-os:start -->";
const END = "<!-- context-os:end -->";

const INSTRUCTIONS = `${START}
## Context OS

For project-specific questions and changes:

1. Read \`context-os/manifest.json\` and \`context-os/router/question-router.md\`.
2. Route the question before broad repository exploration. Load one primary core and at most two secondary cores.
3. Treat **Invariants** as constraints and respect **Exclusions** in every selected core.
4. Open source files listed by the selected cores only when more detail is required.
5. After changes that affect core claims, update the core using \`context-os/MAINTENANCE.md\`.
6. Run \`context-os check\` before considering Context OS changes complete.
${END}`;

export const ADAPTERS = {
  agents: {
    path: "AGENTS.md",
    description: "Open agent instructions standard",
  },
  claude: {
    path: "CLAUDE.md",
    description: "Claude Code project instructions",
  },
  copilot: {
    path: ".github/copilot-instructions.md",
    description: "GitHub Copilot repository instructions",
  },
};

function parseArgs(argv) {
  const { opts: global, rest } = parseGlobalFlags(argv);
  const sub = rest[0] && !rest[0].startsWith("-") ? rest[0] : "list";
  const opts = { ...global, sub, names: [], all: false, dryRun: false, json: false };

  for (let i = sub === rest[0] ? 1 : 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--all") opts.all = true;
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--json") opts.json = true;
    else if (!arg.startsWith("-")) opts.names.push(arg);
  }
  return opts;
}

function adapterNames(opts) {
  const names = opts.all ? Object.keys(ADAPTERS) : opts.names;
  if (opts.sub === "install" && names.length === 0) return ["agents"];
  const unknown = names.filter((name) => !ADAPTERS[name]);
  if (unknown.length) {
    throw new Error(`Unknown adapter(s): ${unknown.join(", ")}. Use: ${Object.keys(ADAPTERS).join("|")}`);
  }
  return names;
}

function mergeManagedBlock(existing) {
  const start = existing.indexOf(START);
  const end = existing.indexOf(END);
  if ((start >= 0) !== (end >= 0) || (start >= 0 && end < start)) {
    throw new Error("existing Context OS managed block is malformed");
  }
  if (start >= 0) {
    return `${existing.slice(0, start)}${INSTRUCTIONS}${existing.slice(end + END.length)}`;
  }
  const prefix = existing.length ? `${existing.trimEnd()}\n\n` : "";
  return `${prefix}${INSTRUCTIONS}\n`;
}

function installOne(root, name, { dryRun }) {
  const adapter = ADAPTERS[name];
  const full = path.join(root, adapter.path);
  const exists = fs.existsSync(full);
  const existing = exists ? fs.readFileSync(full, "utf8") : "";
  const content = mergeManagedBlock(existing);

  const action = !exists ? "create" : content === existing ? "unchanged" : "update";
  if (!dryRun && action !== "unchanged") {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return { name, path: adapter.path, action };
}

function status(root) {
  return Object.entries(ADAPTERS).map(([name, adapter]) => {
    const full = path.join(root, adapter.path);
    if (!fs.existsSync(full)) return { name, path: adapter.path, installed: false, managed: false };
    const text = fs.readFileSync(full, "utf8");
    const managed = text.includes(START) && text.includes(END);
    return { name, path: adapter.path, installed: true, managed };
  });
}

export async function cmdAdapters(argv) {
  const opts = parseArgs(argv);

  if (opts.sub === "list") {
    const adapters = Object.entries(ADAPTERS).map(([name, adapter]) => ({
      name,
      path: adapter.path,
      description: adapter.description,
    }));
    if (opts.json) console.log(JSON.stringify({ ok: true, adapters }, null, 2));
    else for (const adapter of adapters) {
      console.log(`${adapter.name}\t${adapter.path}\t${adapter.description}`);
    }
    return;
  }

  if (opts.sub === "status") {
    const report = status(opts.root);
    if (opts.json) console.log(JSON.stringify({ ok: true, root: opts.root, adapters: report }, null, 2));
    else for (const item of report) {
      console.log(`${item.installed ? (item.managed ? "ok" : "unmanaged") : "missing"}: ${item.name} (${item.path})`);
    }
    return;
  }

  if (opts.sub !== "install") {
    throw new Error("Usage: context-os adapters [list|status|install] [names...] [--all] [--root dir] [--dry-run]");
  }

  const results = adapterNames(opts).map((name) => installOne(opts.root, name, opts));
  for (const result of results) {
    console.log(`${opts.dryRun ? "would " : ""}${result.action}: ${result.name} (${result.path})`);
  }
}
