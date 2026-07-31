/**
 * Шаблон IFF + язык ИИ для safetyos init / профилей.
 */
import type { AiGovernance } from "../types/ai-governance.js";

export const DEFAULT_AI_GOVERNANCE: AiGovernance = {
  friend_or_foe: {
    own: [
      { id: "platform", kind: "service", description: "Orchestrator, policy engine" },
      { id: "hsm-vault", kind: "service", description: "HSM / Vault — только свой контур" },
      { id: "approved-mcp", kind: "mcp", description: "MCP из allowlist" },
    ],
    foreign: [
      { id: "end-user", kind: "user", description: "Пользовательский ввод" },
      { id: "external-rag", kind: "rag_source", description: "Документы, тикеты, web" },
      { id: "third-party-model", kind: "model", description: "Ответы внешней модели без write" },
    ],
    rules: [
      {
        id: "iff-foreign-no-instruct",
        statement: "Чужой не может задавать инструкции агенту (только данные)",
        enforce: "required",
      },
      {
        id: "iff-secrets-own-only",
        statement: "Ключи и PEM не передаются в foreign-каналы и RAG",
        enforce: "required",
      },
      {
        id: "iff-tools-own-only",
        statement: "Опасные tools (shell, fs, network) — только от own orchestrator",
        enforce: "required",
      },
    ],
  },
  ai_language: {
    channels: [
      { id: "system", label: "Системный промпт", trust: "own", role: "instruction" },
      { id: "developer", label: "Developer", trust: "own", role: "instruction" },
      {
        id: "user",
        label: "Пользователь",
        trust: "foreign",
        role: "data",
        delimiter_start: "<<USER>>",
        delimiter_end: "<<END_USER>>",
      },
      {
        id: "rag",
        label: "RAG / документ",
        trust: "foreign",
        role: "data",
        delimiter_start: "<<UNTRUSTED>>",
        delimiter_end: "<<END_UNTRUSTED>>",
        strip_instruction_like: true,
      },
      {
        id: "tool",
        label: "Tool output",
        trust: "unknown",
        role: "tool_io",
        sanitize: true,
      },
    ],
    foreign_patterns: [
      { pattern: "ignore (all )?previous", action: "strip_and_log" },
      { pattern: "system\\s*:", action: "strip_and_log" },
      { pattern: "you are now", action: "reject" },
    ],
    rules: [
      {
        id: "lang-instruction-own-only",
        statement: "role=instruction только у каналов trust=own",
        enforce: "required",
      },
      {
        id: "lang-foreign-delimited",
        statement: "trust=foreign обязан иметь delimiter_start/end",
        enforce: "required",
      },
    ],
  },
};
