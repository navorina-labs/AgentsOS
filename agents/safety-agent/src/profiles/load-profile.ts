/**
 * Загрузка профилей из profiles/*.yaml
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { SecurityProfileSchema, type SecurityProfile } from "./types.js";

const PROFILES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../profiles",
);

export function getProfilesDirectory(): string {
  return PROFILES_DIR;
}

export async function listProfiles(): Promise<SecurityProfile[]> {
  const entries = await readdir(PROFILES_DIR);
  const profiles: SecurityProfile[] = [];

  for (const file of entries) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    profiles.push(await loadProfileById(file.replace(/\.ya?ml$/, "")));
  }

  return profiles.sort((a, b) => a.id.localeCompare(b.id));
}

export async function loadProfileById(id: string): Promise<SecurityProfile> {
  const candidates = [
    path.join(PROFILES_DIR, `${id}.yaml`),
    path.join(PROFILES_DIR, `${id}.yml`),
  ];

  for (const file of candidates) {
    try {
      const text = await readFile(file, "utf8");
      const raw: unknown = parse(text);
      const result = SecurityProfileSchema.safeParse(raw);
      if (!result.success) {
        const issues = result.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        );
        throw new Error(`Invalid profile ${id}: ${issues.join("; ")}`);
      }
      if (result.data.id !== id) {
        throw new Error(`Profile file ${id} has mismatched id: ${result.data.id}`);
      }
      return result.data;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw e;
    }
  }

  throw new Error(`Profile not found: ${id}`);
}
