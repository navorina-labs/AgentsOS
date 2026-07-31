# 06. Защитный сервис SafetyOS

## Позиционирование

SafetyOS — **автономный аналитический сервис** криптографического жизненного цикла. Он не встраивается в runtime приложений и не заменяет TLS-библиотеки. Он отвечает на вопросы:

1. **Где** уязвимость (поток, алгоритм, файл)?
2. **Когда** наступает риск (Моска, HNDL)?
3. **Насколько** вы готовы к смене алгоритмов (agility)?
4. **Закрыт ли** слой реализации против ИИ-усиленных атак (assurance)?

## Архитектура сервиса

```
┌─────────────────────────────────────────────────────────────┐
│                    Threat Model DSL                          │
│  organization · adversary · data_flows · policies            │
└───────────────────────────┬─────────────────────────────────┘
                            │
     ┌──────────────────────┼──────────────────────┐
     │                      │                      │
┌────▼────┐          ┌──────▼──────┐        ┌──────▼──────┐
│ Profiles │          │ Risk Engine │        │  Scanner    │
│ fintech  │          │ Mosca       │        │  patterns   │
│ health   │          │ score/tier  │        │  secrets    │
│ gov      │          │ policies    │        │  weak crypto│
└────┬────┘          └──────┬──────┘        └──────┬──────┘
     │                      │                      │
     └──────────────────────┼──────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │         assess            │
              │  analyze + agility +      │
              │  assurance + CBOM         │
              └─────────────┬─────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐       ┌─────▼─────┐     ┌──────▼──────┐
    │  CBOM   │       │    OPA    │     │ HTML/JSON   │
    │ CycloneDX│      │   Rego    │     │  reports    │
    └─────────┘       └───────────┘     └─────────────┘
```

## Модули защиты

### 1. Квант (математика)

- Классификация алгоритмов: `pqc` | `quantum_vulnerable` | `symmetric_safe` | `weak`
- Неравенство Моски и HNDL-флаги
- Рекомендации ML-KEM / ML-DSA / hybrid

### 2. Crypto Agility Score (0–100)

| Фактор | Вес |
|--------|-----|
| Доля потоков с PQC KEX | 30 |
| Потоки без quantum-vulnerable | 25 |
| Declarative policies | 15 |
| Запас по Моске | 20 |
| Отсутствие critical flows | 10 |

Tier: `ready` ≥80 · `progressing` ≥55 · `at_risk` ≥30 · `critical` &lt;30

### 3. Assurance (слой B — ИИ и реализация)

Чеклист при `adversary.ai_implementation: true`:

- Нет ключей в репозитории (scan)
- Нет MD5/SHA-1 в коде
- Secret scanning в CI (review)
- Policies в threat model
- План re-encryption при HNDL

### 4. Отраслевые профили

| ID | Сценарий |
|----|----------|
| `fintech` | Долгий retention, HNDL, ML-KEM-1024 для permanent |
| `healthcare` | PHI 20y, строгий long-term |
| `government` | Консервативный z=7, CNSA-oriented |
| `startup-saas` | Короткий x, hybrid TLS |

### 5. Экспорт

- **CBOM** — CycloneDX 1.6, компоненты `cryptographic-asset`, связи flow → algo
- **OPA** — Rego из `policies[]` для внешнего gate (опционально)

## TLS Inventory (слой транспорта)

Парсинг **nginx**, **apache**, **traefik**, **k8s/cert-manager**, **.env**, **docker-compose**, **haproxy**:

- `ssl_protocols`, `ssl_ciphers`, `SSLProtocol`, `minTLSVersion`
- Вывод: протоколы, inferred KEX/symmetric, findings (TLSv1.0, MD5 в cipher list)
- **Reconcile**: сопоставление record ↔ `data_flows` — drift «в модели PQC, в nginx только ECDHE»
- **Suggest / apply**: `safetyos inventory suggest --apply` — crypto в YAML
- **Экспорт**: TLS в CBOM (`tls-config/*`) и playbook (секция 3)

```bash
safetyos inventory tls ./deploy/nginx
safetyos inventory reconcile -m threat-model.yaml --config ./deploy
safetyos inventory suggest -m threat-model.yaml --config ./deploy --apply
safetyos assess threat-model.yaml --inventory-tls ./deploy
safetyos export cbom -m threat-model.yaml --inventory-tls ./deploy
safetyos gate threat-model.yaml --inventory-tls ./deploy --max-tls-critical-drifts 0
```

## Команды сервиса

```bash
safetyos profile list
safetyos init -p fintech -n "Acme"
safetyos profile apply fintech -m threat-model.yaml
safetyos assess examples/sample-threat-model.yaml --scan examples/fixtures
safetyos assess examples/sample-threat-model.yaml --inventory-tls examples/tls-configs
safetyos export cbom -m examples/sample-threat-model.yaml
safetyos export opa -m examples/sample-threat-model.yaml
```

## Границы (что SafetyOS не делает)

- Не выполняет криптооперации и не хранит ключи заказчика
- Не заменяет HSM/KMS
- Не «взламывает» AES — только оценивает конфигурацию и код
- Не требует внедрения в продуктовый runtime

## Defense cycle (локально)

`safetyos cycle` — scan → enrich → опционально `--sync-tls` → assess → diff baseline. В каталог `-o`:

| Файл | Содержимое |
|------|------------|
| `assessment.json` | Полная оценка |
| `assessment-latest.html` | Dashboard |
| `cbom.json` | CycloneDX + TLS |
| `defense-playbook.md` | Квант + ИИ + TLS |
| `tls-reconcile.json` | Drift (при `--inventory-tls`) |
| `assess-diff.txt` | Регрессия vs baseline |

```bash
npm run safetyos -- cycle threat-model.yaml --scan src -o reports --save-baseline
npm run safetyos -- cycle threat-model.yaml --scan src --inventory-tls examples/tls-configs --sync-tls
npm run safetyos -- watch threat-model.yaml --scan src --inventory-tls deploy/ --sync-tls
```

## Dogfood (локально)

```bash
npm run safetyos -- gate threat-model.yaml --scan src
```

Модель SafetyOS описывает потоки scanner/engine/assurance/inventory как **catalog**, не prod-TLS. Учебные weak TLS — только в `examples/tls-configs/`.

## Следующие шаги

- Прогон на внешнем продуктовом репо (по запросу)
- npm publish / CI gate — отложено
