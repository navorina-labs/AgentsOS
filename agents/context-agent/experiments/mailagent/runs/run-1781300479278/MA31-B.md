# MA31 (B)

## Answer

The following items can be cleaned up in the MailAgent repo, pending human review:

### Duplicates
- **Content Duplicates:**
  - Agent Skill files in multiple locations.
  - Duplicate enum for Service presets in `src/lib/service-presets.ts` and `mcp/src/service-presets.ts`.
  - Overlapping setup instructions in README, SETUP, and docs.
  - Test command matrix duplicated in AGENTS.md and docs/AUTOTESTS.md.

### Historical Documents (Check for Relevance)
- `docs/YOUR-TURN.md` (Operator checklist).
- `docs/DISTRIBUTION-STATUS.md` (Catalog PR status).
- `docs/QA-ROADMAP.md` (Roadmap items).
- `docs/HOSTING-CLOUDFLARE.md` (Netlify migration references).
- `README.md` section on "Moving from Netlify".

### Potential Dead Code (Verify Usage)
- Various scripts related to catalog and skills PRs.
- Debug UI in `public/debug.html`.
- Alternative Docker compose file for Mailpit.

### Redundant Config Candidates
- `.env.example` and `.dev.vars.example` are not redundant.
- Multiple `playwright.*.config.ts` files in examples are intentional.

### Test/Example Sprawl
- Keep examples as templates, not production code.

### Documentation Overlap
- Consolidate links in documentation where overlaps exist.

### Files Safe to Exclude from AI Context
- Lockfiles, binary assets, and generated build outputs can be excluded.

### Priority for Cleanup Review
1. High: Service presets duplication.
2. Medium: Historical Netlify migration documents.
3. Low: One-time PR helper scripts.
4. Low: SKILL.md triple-copy.

This cleanup requires human review before any actions are taken.
