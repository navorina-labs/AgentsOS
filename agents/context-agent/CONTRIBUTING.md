# Contributing

AI Context OS is moving from research artifact to framework. Contributions should preserve that boundary: changes need to improve the reusable CLI, schemas, templates, eval tooling, or documented methodology.

## Development Setup

```bash
npm ci
npm run test:framework
```

Use Node.js 18 or newer. CI currently verifies Node 18, 20, and 22.

## Useful Commands

```bash
npm run context-os -- --help
npm run context-os -- init --name demo --profile minimal --target /tmp/context-os-demo --force
npm run context-os -- check --root examples/reference-saas --min-score 85
npm run test:release
```

## Change Guidelines

- Keep framework changes separate from research paper, outreach, and generated experiment output.
- Prefer updates that work from a clean npm tarball install, not only from workspace links.
- Update schemas and tests together when changing framework contracts.
- Update docs when adding or changing CLI commands, maturity criteria, release behavior, or methodology.
- Do not commit generated local artifacts such as eval results, drift reports, graph indexes, `node_modules`, or OS metadata.

## Pull Request Checklist

- `npm run test:framework` passes locally, or the PR explains why it could not be run.
- New CLI behavior has focused tests.
- Public JSON output remains backward-compatible or is documented in `docs/cli-api.md`.
- Release-impacting changes are reflected in `CHANGELOG.md` and `docs/releasing.md`.
- Examples still pass `context-os check` and `context-os maturity` where applicable.

## Release Policy

The three npm packages are versioned together. Do not bump one package alone. Follow `docs/releasing.md` for release preparation and publishing.
