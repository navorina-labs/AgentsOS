# MA16 (B)

## Answer

The API returns a 429 status code for the following reasons:

- **Rate Limit Exceeded**: When the number of API calls per key per minute exceeds the limit defined by the plan. This is indicated by the error code `rate_limit_exceeded`.
- **Team Key Limit Reached**: When the number of active team keys exceeds the maximum allowed for the plan, indicated by the error code `team_key_limit_reached`.
- **Inbox Limit Reached**: When the number of active inboxes exceeds the maximum allowed for the plan, indicated by the error code `inbox_limit_reached`.

In all cases, the response includes headers such as `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After` to provide additional information about the rate limits.
