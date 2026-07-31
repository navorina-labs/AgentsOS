# NV37 (C)

## Answer

To run integrations pilot verification, follow these steps:

1. **Run the pre-release script**:
   ```sh
   npm run pre:release
   ```

2. **Alternatively, run stepwise**:
   - Execute the full local CI:
     ```sh
     npm run ci:local:full
     ```
   - Then, run the integrations pilot verification:
     ```sh
     VERIFY_INTEGRATIONS_E2E=1 npm run verify:integrations-pilot
     ```

3. **Check the release checklist for manual smoke steps**:
   - Refer to the manual smoke steps outlined in the `docs/planning/RELEASE_CHECKLIST.md`. 

These steps ensure that the integrations are verified before proceeding with the release.
