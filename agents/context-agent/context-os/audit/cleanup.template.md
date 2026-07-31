# Core Cleanup Audit Template

Periodic review to maintain core quality and minimality.

**Project:** {PROJECT_NAME}  
**Audit date:** {DATE}  
**Auditor:** {NAME}

---

## Staleness Check

| Core | Version | Last updated | Stale? | Trigger |
|------|---------|--------------|--------|---------|
| business-core | | | Y/N | |
| product-core | | | Y/N | |
| technical-core | | | Y/N | |
| operational-core | | | Y/N | |

**Staleness triggers:** major release, pricing change, architecture migration, incident, >30 days since audit.

---

## Minimality Ablation

For each core, remove sections one at a time and re-test 5 questions:

| Core | Section removed | Quality impact? | Keep? |
|------|-----------------|-----------------|-------|
| | | | |

---

## Boundary Violations Found

| Violation | Core | Fix |
|-----------|------|-----|
| Code pasted in business core | | Remove, add pointer |
| | | |

---

## Overlap Between Cores

| Question | Core A answer | Core B answer | Conflict? | Resolution |
|----------|---------------|---------------|-----------|------------|
| | | | | |

---

## Routing Drift

| Question | Expected route | Actual route | Fix rule |
|----------|----------------|--------------|----------|
| | | | |

---

## Token Budget

| Core | Before audit | After cleanup | Reduction |
|------|--------------|---------------|-----------|
| | | | |

---

## Actions

- [ ] Update core versions
- [ ] Fix routing rules
- [ ] Re-run 20-question validation sample
- [ ] Document changes in experiment README
