# MA16 (C)

## Answer

The API returns a 429 status code when the rate limit is exceeded. This occurs when the number of requests made by a client exceeds the allowed limit per minute. The response includes details about the rate limit, such as:

- `X-RateLimit-Limit`: The maximum number of requests allowed per minute.
- `X-RateLimit-Remaining`: The number of requests remaining in the current minute.
- `Retry-After`: The time in seconds to wait before making new requests. 

This behavior is implemented in the `rateLimit` function in `src/lib/rate-limit.ts`.
