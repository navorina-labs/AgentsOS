# Свой / чужой (IFF) и язык ИИ

Расширение Threat Model DSL для **границ доверия** вокруг LLM-агентов и RAG. Активно при `adversary.ai_implementation: true`.

## 1. Свой / чужой (`ai_governance.friend_or_foe`)

| Класс | Кто | Может |
|-------|-----|--------|
| **Свой** (`own`) | Orchestrator, HSM/Vault, MCP из allowlist | Инструкции, опасные tools, доступ к секретам (через policy) |
| **Чужой** (`foreign`) | User input, RAG, внешняя модель | Только **данные**; не меняет system prompt и не вызывает tools |

Правила (`rules[]`) — декларативные требования с `enforce: required | recommended`. SafetyOS проверяет наличие правил про инструкции и секреты.

## 2. Язык ИИ (`ai_governance.ai_language`)

«Язык» — не natural language, а **типизированные каналы** сообщений в контексте агента:

| Поле канала | Смысл |
|-------------|--------|
| `id` | Идентификатор (`system`, `user`, `rag`, `tool`) |
| `trust` | `own` \| `foreign` \| `unknown` |
| `role` | `instruction` \| `data` \| `tool_io` |
| `delimiter_start` / `delimiter_end` | Обрамление чужого контента |
| `strip_instruction_like` | Вырезать «ignore previous» из RAG |
| `sanitize` | Санитизация вывода tools |

`foreign_patterns[]` — regex для prompt injection в чужих каналах (`strip`, `reject`, …).

**Инвариант:** `role: instruction` только при `trust: own`.  
**Инвариант:** `trust: foreign` + `role: data` → обязательны delimiters.

## 3. Привязка потоков (`data_flows[].ai_context`)

```yaml
tags: [ai, rag]
ai_context:
  channels: [user, rag]
  trust: foreign
```

Потоки с тегами `ai`, `llm`, `rag`, `agent`, `mcp`, `copilot` без `ai_context` → warning в `safetyos assess`.

## 4. CLI

```bash
safetyos init                    # шаблон ai_governance из коробки
safetyos assess -m threat-model.yaml
safetyos playbook -m threat-model.yaml
safetyos export opa -m threat-model.yaml   # + reports/ai-governance.rego
```

## 5. OPA

При `adversary.ai_implementation: true` команда `safetyos export opa` пишет второй файл **`ai-governance.rego`** (package `safetyos.ai`): отсутствие `ai_governance`, instruction на foreign-канале, delimiters, sanitize для tool.

```bash
safetyos export opa -m threat-model.yaml -o reports/policy.rego
# → reports/policy.rego, reports/ai-governance.rego
```

## 5. Внедрение в код продукта

1. Gateway собирает промпт только из объявленных каналов.
2. Foreign вставляется между delimiter; до LLM — фильтр `foreign_patterns`.
3. Tools с `network`/`shell` — только если caller ∈ `own`.
4. Секреты никогда не попадают в каналы `user`/`rag`.

См. также: `08-ai-vs-ai-defense.md`, `07-quantum-ai-defense.md`.
