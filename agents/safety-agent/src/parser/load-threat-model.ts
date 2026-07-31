/**
 * Загрузка и валидация YAML threat model.
 */
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { ThreatModelSchema, type ThreatModel } from "../types/threat-model.js";

export class ThreatModelValidationError extends Error {
  constructor(
    message: string,
    readonly issues: string[],
  ) {
    super(message);
    this.name = "ThreatModelValidationError";
  }
}

export async function loadThreatModelFromFile(
  filePath: string,
): Promise<ThreatModel> {
  const text = await readFile(filePath, "utf8");
  return loadThreatModelFromString(text);
}

export function loadThreatModelFromString(yamlText: string): ThreatModel {
  const raw: unknown = parse(yamlText);
  const result = ThreatModelSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    throw new ThreatModelValidationError(
      `Invalid threat model: ${issues.length} issue(s)`,
      issues,
    );
  }

  return result.data;
}
