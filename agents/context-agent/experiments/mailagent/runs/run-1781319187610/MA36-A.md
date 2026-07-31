# MA36 (A)

## Answer

API key authentication and the `resolveAuth` function work as follows:

### API Key Authentication
- **Bearer Token**: The API uses a Bearer token for authentication, which is passed in the `Authorization` header of the request.
- **Allowed API Keys**: The system checks for valid API keys, which can be a single key or a comma-separated list of keys.
- **Scope**: Each API key can have a scope that restricts its access, such as:
  - `labelPrefix`: Limits the inbox labels that can be accessed or created.
  - `readOnly`: Indicates whether the key can perform write operations (create/delete).

### `resolveAuth` Function
- **Purpose**: This function resolves the authentication details based on the provided Bearer token.
- **Process**:
  1. It extracts the Bearer token from the request header.
  2. It checks the token against the allowed API keys.
  3. If valid, it retrieves the associated team and plan information, including:
     - `apiKeyHint`: A hint for the API key.
     - `plan`: The plan associated with the key (e.g., free, pro).
     - `teamId`: The ID of the team associated with the key.
     - `apiKeyId`: The ID of the specific API key.
     - `scope`: The scope of the API key, which includes restrictions like `labelPrefix` and `readOnly`.

### Summary
- The API key authentication ensures that only authorized users can access the API.
- The `resolveAuth` function validates the token and retrieves the necessary context for the authenticated request, enabling proper access control based on the user's permissions.
