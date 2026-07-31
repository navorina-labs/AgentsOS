# MA45 (B)

## Answer

The OAuth `mat_` token for remote MCP works as follows:

- **Type**: It is a short-lived Bearer token.
- **Format**: 
  - Prefixed with `mat_`.
  - Contains either a JWT (using HS256) or a legacy KV format (nanoid).
  
- **JWT Path**:
  - Claims include `sub` (hint), `plan`, `tid` (team ID), `kid`, `lbl` (label), `slp` (scope label prefix), and `sro` (scope read-only).
  - TTL (Time to Live) is defined by `MCP_OAUTH_TOKEN_TTL_SEC`, with a default of 3600 seconds (1 hour), and a minimum of 300 seconds and maximum of 86400 seconds.
  - The secret used for signing is `MCP_OAUTH_JWT_SECRET`, with a fallback to `API_KEY`.

- **KV Path**:
  - The key format is `oauth:mat:{sha256(token)}` in the `RATE_LIMIT` KV.
  - TTL is set to `expires_in + 60`.

- **Issuance**:
  - The token is issued via `POST /v1/oauth/token` using either the `client_credentials` or `authorization_code` grant types.

- **Resolution**:
  - When a `mat_` token is presented, it is resolved using `resolveMcpAccessToken()`, which first attempts to verify it as a JWT and falls back to KV if necessary.

This mechanism allows for secure and efficient authentication for remote MCP clients.
