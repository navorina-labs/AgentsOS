// Fixture: паттерны ИИ-слоя (секреты, слабый crypto)
export const OPENAI_API_KEY = "sk-proj-abcdefghijklmnopqrstuvwxyz123456";

export function weakCipher(data: string): string {
  const crypto = require("node:crypto");
  const c = crypto.createCipher("aes-128-cbc", "hardcoded-key");
  return c.update(data, "utf8", "hex") + c.final("hex");
}
