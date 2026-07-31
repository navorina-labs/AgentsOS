# MA45 (A)

## Answer

The OAuth `mat_` token for remote MCP works as follows:

- **Token Generation**: The `mat_` token is generated using the OAuth 2.0 `client_credentials` flow or through an authorization code flow with OIDC (OpenID Connect).
- **Stateless JWT**: The `mat_` token is a stateless JSON Web Token (JWT) that does not require storing state in Cloudflare KV, which helps avoid quota issues.
- **Claims**: The token includes claims such as:
  - `sub`: The API key hint.
  - `plan`: The user's plan (e.g., free, pro).
  - `tid`: The team ID (if applicable).
  - `kid`: The API key ID.
  - `lbl`: The label associated with the key.
  - `slp`: The label prefix for scoped keys.
  - `sro`: Indicates if the key is read-only.
- **Verification**: The token can be verified using the same secret used for signing it. If valid, it provides access to the MCP tools and resources.
- **Usage**: Clients can use the `mat_` token in the `Authorization` header to authenticate requests to the MCP endpoint.

For more details, refer to the `MCP-OAUTH.md` documentation.
