# MA36 (C)

## Answer

- **API Key Authentication**:
  - The `requireApiKey` function checks for a valid API key in the request's `Authorization` header.
  - It uses the `resolveAuth` function to validate the API key and extract relevant information.

- **resolveAuth Function**:
  - Takes two parameters: `env` (environment variables) and `token` (the API key or OAuth token).
  - If the token is null or does not start with "mat_", it attempts to resolve it as an API key.
  - It calls `apiKeyHintFromToken` and `apiKeyHashFromToken` to derive the hint and hash of the token.
  - It looks up the API key in the database using `lookupKeyByHash` to retrieve associated details (team ID, label, plan, scope).
  - If the API key is valid, it returns an object containing:
    - `hint`: The API key hint.
    - `plan`: The plan associated with the API key.
    - `teamId`: The ID of the team associated with the API key.
    - `apiKeyId`: The ID of the API key.
    - `label`: The label of the API key.
    - `scope`: The scope of the API key.
  - If the token is not valid, it returns null.
