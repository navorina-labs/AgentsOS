# Nucleus misc (contact, journal, Magic Inbox OCR)

## Contact page

- Публично: `Navorina/contact.html` — статика, `mailto:` (support / partnerships).
- Settings → **Help & support** (K7) — ссылка на contact + docs.
- Черновик формы + API: `Navorina/contact-form.html` (`noindex`), `POST /api/financial-mirror/contact`, `server/routes/contact.js`, `npm run test:contact-route`.

## Trade journal (N6–N7)

- Hub: `nucleus-trade-journal-hub.ts`, сессии: `nucleus-trading-session-memory.ts`, UI Insights → Journal.
- Тесты: `npm run test:nucleus-trading-session`, `npm run test:nucleus-trade-journal-summary`; e2e: `e2e/nucleus-trade-journal.spec.ts`.

## Magic Inbox server OCR (J6)

- API: `POST /api/financial-mirror/ai/magic-inbox-receipt-hints` (лимит `magic_inbox_receipt_ocr`, все тарифы).
- Клиент: при слабом Tesseract OCR → vision fallback (`nucleus-magic-inbox-pdf.ts`).
- Тесты: `npm --prefix server run test:magic-inbox-receipt-hints`.
