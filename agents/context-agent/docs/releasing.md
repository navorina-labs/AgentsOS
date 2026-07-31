# Releasing Context OS Packages

Context OS publishes three npm packages with one synchronized version:

1. `@context-os/schemas`
2. `@context-os/eval`
3. `context-os`

The CLI depends on the matching `@context-os/eval` version, so this order is a
release invariant.

## Preflight

From a clean checkout:

```bash
npm ci
npm run test:framework
npm run verify:release -- --tag v0.1.0
```

`test:release` does not use workspace links. It packs all three packages,
installs the tarballs in an empty npm project, imports the public package
exports, and runs `init`, `doctor`, and `check` through the installed binary.

The CLI and eval packages declare Node 18 as their minimum runtime. Repository
CI runs the framework suite on Node 18, 20, and 22. The suite also rejects
known post-18 JavaScript APIs before packaging.

Before tagging a release, also verify:

- `CHANGELOG.md` has an entry for the release;
- all three package manifests use the same version;
- `package-lock.json` was refreshed after version changes;
- `npm run test:release` passes from the release commit;
- the release commit is on `main` and the working tree is clean.

## Versioning

Update the version in all three package manifests and update the CLI dependency
on `@context-os/eval` to the same exact version. Then refresh `package-lock.json`.

`scripts/verify-release.mjs` rejects:

- package version divergence;
- a CLI dependency version that differs from the release;
- a tag that differs from the package version.

Release tags may use `v<version>` or the legacy `cli-v<version>` form.

## Secrets

Local keys live in `.env` (gitignored). Start from the committed template:

```bash
cp .env.example .env
# edit .env — set NPM_TOKEN / NODE_AUTH_TOKEN from npmjs.com → Access Tokens
set -a && source .env && set +a
```

CI publish does **not** read `.env`. Store the same Automation token as a
repository secret named `NPM_TOKEN`:

```bash
gh secret set NPM_TOKEN
# paste token when prompted
```

The `Publish packages` workflow uses `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`.

## Publishing

Push the release tag or start the `Publish packages` workflow manually. Manual
runs require a `release_tag` input matching the package version. The workflow
installs from the lockfile, validates the release contract, runs the framework
suite, and publishes packages in dependency order with npm provenance.

If publication stops after one package, inspect npm before retrying. npm
versions are immutable: never overwrite or reuse a partially published version.
Publish the remaining packages for the same version, or bump all packages to a
new synchronized version.

## Post-Publish Smoke

After npm publication, test the registry artifacts from an empty directory:

```bash
npm init --yes
npm install context-os@0.1.0
npx context-os --version
npx context-os init --name registry-smoke --profile minimal --target /tmp/context-os-registry-smoke
npx context-os doctor --root /tmp/context-os-registry-smoke
```

If the registry smoke fails, do not republish the same version. Fix the issue,
bump all package versions together, and publish a new synchronized version.
