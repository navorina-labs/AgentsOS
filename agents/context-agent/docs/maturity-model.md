# Context OS Maturity Model

The maturity model defines a cumulative adoption path. A project only reaches a
level when it satisfies that level and every level below it.

| Rank | Level | Required evidence |
|------|-------|-------------------|
| 0 | Absent | No valid Context OS scaffold is available. |
| 1 | Scaffold | Manifest, routing map, and declared core files pass readiness checks. |
| 2 | Structured | Every core scores at least 50 and the architecture gate passes. |
| 3 | Routable | At least three eval questions route with F1 1.0. |
| 4 | Verified | Every core scores at least 75, dry-run routes stay within 2,000 estimated tokens with no zero-context cases, and a baseline manifest exists. |
| 5 | Operational | Verified status plus drift configuration and a repository CI gate. |

## Usage

Inspect the current level and the next required action:

```bash
context-os maturity
context-os maturity --json
```

Enforce an adoption level in CI:

```bash
context-os maturity --min routable
context-os maturity --min operational
```

The levels measure framework adoption, not answer correctness. A Verified or
Operational project still needs domain-specific gold answers and periodic human
review. The maturity model makes the operational prerequisites explicit; it
does not replace evaluation.

## Recommended Adoption

| Environment | Recommended minimum |
|-------------|---------------------|
| Local prototype | Structured |
| Shared team repository | Routable |
| Production agent workflow | Verified |
| Maintained organization standard | Operational |
