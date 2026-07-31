# Trustworthy AI answer panel

Specify an answer panel for an enterprise research assistant. The assistant streams a response assembled from internal documents, but some claims may have weak or missing source support.

Requirements:

- People must be able to inspect the source behind a claim.
- The interface must communicate uncertainty without turning every answer into warning noise.
- The response can be interrupted, regenerated, copied, or rated.
- Sources can become unavailable after generation.
- Cover loading/streaming, partial output, failure, retry, and stale-source behavior.
- The product is used on desktop and narrow tablet layouts.

Do not invent accuracy rates, user research, or technical capabilities. Produce a concise specification with component behavior and acceptance criteria.
