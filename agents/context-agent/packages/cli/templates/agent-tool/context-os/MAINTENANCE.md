# MAINTENANCE — {{PROJECT_NAME}}

## When to update a core

| Code change | Update |
|-------------|--------|
| New public class / service | `technical-core` Key Entities |
| Billing / Stripe flow | `billing-core` or `business-core` |
| User-facing flow | `product-core` or `onboarding-core` |
| Deploy / CI script | `operational-core` |

## Workflow

1. Edit the affected `.md` core; bump `version` and update `last_updated`.
2. `context-os validate`
3. Add a row to `eval/questions.json` if routing should change.
4. `context-os eval route --questions context-os/eval/questions.json`
5. `context-os cores verify --base origin/main`
6. `context-os contracts verify --base origin/main`

## Anti-patterns

- Do not paste full source files into cores — use entity names + file pointers.
- Do not answer-scope bleed (see OL06 pattern in [Oiloop MAINTENANCE](https://github.com/navorina-labs/AI-Context-OS/blob/main/experiments/oiloop/MAINTENANCE.md)).
