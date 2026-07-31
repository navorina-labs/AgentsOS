# MA24 (A)

## Answer

On push to the main branch, the following actions run in CI:

- **Deploy the Worker**: The workflow defined in `.github/workflows/deploy-worker.yml` is triggered.
- **Run `test:prod:gate`**: This is a smoke test that verifies the production environment after deployment, which includes minimal API calls to ensure the system is functioning correctly.

The full suite of tests (`test:prod`) is not run automatically on every push; it is reserved for pre-merge or tagged releases.
