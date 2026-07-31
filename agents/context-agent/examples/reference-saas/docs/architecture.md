# Architecture

The ingestion API authenticates a workspace, validates events, and writes them
to an append-only event store. Event identity is unique within a workspace and
is used for idempotent retries. All records are partitioned by workspace.

Workers read immutable events and produce hourly metric aggregates. The query
service reads aggregates, never raw events, for interactive dashboard requests.
The dashboard API owns dashboard definitions and requests metric results from
the query service.

Public HTTP APIs are versioned. Changes within a major version must remain
backward compatible. Services exchange workspace identity explicitly; no
service may infer tenancy from user-provided filter expressions.
