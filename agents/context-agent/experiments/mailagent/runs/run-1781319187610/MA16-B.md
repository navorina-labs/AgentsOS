# MA16 (B)

## Answer

The API returns a 429 status code for the following reasons:

- **Rate limit exceeded**: When the number of API calls per key per minute exceeds the limit set by the plan (e.g., 60 for free, 300 for pro).
- **Team key limit reached**: When the number of active team keys exceeds the maximum allowed for the plan.
- **Inbox limit reached**: When the number of active inboxes exceeds the maximum allowed for the plan.

The response includes headers such as `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`, along with a `Retry-After` header indicating when to retry the request.
