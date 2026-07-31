# MA15 (B)

## Answer

The API returns a 401 unauthorized status for the following reasons:

- Missing or invalid Bearer token in the `Authorization` header.
- Invalid or missing `mat_` or `ma_` token when accessing MCP HTTP endpoints.
- Invalid client secret when requesting an OAuth token. 

In all cases, the response body will typically contain `{ error: "unauthorized" }`.
