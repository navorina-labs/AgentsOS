# Ops shards

Операционные детали (API, smoke, env, эмуляторы). Читать **точечно** после выбора core в router — не весь каталог.

| Shard | Core | Когда |
|-------|------|-------|
| [dev-and-release.md](./dev-and-release.md) | `release-core`, `operational-core` | Dev, E2E, emulators, workspace services |
| [stripe-billing.md](./stripe-billing.md) | `billing-core` | Stripe, Plus/Pro, billing emulator |
| [crypto-payments.md](./crypto-payments.md) | `nucleus-core` | CP*, invoicing crypto, month close |
| [delivery.md](./delivery.md) | `operational-core` | Resend digest, invoice email, Web Push |
| [xero.md](./xero.md) | `nucleus-core` | Accounting export |
| [ops-v0.md](./ops-v0.md) | `operational-core` | Support tier API |
| [nucleus-misc.md](./nucleus-misc.md) | `nucleus-core`, `assistant-core` | Contact, trade journal, Magic Inbox OCR |

Индекс в корне: [`AGENTS.md`](../../AGENTS.md).
