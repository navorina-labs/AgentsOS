# MA15 (A)

## Answer

The API returns a 401 unauthorized status for the following reasons:

- **Missing or Invalid Bearer Token**: The request does not include a valid Bearer token in the Authorization header.
- **Invalid API Key**: The provided API key is not recognized or is incorrect.
- **Scoped Key Restrictions**: If using a scoped API key, the requested action may exceed the permissions defined by the key's scope.
- **Session Expiration**: If using a session-based token (like `mat_`), it may have expired or been invalidated.

To resolve this, ensure that:
- A valid Bearer token is included in the request.
- The API key is correct and has the necessary permissions for the requested operation.
