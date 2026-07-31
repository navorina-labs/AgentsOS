# MA45 (B)

## Answer

The OAuth `mat_` token for remote MCP works as follows:

- **Type**: It is a short-lived Bearer token.
- **Format**: 
  - Prefixed with `mat_`.
  - Contains either a JWT (using HS256) or a legacy KV identifier (`nanoid(40)`).
  
- **JWT Path**:
  - Claims include:
    - `sub` (hint)
    - `plan`
    - `tid` (team ID)
    - `kid` (key ID)
    - `lbl` (label)
    - `slp` (scope label prefix)
    - `sro` (scope read-only)
  - TTL (Time to Live): Configured by `MCP_OAUTH_TOKEN_TTL_SEC` (default is 3600 seconds, with a minimum of 300 and a maximum of 86400 seconds).
  - Secret used for signing: `MCP_OAUTH_JWT_SECRET` or fallback to `API_KEY`.

- **KV Path**:
  - If the signing secret is not available, the token is stored in a KV store with the key format `oauth:mat:{sha256(token)}`.
  - TTL for KV entries is `expires_in + 60`.

- **Issuance**:
  - The token is issued via the `POST /v1/oauth/token` endpoint using either the `client_credentials` or `authorization_code` grant types.

- **Resolution**:
  - When a `mat_` token is presented, it is resolved using `resolveMcpAccessToken()`, which first attempts to verify it as a JWT and falls back to the KV store if necessary.
