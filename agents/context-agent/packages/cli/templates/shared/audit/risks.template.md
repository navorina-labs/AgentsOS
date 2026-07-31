# Research Risks Template

**Project:** {PROJECT_NAME}
**Date:** {DATE}

---

## Hypothesis Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Null result (no quality gain) | Medium | High | Publish honestly; refine hypothesis |
| Cores too stale during experiment | Medium | High | Audit before each run |
| Routing errors dominate | Medium | High | Separate routing eval first |
| Rater disagreement | Low | Medium | Third rater tiebreak; refine rubric |

---

## Methodology Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Question bank bias (SaaS-heavy) | High | Medium | Add diverse projects in Phase 2 |
| Gold standard incorrect | Medium | High | Expert review of gold answers |
| Model version changes mid-study | Medium | High | Freeze model; document version |
| Full repo baseline unfairly truncated | Medium | High | Document truncation method |

---

## Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Manual curation too slow | High | Medium | Time-box; document hours |
| Private data leakage | Low | Critical | Redact; no code in published results |
| Core maintenance abandoned | Medium | Medium | Monthly audit schedule |

---

## Project-Specific Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| | | |

---

## Go / No-Go Criteria

Proceed to main experiment only if:

- [ ] Routing accuracy ≥ 90% on question bank
- [ ] All four primary cores pass validation (≥80% positive cases)
- [ ] CCR ≥ 3× (minimum; target 5×)
- [ ] Gold standards reviewed by domain expert
