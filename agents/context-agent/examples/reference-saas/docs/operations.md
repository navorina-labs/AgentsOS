# Operations

Releases move through test, staging, a ten-percent production canary, and full
production. Promotion requires automated tests, a successful migration check,
and a smoke event visible in a dashboard. Roll back when a release causes
sustained ingestion rejection or dashboard error-budget burn.

The ingestion availability objective is 99.9 percent over 30 days. Alerts page
on-call after five minutes above a two-percent rejection rate. Severity one
means ingestion or dashboards are unavailable to more than one quarter of
active workspaces. It requires an incident commander and updates every
30 minutes.

Event-store backups run daily. A quarterly recovery exercise must demonstrate a
four-hour recovery-time objective and a one-hour recovery-point objective.
