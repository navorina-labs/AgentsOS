# MA25 (C)

## Answer

To create a team API key, follow these steps based on the provided context:

1. **Ensure Admin Permissions**:
   - Check if the user has the necessary admin permissions using `scopeAdminDenied`.

2. **Get Team ID**:
   - Retrieve the team ID from the request context using `requireTeam(c)`.

3. **Check Plan Limits**:
   - Determine the plan associated with the API key using `c.get("apiPlan")`.
   - Check the maximum number of keys allowed for the plan using `PLAN_LIMITS[plan].maxTeamKeys`.

4. **Count Existing Keys**:
   - Use `countTeamKeys(c.env, teamId)` to count the current number of keys for the team.

5. **Validate Key Creation**:
   - Ensure the count of existing keys does not exceed the maximum allowed.

6. **Parse Request Body**:
   - Parse the request body to get details for the new key (label, scope, etc.).

7. **Narrow Scope**:
   - Use `narrowScope(c.get("apiKeyScope"), scopeInput)` to validate and narrow down the scope for the new key.

8. **Generate API Key Token**:
   - Call `generateApiKeyToken()` to create a new token for the API key.

9. **Add Team Key**:
   - Use `addTeamKey(c.env, teamId, { token, label, scope })` to store the new key in the database.

10. **Audit the Creation**:
    - Log the creation of the key using `auditRoute(c, { action: "team.key.created", resourceType: "api_key", resourceId: apiKeyId, meta: { hint, label } })`.

11. **Return the Key**:
    - Respond with the new API key details, including the ID, token, hint, label, and scope.

This process is implemented in the `teamRoutes.post("/keys", async (c) => {...})` function in the `src/routes/team.ts` file.
