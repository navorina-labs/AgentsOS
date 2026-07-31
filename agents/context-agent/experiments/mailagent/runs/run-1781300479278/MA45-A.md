# MA45 (A)

## Answer

The OAuth `mat_` token for remote MCP works as follows:

- **Token Types**: 
  - The `mat_` token is a stateless JWT (JSON Web Token) used for authentication in the MailAgent API.
  - It can be obtained via the OAuth 2.0 `client_credentials` flow or through an `authorization_code` flow with an external Identity Provider (IdP) like Auth0 or Google.

- **Token Generation**:
  - When using the `client_credentials` flow, the API key is exchanged for a `mat_` access token, which is valid for a specified duration (default is 3600 seconds).
  - For the `authorization_code` flow, the user logs in via the IdP, and upon successful authentication, a `mat_` token is issued.

- **Token Structure**:
  - The `mat_` token contains claims such as:
    - `sub`: The API key hint.
    - `plan`: The plan associated with the API key.
    - `tid`: The team ID.
    - `kid`: The API key ID.
    - `lbl`: The label associated with the key.
    - `slp`: The label prefix for scoped keys.
    - `sro`: Indicates if the key is read-only.

- **Usage**:
  - The `mat_` token is included in the `Authorization` header as a Bearer token when making requests to the MCP endpoint.
  - It allows access to various MCP tools and ensures that the requests are authenticated and authorized based on the claims within the token.

- **Discovery and Validation**:
  - The token can be validated using the same secret used for signing it, ensuring that it has not been tampered with.
  - If the token is valid, it grants access to the resources and tools defined in the MCP.

This mechanism allows for secure and flexible access to the MailAgent's functionalities while maintaining team isolation and scoped permissions.
