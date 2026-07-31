# AgentsOS product roadmap

## Product thesis

AgentsOS should not launch as four unrelated tools or as one vague universal agent. It should be a catalog of focused agents behind one account, one installation story, and one control plane.

The first promise is simple: **install one agent, complete one bounded job, see the result and its audit trail**.

## Priority order

### 1. AgentsOS Cloud + Mail Agent

Develop these together first. Mail Agent is the strongest entry product because it already has a hosted API, MCP, authentication, billing foundations, a console, SDKs, production checks, and a concrete developer problem.

AgentsOS Cloud should initially be a thin shell around proven Mail Agent infrastructure:

- AgentsOS landing page and agent catalog;
- one account, API-key screen, usage view, billing, and audit history;
- Mail Agent onboarding with a successful first inbox or simulated verification;
- product analytics for activation, successful runs, failures, and retention;
- preserved `webmailagent.com`, API routes, MCP tools, and npm packages.

Do not build a generic orchestration engine before two agents need the same abstraction in production.

### 2. Context Agent

Context Agent is the second product and the first shared capability. Existing research shows that routed context can improve answer quality while reducing context size, but the remaining work is packaging and adoption rather than more research.

Priorities:

- publish and document a stable install path;
- provide a five-minute repository setup and useful default profiles;
- add a GitHub Action that validates context quality and drift;
- dogfood Context Agent across all AgentsOS agents;
- expose context preparation as an optional step before other agent runs;
- publish the existing evidence as a practical case study.

### 3. Design Agent

Design Agent is the third product. It can make AgentsOS visible and differentiated, but first needs one repeatable end-to-end workflow instead of a broad collection of design capabilities.

Start with:

1. brief, screenshot, or existing UI;
2. structured specification and prioritized critique;
3. implementation or repair instructions;
4. screenshot-backed verification against the specification.

Package it as an installable skill, keep the existing evaluation suite as the release gate, and use it to design the AgentsOS website and console. This produces both product value and public proof.

### 4. Safety Agent

Safety Agent is technically substantial but should be commercialized fourth. Security products require stronger trust, external validation, low false-positive rates, and a clearer enterprise buyer.

Before building a hosted product:

- run it against every AgentsOS codebase in CI;
- add a simple GitHub pull-request gate and readable report;
- test it on three external repositories with maintainers;
- measure false positives and whether recommendations lead to accepted changes;
- choose one initial buyer and use case, such as crypto migration posture for fintech teams.

Keep the CLI useful and open while collecting this evidence.

## First 12 weeks

### Weeks 1–2 — Foundation and positioning

- Replace the Mail Agent-only marketing shell with AgentsOS branding and an agent catalog.
- Keep Mail Agent product pages and existing public identifiers intact.
- Define one shared navigation, account model, product naming system, and visual language.
- Secure the `@agentsos` npm scope and configure trusted publishing where possible.
- Add root CI with path-based checks for each agent.
- Instrument activation and successful-run events before driving traffic.

Exit gate: a new visitor understands AgentsOS, chooses Mail Agent, creates credentials, and reaches a working quick start without manual help.

### Weeks 3–5 — Mail Agent activation

- Reduce onboarding to one guided path: create inbox, simulate or receive a message, extract the action, clean up.
- Make failures explain themselves using existing diagnose capabilities.
- Finish billing readiness and usage visibility.
- Recruit three to five QA or agent-development design partners.
- Publish one Playwright example and one autonomous signup example as canonical paths.

Exit gate: at least three external teams complete a real workflow and return for a second session.

### Weeks 6–8 — Context Agent distribution

- Ship the stable CLI and compatibility package strategy.
- Add an opinionated quick start and GitHub Action.
- Generate and validate Context Agent cores for this monorepo.
- Connect one Mail Agent maintenance or support workflow to routed context.
- Publish a concise benchmark and migration case study.

Exit gate: external repositories can install, initialize, validate, and use routed context without maintainer intervention.

### Weeks 9–12 — Design Agent product workflow

- Turn the skill into a documented installable AgentsOS agent.
- Select and polish the specification-to-verification workflow.
- Use the agent on the AgentsOS landing page and console, retaining before/after evidence.
- Run the complete evaluation suite and publish a small set of representative results.
- Add the agent to the shared catalog without introducing shared backend code it does not need.

Exit gate: a user can submit a real interface artifact and receive a testable specification or verified repair, not only general design advice.

## Months 4–6

- Improve Mail Agent from observed usage rather than roadmap speculation.
- Add cross-agent run history only after Context or Design Agent produces real hosted runs.
- Pilot Safety Agent on external repositories and decide whether its first form is CLI, GitHub App, or hosted report.
- Introduce shared AgentsOS SDKs only for contracts already duplicated by at least two products.
- Decide on umbrella-domain redirects after search traffic and customer integrations are measured.

## Metrics

Track a small common funnel:

- visitor to agent selection;
- agent selection to first successful run;
- time to first successful run;
- successful runs per active team;
- failure reason and recovery rate;
- teams returning in the following week;
- conversion to a paid or design-partner relationship.

Product-specific quality gates:

- **Mail Agent:** successful verification rate, time to first OTP/action, diagnosed timeout rate.
- **Context Agent:** routing F1, context reduction, validation pass rate, repositories kept current after installation.
- **Design Agent:** evaluation score, fatal-error count, accepted specifications or repairs, regression rate.
- **Safety Agent:** false-positive rate, accepted findings, critical regressions blocked, external repository coverage.

## What not to do yet

- Do not rename every Mail Agent API, MCP tool, npm package, or domain at once.
- Do not create separate accounts and release credentials for each package.
- Do not build a marketplace before at least two agents have repeat users.
- Do not merge agent runtimes into one dependency graph merely because they share a repository.
- Do not sell Safety Agent as compliance or certification without external validation.
- Do not continue Context Agent research before shipping the already validated workflow.

