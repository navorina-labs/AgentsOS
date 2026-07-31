# MA36 (C)

## Answer

API key authentication and the `resolveAuth` function work as follows:

- **API Key Authentication**:
  - The API key is expected to be provided in the `Authorization` header as a Bearer token.
  - The `requireApiKey` middleware checks for the presence of this token and resolves its validity.

- **resolveAuth Function**:
  - **Input**: Takes an environment (`env`) and a token (string or null).
  - **Checks**:
    - If the token is null, it returns null.
    - If the token starts with "mat_", it attempts to resolve it as an OAuth token using `resolveMcpAccessToken`.
  - **API Key Handling**:
    - It extracts the hint and hash from the token using `apiKeyHintFromToken` and `apiKeyHashFromToken`.
    - It looks up the API key in the database using `lookupKeyByHash`.
    - If found, it normalizes the plan and returns an object containing:
      - `hint`: The API key hint.
      - `plan`: The normalized plan.
      - `teamId`: The associated team ID.
      - `apiKeyId`: The ID of the API key.
      - `label`: The label of the API key.
      - `scope`: The scope associated with the API key.
    - If the token is an allowed API key from the environment, it returns a default response with full access scope.
  - **Return Value**: Returns a `ResolvedAuth` object or null if authentication fails.
