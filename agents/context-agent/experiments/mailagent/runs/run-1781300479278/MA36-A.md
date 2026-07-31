# MA36 (A)

## Answer

API key authentication and the `resolveAuth` function work as follows:

### API Key Authentication
- **Bearer Token**: The API uses a Bearer token for authentication, which can be either a direct API key or an OAuth `mat_` access token.
- **Authorization Header**: The token is passed in the `Authorization` header of the request.
- **Allowed API Keys**: The system checks for allowed API keys, which can be a single key or a comma-separated list of keys.

### `resolveAuth` Function
- **Purpose**: This function resolves the authentication details based on the provided Bearer token.
- **Key Validation**: It verifies if the token corresponds to a valid API key and retrieves associated details such as:
  - `apiKeyHint`: A hint for the API key.
  - `plan`: The plan associated with the API key (e.g., free, pro).
  - `teamId`: The ID of the team associated with the API key.
  - `apiKeyId`: The ID of the specific API key.
  - `scope`: The scope of the API key, which can include restrictions like `labelPrefix` and `readOnly`.

### Context Application
- After resolving the authentication, the function applies the context to the request, setting various properties (like rate limits and maximum active inboxes) based on the user's plan and key scope.

### Error Handling
- If the token is invalid or not provided, the API responds with a 401 Unauthorized status, indicating that authentication failed.

This mechanism ensures that only authorized users can access the API and that their permissions are correctly enforced based on their assigned roles and scopes.
