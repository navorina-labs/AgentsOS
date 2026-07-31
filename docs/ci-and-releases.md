# CI and releases

AgentsOS keeps each agent independently testable and releasable from one monorepo. GitHub Actions workflow files live at the repository root because GitHub does not discover workflows nested under an agent directory.

## Workflow map

| Agent | Workflow | Trigger |
| --- | --- | --- |
| Mail Agent | `mail-context-router.yml` | Relevant Mail Agent context changes or manual |
| Mail Agent | `mail-deploy-worker.yml` | Relevant Mail Agent changes on `main` or manual |
| Mail Agent | `mail-plugin-scanner.yml` | Push and pull request |
| Mail Agent | `mail-publish-packages.yml` | `mail-v*` tag or manual |
| Mail Agent | `mail-qa-smoke.yml` | Relevant pull request or `qa/**` branch |
| Mail Agent | `mail-security-baseline.yml` | Relevant changes, weekly schedule, or manual |
| Mail Agent | `mail-full-prod-gate.yml` | Manual |
| Context Agent | `context-cli.yml` | Relevant Context Agent changes |
| Context Agent | `context-publish.yml` | `cli-v*` tag or manual |

The agent-local `.github/workflows` directories are retained as migration history and standalone-project references. Only the root workflows execute in AgentsOS.

## Repository secrets

| Secret | Used by |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Mail Agent Worker deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Mail Agent Worker deploy |
| `DATABASE_URL` | Optional pre-deploy migrations |
| `MAILAGENT_API_KEY` | Production smoke and release gates |
| `PYPI_API_TOKEN` | Python Mail Agent SDK publishing |
| `NPM_TOKEN` | Context Agent package publishing fallback |

Secrets belong in GitHub Actions settings, never in the repository. Prefer environment-scoped credentials if production protection rules are introduced.

## npm trusted publishing

Mail Agent packages use npm trusted publishing. Configure each package on npm with:

- organization or user: `navorina-labs`;
- repository: `AgentsOS`;
- workflow: `mail-publish-packages.yml`;
- environment: leave empty unless a matching GitHub environment is added.

Configure Context Agent packages with `context-publish.yml` when migrating them from token publishing to trusted publishing.

## Release tags

Generic `v*` tags are intentionally not used in the monorepo because they cannot identify an agent.

- Mail Agent: `mail-v<version>`
- Context Agent CLI: `cli-v<version>`

Package versions remain independent. A release of one agent must not force releases of the others.

## Cutover gate

Before archiving a standalone source repository:

1. root workflow is merged into `main`;
2. required secrets are present;
3. local agent checks pass;
4. corresponding GitHub workflow passes;
5. production deploy or package release succeeds from AgentsOS;
6. old repository README points to the new source location.

