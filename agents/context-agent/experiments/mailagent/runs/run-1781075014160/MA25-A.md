# MA25 (A)

## Answer

To create a team API key, you can use the following command:

```bash
curl -s -X POST "$MAILAGENT_API_URL/v1/team/keys" \
  -H "Authorization: Bearer $MAILAGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"label":"ci-bot"}' | jq .
```

### Steps:
1. Ensure you have a valid `MAILAGENT_API_KEY`.
2. Use the above command, replacing `"ci-bot"` with your desired label for the key.
3. The response will include the newly created key, which is shown only once. Save it securely. 

### Note:
- You can also create a scoped key with specific permissions by including a `scope` object in the JSON body.
