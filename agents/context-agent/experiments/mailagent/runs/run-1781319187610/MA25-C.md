# MA25 (C)

## Answer

To create a team API key, follow these steps based on the provided context:

1. **Ensure Team ID**: Make sure you have a valid team ID. You can retrieve it using the `requireTeam` function in the `teamRoutes`.

2. **Check Plan Limits**: Verify that your team's plan supports API keys. Check the maximum number of keys allowed for your plan using `PLAN_LIMITS`.

3. **Count Existing Keys**: Use the `countTeamKeys` function to check how many keys are currently associated with the team. Ensure this count is less than the maximum allowed.

4. **Prepare Request Body**: Construct the request body with optional fields:
   - `label`: A string for the key's label.
   - `scope`: An object defining the scope of the key (optional).

5. **Parse Scope**: Use the `parseScopeBody` function to parse the scope input from the request body.

6. **Generate API Key Token**: Call the `generateApiKeyToken` function to create a new token for the API key.

7. **Add Team Key**: Use the `addTeamKey` function to add the new key to the team, passing the token, label, and scope.

8. **Audit the Creation**: Log the creation of the key using the `auditRoute` function.

9. **Return Response**: Send a JSON response with the new API key details, including the key, hint, label, and scope.

### Example Code Snippet
```javascript
teamRoutes.post("/keys", async (c) => {
  const teamId = requireTeam(c);
  const plan = c.get("apiPlan");
  const maxKeys = PLAN_LIMITS[plan].maxTeamKeys;

  const count = await countTeamKeys(c.env, teamId);
  if (count >= maxKeys) {
    return c.json({ error: "team_key_limit_reached", max: maxKeys }, 429);
  }

  let body = await c.req.json();
  const scopeInput = parseScopeBody(body);
  const token = generateApiKeyToken();
  const { apiKeyId, hint } = await addTeamKey(c.env, teamId, {
    token,
    label: body.label?.trim(),
    scope: scopeInput.scope,
  });

  auditRoute(c, {
    action: "team.key.created",
    resourceType: "api_key",
    resourceId: apiKeyId,
    meta: { hint, label: body.label ?? null },
  });

  return c.json({ id: apiKeyId, key: token, hint, label: body.label ?? null, scope: scopeInput.scope }, 201);
});
```

Make sure to handle errors appropriately at each step, such as invalid input or exceeding limits.
