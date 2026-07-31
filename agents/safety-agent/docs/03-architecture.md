# 03. Архитектура SafetyOS

## 1. Обзор

```
┌─────────────────────────────────────────────────────────────┐
│                         CLI (safetyos)                           │
│   validate │ analyze │ scan                                 │
└────────────┬───────────────────────┬──────────────────────┘
             │                       │
    ┌────────▼────────┐     ┌────────▼────────┐
    │  Threat Model   │     │  Crypto Scanner │
    │  Parser (YAML)  │     │  (filesystem)   │
    └────────┬────────┘     └────────┬────────┘
             │                       │
    ┌────────▼───────────────────────▼────────┐
    │           Algorithm Registry               │
    │  (классификация: PQC / vulnerable / weak)  │
    └────────┬──────────────────────────────────┘
             │
    ┌────────▼────────┐     ┌──────────────────┐
    │  Mosca Engine   │────►│  Risk Scorer     │
    └────────┬────────┘     └────────┬─────────┘
             │                       │
    ┌────────▼────────┐     ┌────────▼─────────┐
    │ Policy Engine   │     │ Report Builder   │
    └─────────────────┘     └──────────────────┘
```

## 2. Модули (MVP)

| Модуль | Путь | Ответственность |
|--------|------|-----------------|
| Types | `src/types/` | Zod-схемы, экспорт типов |
| Parser | `src/parser/` | YAML → validated model |
| Registry | `src/registry/algorithms.ts` | Классы алгоритмов, парсинг имён |
| Mosca | `src/engine/mosca.ts` | \(x+y>z\), margin |
| Risk | `src/engine/risk-scorer.ts` | Score 0–100 по потоку |
| Policy | `src/engine/policy.ts` | Сопоставление `policies[]` |
| Scanner | `src/scanner/` | Regex/паттерны в исходниках |
| CLI | `src/cli/` | Команды, форматирование |

## 3. Risk score (логика)

Базовый score потока складывается из весов:

| Фактор | Вес (MVP) |
|--------|-----------|
| Есть `quantum_vulnerable` в key_exchange/signatures | +40 |
| `hndl_exposed` или `adversary.quantum_record` | +25 |
| `confidentiality_years` + migration &gt; horizon | +20 |
| Есть `weak` алгоритмы | +30 |
| Нет PQC в key_exchange при long/permanent storage | +15 |
| Только PQC / symmetric_safe | −20 (floor 0) |

Tier: `critical` ≥ 70, `high` ≥ 50, `medium` ≥ 30, `low` &lt; 30.

## 4. Scanner (MVP)

Статический поиск по файлам (`.ts`, `.js`, `.py`, `.go`, `.java`, `.yaml`, `.env.example`):

- `RSA`, `BEGIN RSA PRIVATE KEY`
- `ECDSA`, `secp256k1`, `prime256v1`
- `MD5`, `SHA1`, `DES`
- `AES-128` (предупреждение при long retention в threat model — связка в v2)

Выход: список находок с файлом и строкой → опционально merge в threat model (roadmap).

## 5. Расширения (после MVP)

- CBOM export (CycloneDX crypto component)
- OPA/Rego генерация из `policies`
- CI GitHub Action — отложено; сейчас локально: `npm run verify`, `safetyos gate`
- Интеграция liboqs для проверки поддержки в бинарниках
- LLM-модуль assurance (только локальный, без exfiltration)

## 6. Безопасность самого SafetyOS

- Не хранить секретные ключи; threat model — только метаданные.
- Scanner не выполняет код из сканируемых репозиториев.
- Зависимости минимальны: `yaml`, `zod`, `commander`.

Дорожная карта: [04-roadmap.md](04-roadmap.md).
