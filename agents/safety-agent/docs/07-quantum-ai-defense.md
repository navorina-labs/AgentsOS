# 07. Две оси защиты: квант и ИИ

SafetyOS держит **две независимые оси** — не смешивает их в один «общий риск».

## Ось A — Квант (математика + время)

| Угроза | Механизм в SafetyOS |
|--------|----------------|
| Шор ломает RSA/ECDH | `quantum_vulnerable` в registry |
| HNDL | `adversary.quantum_record`, `hndl_exposed` |
| Срок данных vs миграция | **Моска** \(x + y > z\) |
| Что внедрять | **NIST mapping** → ML-KEM, ML-DSA |
| Архивы | **reencrypt_queue** с приоритетом |

Команды: `analyze`, `quantum` внутри `assess`, `inventory tls`, `playbook`.

## Ось B — ИИ (реализация + операции)

ИИ **не** ломает AES-256 математически. ИИ ускоряет:

- утечку ключей и API tokens в репозиторий;
- MD5/SHA-1 и `createCipher` без AEAD в сгенерированном коде;
- слабые зависимости и пропуск ревью crypto-diff.

| Контроль | Механизм в SafetyOS |
|----------|----------------|
| Секреты LLM | scan: `openai-api-key`, `anthropic-api-key`, `hf_*` |
| Слабый код | scan: `custom-crypto`, `deprecated-crypto-lib` |
| Процессы | assurance: secret scanning CI, human review, RAG policy |

Активируется при `adversary.ai_implementation: true`.

## Единая оценка

```bash
safetyos assess threat-model.yaml --scan ./src --inventory-tls ./deploy
safetyos playbook -m threat-model.yaml --scan ./src -o reports/playbook.md
```

В отчёте:

1. **Квантовый слой** — HNDL, Моска, очередь re-encryption, NIST steps  
2. **ИИ-слой** — assurance checklist  
3. **Agility + Risk + TLS reconcile + CBOM**

## Принцип продукта

SafetyOS не обещает «невзламываемость». SafetyOS даёт **измеримый posture** и **playbook действий** под квант и под ИИ отдельно.
