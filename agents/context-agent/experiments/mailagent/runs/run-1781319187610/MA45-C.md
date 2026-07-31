# MA45 (C)

## Answer

The OAuth mat_ token for remote MCP works as follows:

- **Token Structure**: The mat_ token is prefixed with "mat_" and can be a JWT (JSON Web Token) or a legacy KV (Key-Value) token.
  
- **Issuing Tokens**:
  - The `issueMcpAccessToken` function generates a short-lived Bearer token for MCP clients using either JWT signing or a KV store.
  - The token includes claims such as the user's hint, plan, team ID, API key ID, label, and scope.

- **Validating Tokens**:
  - The `resolveMcpAccessToken` function validates the token by checking if it starts with the "mat_" prefix.
  - If it is a JWT, it verifies the token using the signing secret. If it is a legacy token, it retrieves the associated data from the KV store.

- **Token Expiration**: Tokens have a configurable expiration time, defaulting to 3600 seconds (1 hour).

- **Storage**: Tokens can be stored in a KV namespace for legacy support, allowing for fallback validation if JWT verification fails.

- **Security**: The signing secret used for JWTs is derived from environment variables, ensuring secure token generation and validation.

This mechanism allows for secure authentication and authorization of clients interacting with the MCP (Mail Control Protocol) services.
