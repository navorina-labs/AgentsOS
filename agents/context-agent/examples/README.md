# Examples

| Example | Description |
|---------|-------------|
| [scaffold-saas](scaffold-saas) | **CLI output** — `context-os init --profile saas` (committed, runnable) |
| [Navorina instance](../experiments/navorina/instance) | Full production Context OS on a SaaS repo (AI coding agents) |
| [Oiloop](../experiments/oiloop) | Private app + runtime router in Swift |

## Try the scaffold

```bash
cd examples/scaffold-saas
node ../../packages/cli/bin/context-os.mjs validate --root .
node ../../packages/cli/bin/context-os.mjs route "Stripe webhook failed" --root .
```

Generated scaffolds are a starting point — fill cores using [docs/core-building-playbook.md](../docs/core-building-playbook.md).
