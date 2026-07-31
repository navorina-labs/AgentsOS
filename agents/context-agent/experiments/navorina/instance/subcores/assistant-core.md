# Assistant Core

## Purpose

Контекст AI-ассистента: чат, Sphere, голос, AI usage limits, prompts, structured memory RAG. Subcore Product + Technical.

## Covers

- Assistant page: `assistant.html`, React mount
- Chat: `chat.ts`, `Chat`, `ChatInput`, `ChatMessage`
- 3D Sphere: `Sphere`, `sphere-microphone.ts`, `sphere-visibility.ts`
- Voice: STT/TTS utils, audio analyzer
- Message limits: `message-limits` settings
- AI agents server-side: verdict, money leak, trade review, brief, OCR hints
- AI limits: `ai-limits.js`, `fm-ai-usage.js`, per-tier monthly caps
- Structured memory RAG: `structured-memory-prompt.js`, client sync
- App Suite: command palette, in-app tool open (⌘K)
- Prompts: `prompts.ts`

## Does not cover

- Nucleus tab UI (non-chat) → Nucleus Core
- Stripe billing → Billing Core

## Key entities

| Сущность | Описание |
|----------|----------|
| **Sphere** | 3D particle visualization |
| **fm-ai-usage** | Monthly AI call tracking |
| **ai-limits.js** | Per-agent limits by tier |
| **financial_verdict_ai** | Pro AI feature |
| **structured memory** | RAG context for chat |
| **appsuite-command-palette** | ⌘K tool search |

## Key files

| Путь | Роль |
|------|------|
| `Navorina/assistant.html` | Entry page |
| `Navorina/src/core/chat.ts` | Chat engine |
| `Navorina/src/components/Sphere.tsx` | 3D sphere |
| `Navorina/src/utils/prompts.ts` | System prompts |
| `Navorina/src/utils/message-limits.ts` | Chat limits |
| `Navorina/src/utils/nucleus-structured-memory-hub.ts` | Memory hub |
| `server/ai-limits.js` | Server limits |
| `server/db/fm-ai-usage.js` | Usage DB |
| `server/agents/` | LLM agents |
| `Navorina/src/utils/appsuite-command-palette.ts` | Command palette |

## Key docs

- `docs/planning/DEVELOPMENT_PLAN_LLMs_in_Finance.md`
- `docs/planning/AGENTS_ARCHITECTURE.md`
- `docs/guides/VOICE_SETTINGS_GUIDE.md`
- `docs/guides/AI_OPTIMIZATION_GUIDE.md`
- `package.json` keywords (offline, ollama, whisper — legacy positioning)

## Risks

- **API cost** — Pro users can hit limits (`ai-limits.js`)
- **Chat vs Nucleus context** — roadmap says contextual AI in FM, not isolated chat
- **Offline LLM setup** — docs mention ollama/whisper; may be stale vs cloud AI path

## Dependencies

- paywall-core (AI feature gates)
- nucleus-core (FM context for RAG)
- technical-core (AI routes)

## AI summary

Assistant = `assistant.html` + `chat.ts` + **Sphere** + voice utils. Server AI: `server/agents/*` guarded by **paywall** + **ai-limits.js**. Memory: structured-memory hub + RAG. For limits errors: check tier + `fm-ai-usage`. App Suite palette links tools — `appsuite-command-palette.ts`.

## Sources

- `Navorina/assistant.html`
- `Navorina/src/core/chat.ts`
- `server/ai-limits.js`
- `server/agents/`
- `docs/planning/AGENTS_ARCHITECTURE.md`
- `docs/planning/DEVELOPMENT_PLAN_LLMs_in_Finance.md`
- `package.json`
