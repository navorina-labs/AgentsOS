# NV13 (C)

## Answer

Before release, the following steps should be verified:

1. **Pre-release Gates**:
   - Run `npm run pre:release` or stepwise `npm run ci:local:full`.
   - Execute `VERIFY_INTEGRATIONS_E2E=1 npm run verify:integrations-pilot`.
   - Run `npm run ci:local:e2e`.

2. **Environment and Services Checks**:
   - Execute `npm run setup:services-check`.
   - Execute `npm run setup:integrations-live-check`.

3. **Manual Smoke Tests**:
   - Follow the manual smoke steps outlined in the release checklist.

4. **Continuous Integration (CI)**:
   - Ensure the CI job `nucleus-smoke` runs successfully, which includes unit tests and integration verification.

5. **Post-release Actions**:
   - Update the status of live keys in the roadmap after successful checks.

6. **Documentation**:
   - Refer to the release checklist in `docs/planning/RELEASE_CHECKLIST.md` for detailed steps and requirements.

These steps ensure that the release process is thorough and minimizes the risk of issues in production.
