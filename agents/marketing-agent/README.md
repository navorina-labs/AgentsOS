# Marketing & SEO Agent

Marketing & SEO Agent turns product evidence into positioning, search audits, content systems, conversion experiments, and measurable growth plans.

## Current capabilities

- marketing diagnosis and constraint identification;
- ICP, positioning, and message hierarchy;
- channel, launch, and content planning;
- technical and on-page SEO review;
- AI-search guidance grounded in current primary sources;
- conversion and measurement plans;
- deterministic HTML/URL readiness audit without API keys.

## Quick start

Invoke the skill as `$marketing-agent`, or run the baseline page auditor directly:

```bash
cd agents/marketing-agent
python3 scripts/audit_page.py https://example.com --format markdown
python3 scripts/audit_page.py ./tests/fixtures/healthy.html --format json
```

The readiness score measures observable implementation coverage. It is not a ranking, traffic, or revenue prediction.

## Verification

```bash
python3 -m unittest discover -s tests -v
python3 scripts/verify_agent.py
```

Within this repository, use the validator installed with Codex:

```bash
python3 "$HOME/.codex/skills/.system/skill-creator/scripts/quick_validate.py" .
```

## License

MIT. See [LICENSE](LICENSE). External projects informed the capability map but no external source code was copied. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
