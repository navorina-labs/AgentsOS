# MA45 (C)

## Answer

The OAuth mat_ token for remote MCP works as follows:

- **Token Structure**: The mat_ token is prefixed with "mat_" and can be a JWT (JSON Web Token) or a legacy KV (Key-Value) token.
  
- **Issuing Tokens**:
  - The `issueMcpAccessToken` function is responsible for issuing short-lived Bearer tokens for MCP clients using the client_credentials flow.
  - It generates a JWT if a signing secret is available; otherwise, it creates a legacy token stored in a KV namespace.

- **Token Validation**:
  - The `resolveMcpAccessToken` function validates the token. It checks if the token is a JWT and verifies it using the signing secret.
  - If the JWT validation fails, it falls back to checking the legacy KV store for the token.

- **Token Payload**: The token contains claims such as:
  - `hint`: Identifier for the API key.
  - `plan`: The plan associated with the token.
  - `teamId`: The ID of the team.
  - `apiKeyId`: The ID of the API key.
  - `label`: An optional label for the token.
  - `scope`: Information about the token's scope.

- **Expiration**: Tokens have a configurable expiration time, defaulting to 3600 seconds (1 hour), but can be set to a minimum of 300 seconds and a maximum of 86,400 seconds.

- **Usage**: The token is used to authenticate requests to the MCP, allowing access to resources and operations defined by the token's scope.
