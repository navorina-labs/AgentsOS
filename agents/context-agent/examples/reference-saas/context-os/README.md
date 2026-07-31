# Context OS - Beacon Metrics

This is the production-quality reference implementation for Context OS.

## Read Order

1. Read [CANON.md](CANON.md).
2. Route with [router/routing-map.json](router/routing-map.json).
3. Open the selected file under [cores](cores).
4. Follow its Sources only when additional evidence is required.

## Verification

```bash
context-os validate --schema
context-os score --min 85
context-os eval route
context-os eval dry-run
context-os routing lint --strict
context-os audit report --stdout
context-os audit record
context-os audit compare
context-os maturity --min operational
```

The source documents under `docs/` are deliberately compact but authoritative.
They make every core claim traceable without relying on files outside this
example.
