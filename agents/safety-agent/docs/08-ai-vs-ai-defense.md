# ИИ против ИИ: атака и защита в SafetyOS

SafetyOS не утверждает, что LLM «взламывает AES». Слой B — **ИИ ускоряет ошибки и злоупотребления** вокруг криптографии и секретов. Этот документ — мысленный эксперимент: *вы — атакующий ИИ; цель — система, где защиту тоже строят с ИИ.*

## Модель атакующего ИИ

| Фаза | Действие | Почему ИИ быстрее человека |
|------|----------|----------------------------|
| Recon | Скан git, CI, docker, чаты на API keys | Масштаб и корреляция за минуты |
| Weaponize | PR с MD5, `createCipher`, старыми libs | Объём > capacity review |
| Deliver | Prompt injection в RAG, тикеты, email | Агент доверяет тексту в контексте |
| Exploit | Tool-calling: read `.env`, shell, MCP | Автоцепочка без усталости |
| Persist | Эксфиль из логов промптов провайдера | Люди вставляют секреты в чат |

**Не входит в слой B:** квантовый Shor, математический break AES — это слой A (см. `07-quantum-ai-defense.md`).

## Что бы сделал защищающийся (P0)

1. **Секреты вне контекста LLM** — HSM/Vault, redaction gateway, запрет PEM в чате.
2. **Allowlist инструментов агента** — нет произвольного shell/read home; approve на write.
3. **Границы RAG** — untrusted blocks, не выполнять инструкции из документов.
4. **Crypto gate на PR от LLM** — `safetyos scan`, CODEOWNERS, блок MD5/RSA-1024.
5. **Церемония ключей без LLM** — PQC migration sign-off только humans + HSM.

## P1 (следующий уровень)

- Регрессионные тесты prompt injection в CI.
- Пинning/trust registry для MCP.
- Политика telemetry: не логировать prompts с секретами.

## Связь с продуктом

- `adversary.ai_implementation: true` в threat model включает слой.
- `safetyos assess` / `safetyos playbook` — блок **ИИ против ИИ** с векторами и контрмерами.
- Срабатывания по scan (ключи, weak crypto) поднимают приоритет контрмер.

## Ограничения

SafetyOS даёт **чеклист и приоритизацию**, не заменяет pentest LLM-приложений и не сертифицирует модели.
