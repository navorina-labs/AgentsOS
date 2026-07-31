# MA36 (B)

## Answer

API key authentication and the `resolveAuth` function work as follows:

### API Key Authentication Flow
1. **Client Request**: The client sends an HTTP request with an `Authorization: Bearer <token>` header.
2. **Token Extraction**: The token is extracted from the header (removing the `Bearer ` prefix).
3. **Authentication Resolution**: The `resolveAuth(env, token)` function is called to determine the authentication details based on the token.

### `resolveAuth` Function Logic
- **Token Prefix Check**: 
  - If the token starts with `mat_`, it calls `resolveMcpAccessToken()` to handle the token as a short-lived JWT or fallback to KV.
  - If the token is a SHA-256 hash, it performs a lookup in the `api_keys` and `teams` tables.
  - If the token is a plaintext match, it checks against allowed legacy environment API keys, assigning a `legacy` plan and `FULL_ACCESS_SCOPE`.
- **Return Value**: 
  - If a valid authentication is found, it returns a `ResolvedAuth` object containing:
    - `hint`: First 16 hex characters of the SHA-256 token for rate limiting and inbox association.
    - `plan`: The plan associated with the key (e.g., `free`, `pro`, `enterprise`, `legacy`).
    - `teamId`: The ID of the team associated with the key or `null` for legacy keys.
    - `apiKeyId`: The ID of the API key or `null` for legacy and OIDC.
    - `label`: A human-readable label or email for OIDC.
    - `scope`: The scope associated with the API key.
  - If no valid authentication is found, it returns `null`, resulting in a 401 Unauthorized response.

### Application of Authentication Context
- The `applyAuthContext(c, auth)` function is then called to inject the resolved authentication details into the Hono context, which includes:
  - `apiKeyHint`
  - `apiPlan`
  - `teamId`
  - `apiKeyId`
  - `apiKeyScope`
  - Rate limit parameters based on the plan.

### Rate Limiting
- The rate limiting middleware uses the `hint` from the `ResolvedAuth` to track and limit requests based on the plan's defined limits.

This process ensures that each request is authenticated and authorized correctly, maintaining tenant isolation and enforcing rate limits based on the user's plan.
