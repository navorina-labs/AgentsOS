# NV30 (C)

## Answer

The workspace context tier is fetched from the following locations:

- **GET /api/financial-mirror/workspace/context**: This endpoint retrieves the workspace context, which includes subscription and billing information.
- **Firestore**: The user tier is also fetched from Firestore using the `loadUserTierFromFirestore` function in the `financial-mirror-api.ts` file.
- **GET /features**: This endpoint can be used as a fallback to retrieve feature flags and user tier information.

These methods are utilized in the `FinancialMirrorAPI` class to determine the user's subscription tier.
