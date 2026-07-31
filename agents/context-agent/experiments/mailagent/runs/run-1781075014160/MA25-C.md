# MA25 (C)

## Answer

To create a team API key, follow these steps based on the provided context:

1. **Ensure Admin Permissions**:
   - Check if the user has admin permissions using `scopeAdminDenied(c)`. If not, return an error.

2. **Get Team ID**:
   - Retrieve the team ID from the request context using `requireTeam(c)`. If the team ID is not present, return a "team_required" error.

3. **Check Plan Limits**:
   - Get the current plan using `c.get("apiPlan")`.
   - Determine the maximum number of keys allowed for the plan using `PLAN_LIMITS[plan].maxTeamKeys`.
   - If the maximum keys are less than 1, return an error indicating that team keys are not supported on the legacy plan.

4. **Count Existing Keys**:
   - Use `countTeamKeys(c.env, teamId)` to count the current number of keys for the team.
   - If the count exceeds the maximum allowed, return an error indicating that the team key limit has been reached.

5. **Parse Request Body**:
   - Parse the request body to get the key details (label, scope, etc.). If parsing fails, return an error.

6. **Narrow the Scope**:
   - Use `parseScopeBody(body)` to parse the scope from the request body.
   - Narrow the scope using `narrowScope(c.get("apiKeyScope"), scopeInput)`. If there is an error, return it.

7. **Generate API Key Token**:
   - Generate a new API key token using `generateApiKeyToken()`.

8. **Add Team Key**:
   - Call `addTeamKey(c.env, teamId, { token, label, scope })` to create the new team key.
   - Capture the returned `apiKeyId` and `hint`.

9. **Audit the Creation**:
   - Use `auditRoute(c, { action: "team.key.created", resourceType: "api_key", resourceId: apiKeyId, meta: { hint, label } })` to log the creation of the key.

10. **Return the Response**:
    - Return a JSON response containing the new API key details, including the ID, token, hint, label, and scope.

This process is implemented in the `teamRoutes.post("/keys", async (c) => { ... })` function in the `src/routes/team.ts` file.
