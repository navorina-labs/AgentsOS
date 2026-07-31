# NV38 (C)

## Answer

The environment flags that enable the billing emulator are:

- `BILLING_EMULATOR`: Set to a truthy value (e.g., '1', 'true', 'yes', 'on').
- `BILLING_EMULATOR_FORCE`: If set, it forces the emulator to be enabled regardless of other conditions.
- The application must not be in production mode (`NODE_ENV` should not be 'production').
