/** Portable Hermes-style graph index builder for Condition C */
import fs from "node:fs";
import path from "node:path";

const DEFAULT_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".swift",
  ".md",
  ".json",
  ".sql",
  ".yaml",
  ".yml",
];

const DEFAULT_EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  ".build",
  ".swiftpm",
  "dist",
  "build",
  "coverage",
  ".next",
  "vendor",
  "context-os/eval/results",
  "context-os/eval/export",
]);

function rel(root, abs) {
  return path.relative(root, abs).replace(/\\/g, "/");
}

function tokenize(text) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 2)
    ),
  ];
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadGraphConfig(projectRoot) {
  const configPath = path.join(projectRoot, "context-os/graph/graph-config.json");
  const stubPath = path.join(projectRoot, "context-os/graph/graph-config.stub.json");
  const raw = readJsonIfExists(configPath) ?? readJsonIfExists(stubPath);
  return {
    includeRoots: raw?.includeRoots ?? ["README.md", "package.json"],
    includeDirs: raw?.includeDirs ?? [
      { dir: "src", extensions: DEFAULT_EXTENSIONS },
      { dir: "docs", extensions: [".md"] },
    ],
    excludeDirNames: raw?.excludeDirNames ?? [...DEFAULT_EXCLUDE_DIRS],
    excludePathContains: raw?.excludePathContains ?? ["context-os/eval/results/"],
    maxPreviewChars: raw?.maxPreviewChars ?? 2000,
    keywordLinkThreshold: raw?.keywordLinkThreshold ?? 3,
  };
}

function shouldSkipDir(name, config) {
  return config.excludeDirNames.includes(name);
}

function walkProjectFiles(projectRoot, config) {
  const files = [];
  const extSet = new Set(
    config.includeDirs.flatMap((d) => d.extensions ?? DEFAULT_EXTENSIONS)
  );

  for (const rootRel of config.includeRoots ?? []) {
    const abs = path.join(projectRoot, rootRel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) files.push(abs);
  }

  for (const { dir, extensions } of config.includeDirs ?? []) {
    const exts = new Set(extensions ?? DEFAULT_EXTENSIONS);
    walkDir(path.join(projectRoot, dir), exts, files, config);
  }

  return [...new Set(files)].filter((abs) => {
    const r = rel(projectRoot, abs);
    return !config.excludePathContains.some((bit) => r.includes(bit));
  });
}

function walkDir(dir, extensions, files, config) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") && name !== ".github") continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (shouldSkipDir(name, config)) continue;
      walkDir(full, extensions, files, config);
    } else if ([...extensions].some((ext) => name.endsWith(ext))) {
      files.push(full);
    }
  }
}

function parseImports(content, ext) {
  const targets = [];
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext)) {
    const re = /(?:from|import)\s+["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(content))) targets.push(m[1]);
  } else if (ext === ".py") {
    const re = /(?:from|import)\s+([a-zA-Z0-9_.]+)/g;
    let m;
    while ((m = re.exec(content))) targets.push(m[1]);
  } else if (ext === ".swift") {
    const re = /^import\s+([A-Za-z0-9_]+)/gm;
    let m;
    while ((m = re.exec(content))) targets.push(m[1]);
  }
  return targets;
}

function resolveImport(fromAbs, spec, projectRoot) {
  if (spec.startsWith(".") || spec.startsWith("@/")) {
    const base = path.dirname(fromAbs);
    let candidate = spec.startsWith("@/")
      ? path.join(projectRoot, "src", spec.slice(2))
      : path.resolve(base, spec);
    const tryPaths = [
      candidate,
      `${candidate}.ts`,
      `${candidate}.tsx`,
      `${candidate}.js`,
      `${candidate}.jsx`,
      path.join(candidate, "index.ts"),
      path.join(candidate, "index.js"),
    ];
    for (const p of tryPaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return rel(projectRoot, p);
      }
    }
  }
  return null;
}

function extractCoreSources(markdown, projectRoot) {
  const paths = [];
  const patterns = [
    /file:\/\/([^\)\s\|]+)/g,
    /`((?:src|docs|app|lib|core|tools|migrations|packages)[^`]+\.[a-z]+)`/gi,
    /\|\s*(?:document|code|file)\s*\|\s*`?([^\s|`]+\.[a-z]+)`?\s*\|/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(markdown))) {
      let p = m[1].trim();
      if (p.startsWith("file://")) p = decodeURIComponent(p.slice(7));
      const abs = path.isAbsolute(p) ? p : path.join(projectRoot, p);
      if (fs.existsSync(abs)) {
        const r = rel(projectRoot, abs);
        if (!paths.includes(r)) paths.push(r);
      }
    }
  }
  return paths;
}

function keywordOverlap(a, b) {
  const setB = new Set(b);
  let n = 0;
  for (const k of a) {
    if (setB.has(k)) n++;
  }
  return n;
}

/**
 * @param {object} opts
 * @param {string} opts.projectRoot
 * @param {object} opts.manifest
 * @param {string} [opts.outPath]
 * @param {object} [opts.config]
 */
export function buildGraphIndex(opts) {
  const projectRoot = path.resolve(opts.projectRoot);
  const config = opts.config ?? loadGraphConfig(projectRoot);
  const outPath =
    opts.outPath ?? path.join(projectRoot, "context-os/graph/graph-index.json");

  const nodes = new Map();
  const edges = [];

  function addNode(id, node) {
    if (!nodes.has(id)) nodes.set(id, node);
    else Object.assign(nodes.get(id), node);
  }

  const coreEntries = [
    ...Object.entries(opts.manifest.cores ?? {}).map(([id, filePath]) => ({
      id,
      filePath,
      parent: null,
    })),
    ...Object.entries(opts.manifest.subcores ?? {}).map(([id, filePath]) => ({
      id,
      filePath,
      parent: "subcore",
    })),
  ];

  for (const { id, filePath } of coreEntries) {
    const absCore = path.join(projectRoot, filePath);
    let coreText = "";
    let sourcePaths = [];
    if (fs.existsSync(absCore)) {
      coreText = fs.readFileSync(absCore, "utf8");
      sourcePaths = extractCoreSources(coreText, projectRoot);
    }
    const keywords = tokenize(`${id} ${coreText.slice(0, 4000)}`);
    addNode(`concept:${id}`, {
      id: `concept:${id}`,
      type: "concept",
      label: id,
      keywords,
      source: filePath,
    });
    for (const p of sourcePaths) {
      const fid = `file:${p}`;
      edges.push({ from: `concept:${id}`, to: fid, kind: "documents" });
    }
  }

  const anchorsPath = path.join(projectRoot, "context-os/graph/anchors.json");
  if (fs.existsSync(anchorsPath)) {
    const anchors = JSON.parse(fs.readFileSync(anchorsPath, "utf8"));
    for (const [conceptKey, paths] of Object.entries(anchors)) {
      const cid = conceptKey.includes("-core")
        ? `concept:${conceptKey}`
        : `concept:${conceptKey}-core`;
      if (!nodes.has(cid)) continue;
      for (const p of paths) {
        const fid = `file:${p}`;
        edges.push({ from: cid, to: fid, kind: "anchors" });
      }
    }
  }

  const projectFiles = walkProjectFiles(projectRoot, config);
  const contextOsFiles = walkProjectFiles(projectRoot, {
    ...config,
    includeRoots: [],
    includeDirs: [
      { dir: "context-os/cores", extensions: [".md"] },
      { dir: "context-os/subcores", extensions: [".md"] },
      { dir: "context-os/router", extensions: [".md", ".json"] },
    ],
  });

  for (const abs of [...new Set([...projectFiles, ...contextOsFiles])]) {
    const r = rel(projectRoot, abs);
    const content = fs.readFileSync(abs, "utf8");
    const ext = path.extname(abs);
    const basename = path.basename(r, ext);
    const keywords = tokenize(
      `${r} ${basename} ${content.slice(0, config.maxPreviewChars)}`
    );
    addNode(`file:${r}`, {
      id: `file:${r}`,
      type: "file",
      label: r,
      path: r,
      keywords,
      chars: content.length,
    });

    for (const spec of parseImports(content, ext)) {
      const target = resolveImport(abs, spec, projectRoot);
      if (target) {
        edges.push({ from: `file:${r}`, to: `file:${target}`, kind: "imports" });
      }
    }
  }

  for (const [cid, concept] of nodes) {
    if (concept.type !== "concept") continue;
    for (const [fid, fileNode] of nodes) {
      if (fileNode.type !== "file") continue;
      const overlap = keywordOverlap(concept.keywords ?? [], fileNode.keywords ?? []);
      if (overlap >= config.keywordLinkThreshold) {
        const exists = edges.some(
          (e) => e.from === cid && e.to === fid && e.kind === "keyword_overlap"
        );
        if (!exists) {
          edges.push({ from: cid, to: fid, kind: "keyword_overlap", score: overlap });
        }
      }
    }
  }

  const index = {
    version: "1.0.0",
    style: "hermes-graph",
    description:
      "Pre-indexed code graph for Condition C: entity relationships + source retrieval",
    built_at: new Date().toISOString(),
    project_root: projectRoot,
    stats: {
      nodes: nodes.size,
      edges: edges.length,
      files: [...nodes.values()].filter((n) => n.type === "file").length,
      concepts: [...nodes.values()].filter((n) => n.type === "concept").length,
    },
    nodes: [...nodes.values()],
    edges,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2));

  return { outPath, stats: index.stats };
}
