# MA15 (A)

## Answer

The API returns a 401 unauthorized status for the following reasons:

- **Missing or Invalid Bearer Token**: The Authorization header does not contain a valid Bearer token.
- **Invalid API Key**: The provided API key is not recognized or is incorrect.
- **Scoped Key Restrictions**: If using a scoped API key, the requested action may exceed the permissions defined by the key's scope.
- **Expired Token**: The token may have expired and is no longer valid for authentication.

To resolve this, ensure that:
- A valid Bearer token is included in the Authorization header.
- The API key is correct and has the necessary permissions for the requested operation.
