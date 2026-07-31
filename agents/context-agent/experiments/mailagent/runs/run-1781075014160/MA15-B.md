# MA15 (B)

## Answer

The API returns a `401 unauthorized` error for the following reasons:

- Invalid or missing `Authorization: Bearer <token>` in the request.
- The provided API key (`ma_…` in DB or legacy `API_KEY`) or OAuth access token (`mat_…`) is not valid or has expired.
- The request is made to a protected endpoint without proper authentication.
