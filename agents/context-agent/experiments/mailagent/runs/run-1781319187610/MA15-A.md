# MA15 (A)

## Answer

The API returns a 401 unauthorized status for the following reasons:

- **Missing or Invalid Bearer Token**: The Authorization header does not contain a valid Bearer token.
- **Invalid API Key**: The provided API key is not recognized or is incorrect.
- **Scoped Key Restrictions**: If using a scoped API key, the requested action may exceed the permissions granted by that key.
- **Team ID Requirement**: Certain actions may require a team ID that is not provided or recognized.

To resolve this, ensure that:
- A valid Bearer token is included in the Authorization header.
- The API key is correct and has the necessary permissions for the requested action.
