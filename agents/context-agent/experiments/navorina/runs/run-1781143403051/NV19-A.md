# NV19 (A)

## Answer

The Magic Inbox OCR flow involves the following:

- **API Endpoint**: 
  - `POST /api/financial-mirror/ai/magic-inbox-receipt-hints` is used for processing receipts.

- **Functionality**:
  - It utilizes OCR (Optical Character Recognition) to extract information from receipts.
  - If the Tesseract OCR performance is weak, it falls back to a vision-based approach.

- **Client Integration**:
  - The client-side implementation is handled in `nucleus-magic-inbox-pdf.ts`.

- **Testing**:
  - Tests for this functionality can be run using `npm --prefix server run test:magic-inbox-receipt-hints`.

This flow is designed to enhance the user experience by automating the extraction of data from receipts, making it easier for users to manage their financial records.
