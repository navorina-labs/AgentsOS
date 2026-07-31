# MA39 (B)

## Answer

The validation rules for `callbackUrl` on inbox creation are as follows:

- **Protocol**: Must be HTTPS.
- **Localhost and Private IPs**: Cannot be localhost or private IP addresses (e.g., 127.*, 10.*, 192.168.*).
- **Length**: Maximum length of 2048 characters. 

If any of these rules are violated, the request will be rejected with an error indicating an invalid callback URL.
