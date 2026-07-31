# Safety Agent — Mosca-Aware Crypto Lifecycle

Агент оценки и управления криптографическим жизненным циклом в AgentsOS: квантовые угрозы (HNDL, PQC), операционные риски и assurance против атак на реализацию (в т.ч. с участием ИИ).

Проект переименован из **SafetyOS** в **Safety Agent**. CLI `safetyos` и существующие форматы данных сохранены как совместимые публичные идентификаторы; для новых сценариев также доступен алиас `safety-agent`.

## Быстрый старт

Один локальный прогон (установка, сборка, тесты, CLI, доказательства scanner/analyze):

```bash
npm run verify
```

Полный отчёт по проекту (scan + analyze + HTML/JSON в `reports/`):

```bash
npm run report
```

Новый проект:

```bash
npm run safetyos -- init -n "My Company"
npm run safetyos -- draft ./src -o safetyos/threat-model.draft.yaml
npm run safetyos -- analyze safetyos/threat-model.yaml --html reports/out.html
npm run safetyos -- run --scan ./src
npm run safetyos -- profile list
npm run safetyos -- assess examples/sample-threat-model.yaml
npm run safetyos -- export cbom -m examples/sample-threat-model.yaml
npm run safetyos -- inventory tls examples/tls-configs
npm run safetyos -- inventory reconcile -m examples/sample-threat-model.yaml --config examples/tls-configs
npm run safetyos -- playbook -m examples/sample-threat-model.yaml --scan examples/fixtures
npm run safetyos -- gate threat-model.yaml --scan ./src
npm run safetyos -- init -p messaging --merge-flows -o safetyos/threat-model.yaml
npm run safetyos -- profile apply messaging -m safetyos/threat-model.yaml --merge-flows
```

Локальный gate: `safetyos gate` завершается с кодом 1 при critical risk, failed assurance или IFF. Допустимое число critical-потоков задаётся через `--max-critical`.

**Defense cycle** (scan обогащает модель, assess, diff с baseline):

```bash
npm run safetyos -- cycle threat-model.yaml --scan ./src -o reports --save-baseline
# после изменений в коде/модели:
npm run safetyos -- cycle threat-model.yaml --scan ./src -o reports
npm run safetyos -- diff reports/baseline-assessment.json reports/assessment.json
```

```bash
# sample содержит известный baseline из 3 critical-потоков
npm run safetyos -- gate examples/sample-threat-model.yaml --max-critical 3
npm run safetyos -- gate threat-model.yaml --scan ./src
```

```bash
npm run safetyos -- inventory tls examples/tls-configs
npm run safetyos -- inventory reconcile -m examples/sample-threat-model.yaml --config examples/tls-configs
npm run safetyos -- inventory suggest -m examples/sample-threat-model.yaml --config examples/tls-configs
npm run safetyos -- inventory suggest -m examples/sample-threat-model.yaml --config examples/tls-configs --apply -o reports/applied.yaml
npm run safetyos -- playbook -m examples/sample-threat-model.yaml --inventory-tls examples/tls-configs
npm run safetyos -- cycle threat-model.yaml --scan src --inventory-tls examples/tls-configs --sync-tls -o reports
npm run safetyos -- gate examples/sample-threat-model.yaml --inventory-tls examples/tls-configs --max-critical 3 --max-tls-critical-drifts 0
npm run safetyos -- policy test -m threat-model.yaml   # нужен opa CLI
npm run safetyos -- watch threat-model.yaml --scan src
```

CLI: `npm run safety-agent -- …` или совместимый `npm run safetyos -- …` (без npm publish и без обязательного CI).

Или по шагам:

```bash
npm install
npm run build
npm run safetyos -- analyze examples/sample-threat-model.yaml
npm run safetyos -- scan ./examples/fixtures
```

## Документация

| Документ | Содержание |
|----------|------------|
| [docs/01-problem-analysis.md](docs/01-problem-analysis.md) | Проблема в мире, формальная модель угроз |
| [docs/02-threat-model.md](docs/02-threat-model.md) | DSL threat model, поля, примеры |
| [docs/03-architecture.md](docs/03-architecture.md) | Архитектура SafetyOS, модули, потоки данных |
| [docs/04-roadmap.md](docs/04-roadmap.md) | Дорожная карта и MVP |
| [docs/05-reflections.md](docs/05-reflections.md) | Размышления и принципы продукта |
| [docs/06-defensive-service.md](docs/06-defensive-service.md) | Архитектура защитного сервиса |
| [docs/07-quantum-ai-defense.md](docs/07-quantum-ai-defense.md) | Две оси: квант и ИИ |

## Структура репозитория

```
safety-agent/
├── docs/           # Анализ и спецификации
├── schemas/        # JSON Schema для threat model
├── examples/       # Примеры конфигураций и фикстур
├── src/
│   ├── cli/        # CLI (analyze, scan, validate)
│   ├── parser/     # Загрузка YAML threat model
│   ├── engine/     # Mosca, risk scoring
│   ├── scanner/    # Поиск слабой криптографии в коде
│   └── types/      # Типы и Zod-схемы
```

## Лицензия

MIT
