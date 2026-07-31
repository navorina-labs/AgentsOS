# MA43 (B)

## Answer

The Worker requires the following Wrangler bindings:

| Binding      | Type                | Resource                | Purpose                                                  |
|--------------|---------------------|-------------------------|----------------------------------------------------------|
| `MAIL_QUEUE` | Queue producer       | `mailagent-email`       | Asynchronous processing of incoming emails after Resend webhook |
| `INBOX_WAIT` | Durable Object       | class `InboxWait`      | SSE/wait: notifies the client about new messages         |
| `RAW_MIME`   | R2 bucket            | `mailagent-raw-mime`   | Storage of raw `.eml` files and large attachments        |
| `RATE_LIMIT` | KV namespace         | id in `wrangler.jsonc` | Rate limit by API key / plan                             |
| `AI`        | Workers AI           | platform binding        | Semantic search, structured extract (LLM)                |
| `ASSETS`    | Static assets        | `./public`             | Landing page, docs HTML, `run_worker_first: true`       |
