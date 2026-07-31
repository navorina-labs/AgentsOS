/**
 * DSL: свой/чужой (IFF) и язык ИИ — каналы и границы доверия.
 */
import { z } from "zod";

export const TrustClassSchema = z.enum(["own", "foreign", "unknown"]);

export const PartyKindSchema = z.enum([
  "team",
  "service",
  "model",
  "mcp",
  "user",
  "rag_source",
  "tool",
]);

export const FriendOrFoePartySchema = z.object({
  id: z.string().min(1),
  kind: PartyKindSchema,
  description: z.string().optional(),
});

export const IffRuleSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  enforce: z.enum(["required", "recommended"]),
});

export const FriendOrFoeSchema = z.object({
  own: z.array(FriendOrFoePartySchema).min(1),
  foreign: z.array(FriendOrFoePartySchema).min(1),
  rules: z.array(IffRuleSchema).default([]),
});

export const AiChannelRoleSchema = z.enum(["instruction", "data", "tool_io"]);

export const AiLanguageChannelSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  trust: TrustClassSchema,
  role: AiChannelRoleSchema,
  delimiter_start: z.string().optional(),
  delimiter_end: z.string().optional(),
  strip_instruction_like: z.boolean().optional(),
  sanitize: z.boolean().optional(),
});

export const ForeignPatternActionSchema = z.enum([
  "strip",
  "strip_and_log",
  "reject",
  "block",
]);

export const ForeignPatternRuleSchema = z.object({
  pattern: z.string().min(1),
  action: ForeignPatternActionSchema.default("strip_and_log"),
});

export const AiLanguageRuleSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  enforce: z.enum(["required", "recommended"]),
});

export const AiLanguageSchema = z.object({
  channels: z.array(AiLanguageChannelSchema).min(1),
  foreign_patterns: z.array(ForeignPatternRuleSchema).default([]),
  rules: z.array(AiLanguageRuleSchema).default([]),
});

export const FlowAiContextSchema = z.object({
  channels: z.array(z.string().min(1)).min(1),
  trust: TrustClassSchema.optional(),
});

export const AiGovernanceSchema = z.object({
  friend_or_foe: FriendOrFoeSchema,
  ai_language: AiLanguageSchema,
});

export type TrustClass = z.infer<typeof TrustClassSchema>;
export type FriendOrFoe = z.infer<typeof FriendOrFoeSchema>;
export type AiLanguageChannel = z.infer<typeof AiLanguageChannelSchema>;
export type AiLanguage = z.infer<typeof AiLanguageSchema>;
export type AiGovernance = z.infer<typeof AiGovernanceSchema>;
export type FlowAiContext = z.infer<typeof FlowAiContextSchema>;
