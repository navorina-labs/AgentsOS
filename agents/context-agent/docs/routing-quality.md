# Routing Quality

Routing quality has two independent gates:

1. static lint detects structural ambiguity and missing coverage;
2. routing eval compares actual and expected cores for concrete questions.

## Static Lint

```bash
context-os routing lint
context-os routing lint --strict
context-os routing lint --json
```

Lint reports:

- the same normalized pattern assigned to different core sets;
- duplicated patterns;
- patterns shorter than three characters, except common technical acronyms;
- generic patterns such as `data`, `user`, or `error`;
- routes that no question in the eval bank exercises.

Conflicting patterns always fail. Other findings are warnings and fail only in
strict mode. `context-os check` always includes non-strict routing lint so
structural conflicts cannot bypass CI.

## Coverage Rule

Every route should have at least one representative question. Coverage means a
question matches at least one pattern from that route; it does not prove that
the expected result is correct. `context-os eval route` supplies that second
check through exact expected-core F1.

Do not add artificial questions merely to make coverage green. Each question
should represent a decision that a user or agent will actually ask.
