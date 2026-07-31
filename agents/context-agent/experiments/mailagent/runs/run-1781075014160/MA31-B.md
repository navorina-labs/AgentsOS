# MA31 (B)

## Answer

The following items can be cleaned up in the MailAgent repo, based on the provided context:

### Duplicate Content
- **Agent Skill**: Sync intentional copies of `SKILL.md` files via `npm run sync:skills`.
- **Service Presets**: Address duplication in `src/lib/service-presets.ts` and `mcp/src/service-presets.ts` to mitigate drift risk.
- **Documentation**: Consolidate overlapping setup instructions in README, SETUP, and docs.
- **Test Command Matrix**: Merge AGENTS.md and docs/AUTOTESTS.md as they contain duplicated information.

### Outdated/Historical Documents (Check for Relevance)
- `docs/YOUR-TURN.md`: Verify if still relevant.
- `docs/DISTRIBUTION-STATUS.md`: Check for current catalog PR status.
- `docs/QA-ROADMAP.md`: Confirm if roadmap items are completed.
- `docs/HOSTING-CLOUDFLARE.md`: Validate references to Netlify migration.
- `README.md`: Review "Moving from Netlify" section for relevance.

### Potential Dead Code (Verify Usage)
- Scripts like `prepare-catalog-pr.mjs`, `prepare-skills-pr.mjs`, and others may be one-time use and can be reviewed for removal.
- `public/debug.html`: Review for production exposure.
- `examples/docker-compose.mailpit.yml`: Check for overlap with documentation.

### Redundant Config Candidates
- `.env.example` and `.dev.vars.example` are both needed; not redundant.
- Multiple `playwright.*.config.ts` files in examples are intentional variants.

### Test/Example Sprawl
- Maintain `examples/playwright/*.example.ts` as templates, not production code.
- Keep `contract-qa*.mjs` scripts as they cover distinct API surfaces.
- Retain `examples/qa-pilot-*` as they are for product distribution.

### Documentation Overlap
- Review and link secondary documentation to primary topics to reduce redundancy.

### Priority for Cleanup Review
1. High: Service presets duplication.
2. Medium: Historical Netlify migration documents.
3. Low: One-time PR helper scripts.
4. Low: SKILL.md triple-copy.

This cleanup will require human review before any actions are taken.
