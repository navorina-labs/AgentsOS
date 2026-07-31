# Drift CI — add to consumer repo `.github/workflows/context-os-drift.yml`

```yaml
name: Context OS Drift

on:
  pull_request:
    paths:
      - "src/**"
      - "lib/**"
      - "docs/**"
      - "context-os/**"

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npx context-os@latest drift check --base origin/${{ github.base_ref }} --strict
        env:
          # or: npm run context-os -- drift check ...
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## What it checks

1. **stale_core** — file in core `Sources` changed, but core `.md` not updated in PR
2. **orphan_source** — core cites a path that no longer exists
3. **matrix_stale** — path matches `context-os/drift-config.json` pattern, core not updated
4. **unmapped_change** — code changed with no Sources reference (warning)

## Configure

Edit `context-os/drift-config.json` (created on `context-os init`):

```json
{
  "path_patterns": [
    { "patterns": ["src/**/billing/**"], "cores": ["billing-core"] },
    { "patterns": ["src/**"], "cores": ["technical-core"] }
  ]
}
```

List explicit paths in each core's `## Sources` section for precise matching.
