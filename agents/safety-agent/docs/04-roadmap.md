# 04. Дорожная карта

## Фаза 0 — MVP (текущая)

- [x] Документация: анализ, threat model, архитектура
- [x] Threat Model DSL + JSON Schema + Zod
- [x] `safetyos validate` / `safetyos analyze`
- [x] Mosca engine + risk scorer + policy engine
- [x] `safetyos scan` — базовый поиск слабой криптографии
- [x] `npm run verify` — полный локальный прогон (10 проверок + отчёт JSON)
- [x] E2E тесты + GitHub Actions `ci.yml`

## Фаза 1 — Интеграция

- [x] Заготовки workflow `ci.yml` / `safetyos-pr.yml` (только `workflow_dispatch`, см. фазу 5)
- [x] JSON/HTML отчёты (`analyze --html`, `safetyos run`)
- [x] Merge scan → draft (`safetyos draft`, `safetyos init`)
- [x] `threat-model.yaml` для самого SafetyOS

## Фаза 2 — Защитный сервис (текущая)

- [x] CBOM (CycloneDX 1.6)
- [x] OPA policy export
- [x] Профили: fintech, healthcare, government, startup-saas
- [x] Crypto Agility Score
- [x] Assurance checklist (AI implementation layer)
- [x] `safetyos assess` — полная оценка

## Фаза 3 — Квант + ИИ (текущая)

- [x] TLS/cipher inventory + reconcile
- [x] Quantum posture (HNDL queue, NIST migration steps)
- [x] AI assurance (расширенный чеклист + scan patterns)
- [x] `safetyos playbook` — markdown playbook защиты
- [x] traefik / k8s Ingress парсер
- [x] NIST migration properties в CBOM
- [x] Профиль web3
- [x] Профиль messaging
- [x] HTML dashboard для `safetyos assess`

## Фаза 4 — CI и governance export

- [x] OPA Rego для `ai_governance` (IFF + язык ИИ) → `ai-governance.rego`
- [x] Локально: assess + playbook + OPA + `reports/assessment-latest.html`
- [x] Пример `examples/messaging-threat-model.yaml`

## Фаза 5 — Gate и профили (локально)

- [x] `safetyos gate` — локальный fail при assurance / IFF (`npm run verify`)
- [x] `profile apply --merge-flows` / `init -p … --merge-flows` + `starter_flows` в профилях
- [ ] npm publish / глобальная установка — **отложено**
- [ ] Внешний CI/PR gate в GitHub — **отложено** (заготовки в `.github/workflows/`, не обязательны)

## Фаза 7 — TLS reconcile + dashboard

- [x] Сопоставление inventory record ↔ `data_flows` (nginx/apache/ingress)
- [x] `safetyos inventory suggest` — патчи crypto для TLS-потоков
- [x] HTML assess: блок TLS (конфиги, drift, flow_id)
- [x] Dogfood: `cycle --inventory-tls examples/tls-configs`

## Фаза 6 — Defense cycle (в работе)

- [x] Умный merge scan → существующие `data_flows` (теги/пути + `scan-enriched`)
- [x] `safetyos cycle` — scan → enrich → assess → baseline diff
- [x] `safetyos diff` / `assess --diff-baseline` / `--save-baseline`
- [x] AES-128 + long/permanent storage → warning в risk engine
- [x] `starter_flows` для healthcare, government, web3, startup-saas
- [x] Dogfood: `threat-model.yaml` + `cycle` на `src` (0 critical, 0 assurance fail)
- [x] Scan context: каталоги detector/registry не считаются слабым кодом
- [x] TLS: Apache `SSLProtocol` / `SSLCipherSuite`, cert-manager/minTLS в YAML
- [x] `safetyos policy test` — bundle + `opa test` (если установлен OPA)
- [x] `safetyos watch` — пересчёт cycle при сохранении threat model

## Фаза 8 — TLS apply + экспорт drift

- [x] `safetyos inventory suggest --apply` — запись crypto в threat model (`-o` опционально)
- [x] TLS drift / inventory в **playbook** (секция 3) и **CBOM** (`tls-config/*`, `tls-drift/*`, metadata)
- [ ] Прогон на внешнем продуктовом репо — **по запросу** (путь не задан)

## Фаза 9 — Defense cycle bundle

- [x] `safetyos cycle` пишет **CBOM + playbook + tls-reconcile.json** в `-o`
- [x] `safetyos cycle --sync-tls` — TLS crypto sync перед assess (без перезаписи исходника)
- [x] `safetyos export cbom --inventory-tls` — CBOM с TLS-компонентами
- [x] `safetyos diff` / baseline: дельта **TLS drift** (total + critical)
- [x] `safetyos gate --max-tls-critical-drifts N` — fail при критичных drift

## Метрики успеха MVP

1. `analyze` на sample выдаёт `at_risk: true` для потока с RSA + long retention + HNDL.
2. `validate` отклоняет битый YAML.
3. `scan` находит RSA в fixture за &lt; 1 с.

## Команды

```bash
npm run safetyos -- validate examples/sample-threat-model.yaml
npm run safetyos -- analyze examples/sample-threat-model.yaml
npm run safetyos -- analyze examples/sample-threat-model.yaml --json
npm run safetyos -- scan examples/fixtures
npm run safetyos -- gate examples/sample-threat-model.yaml --max-critical 3
npm run safetyos -- gate threat-model.yaml --scan src/cli
npm run safetyos -- init -p messaging --merge-flows
npm run safetyos -- cycle threat-model.yaml --scan src/cli -o reports
npm run safetyos -- inventory tls examples/tls-configs
npm run safetyos -- policy test -m threat-model.yaml
npm run safetyos -- watch threat-model.yaml --scan src
npm run safetyos -- inventory reconcile -m examples/sample-threat-model.yaml --config examples/tls-configs
npm run safetyos -- inventory suggest -m examples/sample-threat-model.yaml --config examples/tls-configs
npm run safetyos -- inventory suggest -m examples/sample-threat-model.yaml --config examples/tls-configs --apply -o reports/sample-applied.yaml
npm run safetyos -- playbook -m examples/sample-threat-model.yaml --inventory-tls examples/tls-configs
npm run safetyos -- cycle threat-model.yaml --scan src --inventory-tls examples/tls-configs
npm run safetyos -- cycle threat-model.yaml --scan src --inventory-tls examples/tls-configs --sync-tls
npm run safetyos -- gate examples/sample-threat-model.yaml --inventory-tls examples/tls-configs --max-critical 3 --max-tls-critical-drifts 0
npm run safetyos -- export cbom -m examples/sample-threat-model.yaml --inventory-tls examples/tls-configs
```
