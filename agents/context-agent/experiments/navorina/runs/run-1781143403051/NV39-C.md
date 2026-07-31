# NV39 (C)

## Answer

To check workspace services without live keys, follow these steps from the release checklist:

1. **Run Setup Commands**:
   - Execute the command: 
     ```sh
     npm run setup:services-check
     ```
   - This command checks the services without requiring live keys.

2. **Check Integration Status**:
   - Run the command:
     ```sh
     npm run setup:integrations-live-check
     ```
   - This will verify the integration status without live keys.

3. **Expected Outcome**:
   - Each block should exit with a status of `0` (indicating success).
   - If running without keys, the script will skip certain checks and proceed without errors.

These steps ensure that the workspace services are verified without needing live keys.
