/** Structural validation for routing-map.json and manifest.json */
export function validateRoutingMap(map, manifest) {
  const errors = [];
  const warnings = [];

  if (!map || typeof map !== "object") {
    errors.push("routing-map: not an object");
    return { errors, warnings };
  }

  if (!map.version || typeof map.version !== "string") {
    warnings.push("routing-map: missing version");
  } else if (!/^\d+\.\d+\.\d+$/.test(map.version)) {
    warnings.push("routing-map: version should be semver-like, e.g. 1.0.0");
  }

  if (!Array.isArray(map.routes) || map.routes.length === 0) {
    errors.push("routing-map: routes[] must be a non-empty array");
  } else {
    const knownCores = new Set([
      ...Object.keys(manifest.cores ?? {}),
      ...Object.keys(manifest.subcores ?? {}),
    ]);

    map.routes.forEach((route, i) => {
      if (!Array.isArray(route.patterns) || route.patterns.length === 0) {
        errors.push(`routing-map.routes[${i}]: patterns[] required`);
      } else {
        route.patterns.forEach((pattern, j) => {
          if (typeof pattern !== "string" || pattern.trim().length === 0) {
            errors.push(`routing-map.routes[${i}].patterns[${j}]: non-empty string required`);
          }
        });
      }
      if (!Array.isArray(route.cores) || route.cores.length === 0) {
        errors.push(`routing-map.routes[${i}]: cores[] required`);
      } else {
        for (const core of route.cores) {
          if (typeof core !== "string" || !/^[a-z][a-z0-9-]*$/.test(core)) {
            errors.push(`routing-map.routes[${i}]: invalid core id "${core}"`);
            continue;
          }
          if (knownCores.size && !knownCores.has(core)) {
            warnings.push(`routing-map.routes[${i}]: unknown core "${core}"`);
          }
        }
      }
    });
  }

  if (map.fallback_core) {
    const known = new Set([
      ...Object.keys(manifest.cores ?? {}),
      ...Object.keys(manifest.subcores ?? {}),
    ]);
    if (known.size && !known.has(map.fallback_core)) {
      warnings.push(`routing-map: fallback_core "${map.fallback_core}" not in manifest`);
    }
  }

  return { errors, warnings };
}

export function validateManifestSchema(manifest) {
  const errors = [];
  const warnings = [];

  if (!manifest.version) warnings.push("manifest: missing version");
  else if (typeof manifest.version !== "string" || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    warnings.push("manifest: version should be semver-like, e.g. 1.0.0");
  }
  if (!manifest.project || typeof manifest.project !== "string") {
    warnings.push("manifest: project should be a non-empty string");
  }
  if (!manifest.cores || Object.keys(manifest.cores).length === 0) {
    errors.push("manifest: cores{} required");
  }
  if (!manifest.routing_map && !manifest.router) {
    warnings.push("manifest: no router or routing_map path");
  }

  for (const [id, rel] of Object.entries(manifest.cores ?? {})) {
    if (!id.endsWith("-core")) {
      warnings.push(`manifest.cores.${id}: id should end with -core`);
    }
    if (typeof rel !== "string" || !rel.endsWith(".md")) {
      warnings.push(`manifest.cores.${id}: path should be .md file`);
    }
  }

  for (const [id, rel] of Object.entries(manifest.subcores ?? {})) {
    if (!id.endsWith("-core")) {
      warnings.push(`manifest.subcores.${id}: id should end with -core`);
    }
    if (typeof rel !== "string" || !rel.endsWith(".md")) {
      warnings.push(`manifest.subcores.${id}: path should be .md file`);
    }
  }

  return { errors, warnings };
}

export function validateQuestionsBank(bank, manifest) {
  const errors = [];
  const warnings = [];
  const questions = Array.isArray(bank) ? bank : bank?.questions;

  if (!Array.isArray(questions)) {
    errors.push("questions: expected an array or { questions: [...] }");
    return { errors, warnings };
  }
  if (questions.length === 0) {
    warnings.push("questions: empty question bank");
  }

  const knownCores = new Set([
    ...Object.keys(manifest.cores ?? {}),
    ...Object.keys(manifest.subcores ?? {}),
  ]);
  const seenIds = new Set();

  questions.forEach((q, i) => {
    const id = q?.id ?? q?.question_id;
    if (!id || typeof id !== "string") {
      errors.push(`questions[${i}]: id required`);
    } else if (seenIds.has(id)) {
      errors.push(`questions[${i}]: duplicate id "${id}"`);
    } else {
      seenIds.add(id);
    }

    if (!q?.question || typeof q.question !== "string") {
      errors.push(`questions[${i}]: question required`);
    }

    if (!Array.isArray(q?.expected_cores) || q.expected_cores.length === 0) {
      errors.push(`questions[${i}]: expected_cores[] required`);
    } else {
      for (const core of q.expected_cores) {
        if (typeof core !== "string" || !/^[a-z][a-z0-9-]*$/.test(core)) {
          errors.push(`questions[${i}]: invalid expected core "${core}"`);
        } else if (knownCores.size && !knownCores.has(core)) {
          warnings.push(`questions[${i}]: expected unknown core "${core}"`);
        }
      }
    }

    if (q.gold != null && !Array.isArray(q.gold)) {
      warnings.push(`questions[${i}]: gold should be an array when present`);
    }
  });

  return { errors, warnings };
}
