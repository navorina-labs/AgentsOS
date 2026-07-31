# Changelog

All notable changes to AI Context OS are documented here.

The project uses synchronized versions for the published npm packages:

- `@context-os/schemas`
- `@context-os/eval`
- `context-os`

## 0.1.0 - Unreleased

Initial framework release candidate.

### Added

- `context-os` CLI for scaffolding, validating, routing, scoring, auditing, and maintaining Context OS installations.
- Project profiles for `minimal`, `saas`, `agent-tool`, and `oss-library`.
- JSON schemas for core manifests, routing maps, and evaluation question banks.
- Routing evaluation, dry-run budget checks, graph index generation, drift checks, and bootstrap CI utilities.
- Operational readiness commands: `doctor`, `check`, `maturity`, `audit`, `cores verify`, and `contracts verify`.
- Agent adapter installers for `AGENTS.md`, `CLAUDE.md`, and GitHub Copilot instructions.
- Reference SaaS implementation that passes the Operational maturity gate.
- Release verification and tarball install smoke tests for npm packages.

### Notes

- This is a framework and CLI release, not a hosted service.
- npm publishing should follow `docs/releasing.md`.
