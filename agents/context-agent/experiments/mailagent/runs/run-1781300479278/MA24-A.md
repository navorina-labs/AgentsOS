# MA24 (A)

## Answer

In CI, on push to the main branch, the following actions are executed:

- **Deploy the Worker**: The workflow defined in `.github/workflows/deploy-worker.yml` is triggered.
- **Run `test:prod:gate`**: This is a smoke test that runs after the deployment, which includes minimal API calls to verify the deployment's success.

The full suite of tests (`test:prod`) is not run on every push; it is executed only on tag `v*` or manually.
