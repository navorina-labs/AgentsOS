# NV13 (B)

## Answer

Before release, verify the following:

- **Pre-release Gate**: Run `npm run pre:release` or `ci:local:full`.
- **Integration Pilots**: Execute `verify:integrations-pilot`.
- **End-to-End Tests**: Run `ci:local:e2e`.
- **Manual Smoke Steps**: Follow the steps outlined in the RELEASE_CHECKLIST.
- **Live Checks**: Run `setup:integrations-live-check` after live keys are available.
- **Roadmap Update**: Update the roadmap status for live keys post-release.
