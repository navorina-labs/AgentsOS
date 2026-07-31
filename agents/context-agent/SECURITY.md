# Security Policy

## Supported Versions

Until the first stable release, security fixes target the current `main` branch and the latest published `0.x` package version.

## Reporting a Vulnerability

Do not open a public issue for a suspected vulnerability. Report it privately through GitHub's security advisory flow for this repository, or contact the maintainer directly if advisory reporting is not available.

Please include:

- affected package or command;
- reproduction steps;
- expected impact;
- whether credentials, tokens, private source files, or generated context artifacts can be exposed.

## Scope

Security-sensitive areas include:

- CLI commands that read repository files or write generated artifacts;
- release and npm publishing workflows;
- eval commands that may call model providers;
- generated agent instruction files such as `AGENTS.md`, `CLAUDE.md`, and Copilot instructions.

Context OS is a local CLI framework. It should not require secrets for scaffold, validation, routing, scoring, dry-run, drift, or audit workflows. Commands that use external model providers must receive credentials through the environment and should not persist them in generated project files.
