# MA16 (C)

## Answer

The API returns a 429 status code when the rate limit is exceeded. This occurs when:

- The number of requests made by a client exceeds the allowed limit per minute.
- The response includes headers indicating the rate limit status, such as:
  - `X-RateLimit-Limit`: The maximum number of requests allowed.
  - `X-RateLimit-Remaining`: The number of requests remaining in the current time window.
  - `Retry-After`: The time in seconds to wait before making another request.

This behavior is implemented in the `rateLimit` function in `src/lib/rate-limit.ts`.
