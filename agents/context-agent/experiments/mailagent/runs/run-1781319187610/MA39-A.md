# MA39 (A)

## Answer

The validation rules for `callbackUrl` on inbox creation are as follows:

- **Must be a valid HTTPS URL**: The `callbackUrl` must start with `https://`.
- **No localhost or private IPs**: The URL cannot be from `localhost`, `127.0.0.1`, or any private IP addresses (e.g., `10.x.x.x`, `192.168.x.x`).
- **Optional**: If the `callbackUrl` is provided, it must be parsed and validated. If it is invalid, an error will be returned.

If the `callbackUrl` is not provided, it is not required.
