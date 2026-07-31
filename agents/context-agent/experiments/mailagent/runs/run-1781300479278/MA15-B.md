# MA15 (B)

## Answer

The API returns a 401 unauthorized status for the following reasons:

- Missing or invalid Bearer token in the Authorization header.
- The token does not match any valid credentials in the system.
- The token is expired or revoked.
- The request does not meet the requirements for the specific route, such as lacking necessary permissions or scopes.

In the context of MCP HTTP, a 401 response also includes a `WWW-Authenticate` header with details about the required authentication.
