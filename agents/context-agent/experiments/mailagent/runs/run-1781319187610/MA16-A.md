# MA16 (A)

## Answer

The API returns a 429 status code when the rate limit for the API key has been exceeded. This can occur due to the following reasons:

- **Rate Limit Exceeded**: The number of requests made with the API key has surpassed the allowed limit per minute.
- **Quota Exhausted**: The specific quota for active inboxes or other resources has been reached.

The response will typically include headers indicating the limit, remaining requests, and when the limit will reset.
