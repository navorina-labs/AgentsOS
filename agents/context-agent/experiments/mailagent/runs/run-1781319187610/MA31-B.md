# MA31 (B)

## Answer

The following items can be cleaned up in the MailAgent repo, pending human review:

### Duplicate Content
- **Agent Skill**: Multiple copies of `SKILL.md` in different locations.
- **Service Presets**: Duplicate enum in `src/lib/service-presets.ts` and `mcp/src/service-presets.ts`.
- **Documentation**: Overlapping setup instructions in README, SETUP, and other docs.
- **Test Command Matrix**: Duplicated in `AGENTS.md` and `docs/AUTOTESTS.md`.

### Outdated/Historical Documents
- Check the relevance of:
  - `docs/YOUR-TURN.md`
  - `docs/DISTRIBUTION-STATUS.md`
  - `docs/QA-ROADMAP.md`
  - `docs/HOSTING-CLOUDFLARE.md`
  - `README.md` section on "Moving from Netlify".

### Potential Dead Code
- Verify usage of:
  - `scripts/prepare-catalog-pr.mjs`
  - `scripts/prepare-skills-pr.mjs`
  - `scripts/import-skill-hub.mjs`
  - `scripts/check-catalog-prs.mjs`
  - `public/debug.html`
  - `examples/docker-compose.mailpit.yml`

### Redundant Config Candidates
- Review the necessity of `.env.example` and `.dev.vars.example`.

### Test/Example Sprawl
- Maintain `examples/playwright/*.example.ts` as templates, not production code.
- Keep `contract-qa*.mjs` as they cover distinct API surfaces.
- Retain `examples/qa-pilot-*` as they are for product distribution.

### Documentation Overlap
- Consolidate links for MCP setup across README, `docs/CODEX.md`, and `mcp/README.md`.
- Link secondary QA documentation instead of duplicating content.

### Files Safe to Exclude from AI Context
- Exclude lockfiles, binary assets, and generated build outputs from AI context.

### Priority for Cleanup Review
1. High: Service presets duplication.
2. Medium: Historical Netlify migration docs.
3. Low: One-time PR helper scripts.
4. Low: SKILL.md triple-copy.

This cleanup requires human review before any actions are taken.
