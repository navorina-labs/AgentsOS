# MA16 (A)

## Answer

The API returns a 429 status code when the rate limit for the API key has been exceeded. This can occur due to the following reasons:

- **Rate Limit Exceeded**: The number of requests made in a given time period has surpassed the allowed limit for that API key.
- **Quota Exhausted**: If the inbox limit for the team or API key has been reached, resulting in a `429 inbox_limit_reached` error.

In both cases, the response will include headers indicating the rate limit status, such as `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`, which specifies how long to wait before making further requests.
