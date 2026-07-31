# SEO and AI-search system

Use this reference for technical audits, content briefs, site architecture, structured data, and search visibility.

## Evidence hierarchy

Prefer, in order:

1. page source, server behavior, crawl evidence, Search Console, analytics, and field performance data;
2. current search-engine and web-platform documentation;
3. repeatable experiments or transparent industry studies;
4. third-party tools and expert interpretation;
5. anecdotes and unverified tactics.

State what was not measured. A static HTML audit cannot prove indexation, rankings, real-user performance, or conversions.

## Audit layers

### Eligibility and access

- successful HTTP response and stable redirects;
- index controls, robots directives, and canonical intent;
- crawlable links and discoverable sitemaps;
- important content available as text in the rendered DOM;
- consistent mobile and desktop meaning.

### Page meaning

- descriptive, distinct title and main heading;
- content that directly serves the page's intended user task;
- meaningful link text, image alternatives, language metadata, and semantic structure;
- canonical URL aligned with the page's actual preferred version;
- structured data that matches visible content and an eligible feature.

### Information value

- first-hand experience, original data, useful tools, examples, or expert explanation;
- clear authorship and accountable claims when trust matters;
- primary-source citations for factual or time-sensitive claims;
- no scaled pages whose only distinction is a query variation.

### Architecture

- pages grouped around customer tasks and product concepts;
- internal links explain relationships and priority;
- no isolated high-value pages, accidental duplication, or unbounded faceted spaces;
- programmatic pages require unique user value and explicit quality gates.

### Experience and measurement

- accessibility, mobile usability, security, and performance;
- field Core Web Vitals evaluated at the 75th percentile when sufficient data exists;
- query, page, country, and device performance inspected in Search Console;
- organic conversions and assisted value measured in first-party analytics.

## AI search posture

Treat conventional search eligibility and people-first value as the foundation. As of the sources reviewed on 2026-07-31, Google states that its SEO practices remain relevant to generative AI features and does not require special AI files or schema markup.

Prioritize:

- indexable, snippet-eligible pages;
- unique and non-commodity information;
- clear passages, headings, entities, sources, images, and video where useful;
- structured data consistent with visible content;
- measurement through Search Console and downstream conversions.

Label cross-platform claims separately. Guidance for one search or answer engine does not automatically apply to another.

## Severity model

- `critical`: blocks intended access, indexation, or safe conversion.
- `high`: materially obscures page purpose, trust, or primary user action.
- `medium`: weakens interpretation, discovery, or decision confidence.
- `low`: useful hardening or consistency improvement.
- `info`: observation requiring business or dataset context.

Do not assign severity from a checklist alone; combine technical evidence with page intent and business impact.
