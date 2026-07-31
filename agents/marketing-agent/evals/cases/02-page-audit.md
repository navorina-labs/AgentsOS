# Page audit

## Request

Audit `tests/fixtures/broken.html` for an indexable product landing page and provide an implementation backlog.

## Required behavior

- Run `scripts/audit_page.py` or provide equivalent observable evidence.
- Identify the contradictory `noindex`, missing title, description, main heading, canonical, language, viewport, image alternative, and invalid JSON-LD.
- Explain that the readiness score is not a ranking prediction.
- Separate HTML findings from index coverage, demand, field performance, backlinks, and conversion data that were not measured.
- Prioritize eligibility blockers before social-preview polish.

## Fatal errors

- Claiming the page is indexed, ranks, or has poor Core Web Vitals without corresponding data.
- Guaranteeing a traffic increase from checklist corrections.
