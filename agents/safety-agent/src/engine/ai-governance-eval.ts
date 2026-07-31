/**
 * Оценка IFF (свой/чужой) и языка ИИ в threat model.
 */
import type { DataFlow, ThreatModel } from "../types/threat-model.js";
import type { AiGovernance, AiLanguageChannel } from "../types/ai-governance.js";

export type GovernanceSeverity = "ok" | "warn" | "fail";

export interface GovernanceFinding {
  code: string;
  severity: GovernanceSeverity;
  message: string;
}

export interface AiGovernanceReport {
  configured: boolean;
  friend_or_foe: {
    own_count: number;
    foreign_count: number;
    required_rules: number;
    findings: GovernanceFinding[];
  };
  ai_language: {
    channel_count: number;
    instruction_channels: string[];
    foreign_channels: string[];
    findings: GovernanceFinding[];
  };
  flow_bindings: {
    flows_with_ai_context: number;
    flows_missing_context: string[];
    findings: GovernanceFinding[];
  };
  operator_summary: string[];
}

const AI_FLOW_TAG_HINTS = ["ai", "llm", "rag", "agent", "copilot", "mcp"];

/** Проверка regex для Node (без PCRE (?i) — флаг i отдельно). */
function isValidForeignPattern(pattern: string): boolean {
  try {
    const body = pattern.replace(/^\(\?i\)/, "");
    new RegExp(body, "i");
    return true;
  } catch {
    return false;
  }
}

function flowTouchesAi(flow: DataFlow): boolean {
  const tags = flow.tags ?? [];
  return tags.some((t) =>
    AI_FLOW_TAG_HINTS.some((h) => t.toLowerCase().includes(h)),
  );
}

function evaluateFriendOrFoe(gov: AiGovernance): GovernanceFinding[] {
  const findings: GovernanceFinding[] = [];
  const { friend_or_foe: iff } = gov;

  const ownIds = new Set(iff.own.map((p) => p.id));
  const foreignIds = new Set(iff.foreign.map((p) => p.id));
  for (const id of ownIds) {
    if (foreignIds.has(id)) {
      findings.push({
        code: "iff-id-collision",
        severity: "fail",
        message: `id «${id}» одновременно в own и foreign`,
      });
    }
  }

  const required = iff.rules.filter((r) => r.enforce === "required");
  if (required.length < 2) {
    findings.push({
      code: "iff-few-rules",
      severity: "warn",
      message: "рекомендуется ≥2 required-правил IFF (инструкции, секреты, tools)",
    });
  }

  const hasInstructRule = iff.rules.some((r) =>
    /инструкц|instruct/i.test(r.statement),
  );
  const hasSecretRule = iff.rules.some((r) =>
    /секрет|ключ|secret|pem/i.test(r.statement),
  );
  if (!hasInstructRule) {
    findings.push({
      code: "iff-missing-instruct-rule",
      severity: "warn",
      message: "нет явного правила: чужой не задаёт инструкции",
    });
  }
  if (!hasSecretRule) {
    findings.push({
      code: "iff-missing-secret-rule",
      severity: "warn",
      message: "нет явного правила: секреты только для своих",
    });
  }

  return findings;
}

function channelNeedsDelimiter(ch: AiLanguageChannel): boolean {
  return ch.trust === "foreign" && ch.role === "data";
}

function evaluateAiLanguage(gov: AiGovernance): GovernanceFinding[] {
  const findings: GovernanceFinding[] = [];
  const { ai_language: lang } = gov;
  const ids = new Set<string>();

  for (const ch of lang.channels) {
    if (ids.has(ch.id)) {
      findings.push({
        code: "lang-duplicate-channel",
        severity: "fail",
        message: `дублируется канал «${ch.id}»`,
      });
    }
    ids.add(ch.id);

    if (ch.role === "instruction" && ch.trust !== "own") {
      findings.push({
        code: "lang-instruction-not-own",
        severity: "fail",
        message: `канал «${ch.id}»: instruction при trust=${ch.trust} (должен own)`,
      });
    }

    if (channelNeedsDelimiter(ch)) {
      if (!ch.delimiter_start || !ch.delimiter_end) {
        findings.push({
          code: "lang-foreign-no-delimiter",
          severity: "fail",
          message: `канал «${ch.id}»: foreign data без delimiter_start/end`,
        });
      }
      if (!ch.strip_instruction_like && ch.id === "rag") {
        findings.push({
          code: "lang-rag-no-strip",
          severity: "warn",
          message: "канал rag: включите strip_instruction_like",
        });
      }
    }

    if (ch.trust === "unknown" && ch.role === "tool_io" && !ch.sanitize) {
      findings.push({
        code: "lang-tool-no-sanitize",
        severity: "warn",
        message: `канал «${ch.id}»: tool_io/unknown без sanitize`,
      });
    }
  }

  const hasOwnInstruction = lang.channels.some(
    (c) => c.trust === "own" && c.role === "instruction",
  );
  if (!hasOwnInstruction) {
    findings.push({
      code: "lang-no-own-instruction",
      severity: "fail",
      message: "нет канала own + instruction (system/developer)",
    });
  }

  if (lang.foreign_patterns.length === 0) {
    findings.push({
      code: "lang-no-injection-patterns",
      severity: "warn",
      message: "foreign_patterns пуст — добавьте сигнатуры prompt injection",
    });
  }

  for (const fp of lang.foreign_patterns) {
    if (!isValidForeignPattern(fp.pattern)) {
      findings.push({
        code: "lang-invalid-regex",
        severity: "fail",
        message: `невалидный regex (JS): ${fp.pattern}`,
      });
    }
  }

  return findings;
}

function evaluateFlowBindings(
  model: ThreatModel,
  gov: AiGovernance,
): {
  flows_with_ai_context: number;
  flows_missing_context: string[];
  findings: GovernanceFinding[];
} {
  const findings: GovernanceFinding[] = [];
  const channelIds = new Set(gov.ai_language.channels.map((c) => c.id));
  let withCtx = 0;
  const missing: string[] = [];

  for (const flow of model.data_flows) {
    const aiTagged = flowTouchesAi(flow);
    if (!aiTagged) continue;

    if (!flow.ai_context) {
      missing.push(flow.id);
      continue;
    }
    withCtx++;
    for (const ch of flow.ai_context.channels) {
      if (!channelIds.has(ch)) {
        findings.push({
          code: "flow-unknown-channel",
          severity: "fail",
          message: `поток «${flow.id}»: канал «${ch}» не объявлен в ai_language`,
        });
      }
    }
    if (flow.ai_context.trust === "own" && flow.ai_context.channels.includes("rag")) {
      findings.push({
        code: "flow-own-with-rag",
        severity: "warn",
        message: `поток «${flow.id}»: trust=own но канал rag — проверьте IFF`,
      });
    }
  }

  if (missing.length > 0) {
    findings.push({
      code: "flow-ai-tag-no-context",
      severity: "warn",
      message: `потоки с AI-тегами без ai_context: ${missing.join(", ")}`,
    });
  }

  return {
    flows_with_ai_context: withCtx,
    flows_missing_context: missing,
    findings,
  };
}

export function buildAiGovernanceReport(model: ThreatModel): AiGovernanceReport {
  const empty: AiGovernanceReport = {
    configured: false,
    friend_or_foe: { own_count: 0, foreign_count: 0, required_rules: 0, findings: [] },
    ai_language: {
      channel_count: 0,
      instruction_channels: [],
      foreign_channels: [],
      findings: [],
    },
    flow_bindings: {
      flows_with_ai_context: 0,
      flows_missing_context: [],
      findings: [],
    },
    operator_summary: [],
  };

  if (!model.adversary.ai_implementation) {
    empty.operator_summary.push("ai_implementation=false — IFF/язык ИИ не оцениваются");
    return empty;
  }

  if (!model.ai_governance) {
    return {
      ...empty,
      configured: false,
      friend_or_foe: {
        ...empty.friend_or_foe,
        findings: [
          {
            code: "governance-missing",
            severity: "fail",
            message:
              "adversary.ai_implementation=true, но нет ai_governance — задайте свой/чужой и язык ИИ",
          },
        ],
      },
      operator_summary: [
        "Добавьте ai_governance (safetyos init даёт шаблон) или отключите ai_implementation",
      ],
    };
  }

  const gov = model.ai_governance;
  const iffFindings = evaluateFriendOrFoe(gov);
  const langFindings = evaluateAiLanguage(gov);
  const flow = evaluateFlowBindings(model, gov);

  const instruction_channels = gov.ai_language.channels
    .filter((c) => c.role === "instruction")
    .map((c) => c.id);
  const foreign_channels = gov.ai_language.channels
    .filter((c) => c.trust === "foreign")
    .map((c) => c.id);

  const allFindings = [
    ...iffFindings,
    ...langFindings,
    ...flow.findings,
  ];
  const fails = allFindings.filter((f) => f.severity === "fail").length;

  const operator_summary = [
    `Свой: ${gov.friend_or_foe.own.length} субъектов, чужой: ${gov.friend_or_foe.foreign.length}`,
    `Язык ИИ: ${gov.ai_language.channels.length} каналов (instruction: ${instruction_channels.join(", ") || "—"})`,
    `Foreign-каналы: ${foreign_channels.join(", ") || "—"}`,
    fails > 0
      ? `Исправить ${fails} fail до prod-агента`
      : "IFF/язык: структурно OK — внедрите в gateway и CI",
  ];

  return {
    configured: true,
    friend_or_foe: {
      own_count: gov.friend_or_foe.own.length,
      foreign_count: gov.friend_or_foe.foreign.length,
      required_rules: gov.friend_or_foe.rules.filter((r) => r.enforce === "required")
        .length,
      findings: iffFindings,
    },
    ai_language: {
      channel_count: gov.ai_language.channels.length,
      instruction_channels,
      foreign_channels,
      findings: langFindings,
    },
    flow_bindings: flow,
    operator_summary,
  };
}

export function governanceWorstSeverity(
  report: AiGovernanceReport,
): GovernanceSeverity {
  const all = [
    ...report.friend_or_foe.findings,
    ...report.ai_language.findings,
    ...report.flow_bindings.findings,
  ];
  if (all.some((f) => f.severity === "fail")) return "fail";
  if (all.some((f) => f.severity === "warn")) return "warn";
  return "ok";
}
