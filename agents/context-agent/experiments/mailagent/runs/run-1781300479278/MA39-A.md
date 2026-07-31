# MA39 (A)

## Answer

The validation rules for `callbackUrl` on inbox creation are as follows:

- **Must be a valid HTTPS URL**: The `callbackUrl` must start with "https://".
- **No localhost or private IPs**: The URL cannot be from localhost or any private IP addresses (e.g., `127.0.0.1`, `10.x.x.x`, `192.168.x.x`).
- **Length limit**: The URL length must not exceed 2048 characters.

If the `callbackUrl` does not meet these criteria, it will be considered invalid.
