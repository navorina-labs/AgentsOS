# 02. Threat Model DSL

## 1. Назначение

YAML-описание организации: потоки данных, криптография, сроки хранения, профиль противника и политики. SafetyOS валидирует файл и считает **Mosca score** + рекомендации.

## 2. Верхний уровень

```yaml
version: "1"
organization:
  name: string
  migration_years: number      # y — оценка лет до полной PQC-миграции
  quantum_horizon_years: number # z — когда ожидается CRQC (консервативная оценка)

adversary:
  classical: boolean
  quantum_record: boolean      # HNDL: перехват ciphertext вероятен
  ai_implementation: boolean   # усиленные атаки на код/конфиг

defaults:
  confidentiality_years: number

data_flows: [...]
policies: [...]

ai_governance:   # опционально; обязателен логически при ai_implementation: true
  friend_or_foe: ...
  ai_language: ...
```

## 3. Поток данных (`data_flows[]`)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | Уникальный идентификатор |
| `name` | string | Человекочитаемое имя |
| `confidentiality_years` | number? | \(x\); если нет — из `defaults` |
| `storage` | enum | `ephemeral` \| `short` \| `long` \| `permanent` |
| `hndl_exposed` | boolean? | Явный перехват ciphertext |
| `crypto` | object | Текущие алгоритмы |
| `crypto.key_exchange` | string[] | e.g. `RSA-2048`, `ECDHE-P256`, `ML-KEM-768` |
| `crypto.signatures` | string[] | e.g. `ECDSA`, `ML-DSA-65` |
| `crypto.symmetric` | string[] | e.g. `AES-256-GCM` |
| `crypto.hash` | string[] | e.g. `SHA-256` |
| `tags` | string[] | Для политик и отчётов |
| `ai_context` | object? | Каналы языка ИИ для потока (`channels[]`, `trust`) |

Подробнее: [09-friend-foe-ai-language.md](./09-friend-foe-ai-language.md).

## 4. Классификация алгоритмов (встроенная)

Движок помечает алгоритмы:

| Уровень | Примеры |
|---------|---------|
| `quantum_vulnerable` | RSA-*, DSA, DH, ECDH, ECDSA, Ed25519 в контексте долгоживущих ключей согласования* |
| `pqc` | ML-KEM-*, ML-DSA-*, SLH-DSA-*, FN-DSA-* |
| `symmetric_safe` | AES-256-*, ChaCha20-* |
| `weak` | MD5, SHA-1, DES, 3DES, RSA-1024 |

\* Ed25519 для подписей не ломается Шором так же, как RSA, но для **key exchange** квант критичен; в DSL указывают явно по роли.

## 5. Политики (`policies[]`)

```yaml
policies:
  - id: no-rsa-long-retention
    when:
      retention_tier: long
      has_algorithm: RSA-2048
    action: block          # block | warn | recommend
    recommend:
      key_exchange: ML-KEM-768
      hybrid_with: X25519
```

## 6. Выход `analyze`

JSON/таблица:

- `mosca.at_risk` — boolean (\(x + y > z\))
- `mosca.margin_years` — \(x + y - z\)
- `flows[]` — score 0–100, tier, findings, recommendations
- `summary` — counts по tier

## 7. Пример

См. [examples/sample-threat-model.yaml](../examples/sample-threat-model.yaml).

## 8. CLI

| Команда | Действие |
|---------|----------|
| `safetyos init` | Шаблон `safetyos/threat-model.yaml` |
| `safetyos draft <dir>` | Черновик из scan |
| `safetyos validate` / `safetyos analyze` | Проверка и риск-скоринг |
| `safetyos analyze --html out.html` | HTML-отчёт |
| `safetyos scan <dir>` | Поиск слабой криптографии в коде |
| `safetyos run` | scan + analyze + `reports/*` |

## 9. Валидация

JSON Schema: [schemas/threat-model.schema.json](../schemas/threat-model.schema.json).  
Runtime: Zod в `src/types/threat-model.ts`.
