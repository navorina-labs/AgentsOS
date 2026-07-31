# NV19 (C)

## Answer

The Magic Inbox OCR flow involves the following steps:

- **File Upload**: Users upload a PDF or image file containing receipts to the Magic Inbox.
  
- **File Type Detection**: The system checks if the uploaded file is a PDF or an image.
  
- **OCR Processing**:
  - For PDFs:
    - The file is analyzed to extract text content.
    - If text extraction fails, filename hints are used.
  - For images:
    - The image is processed using OCR to recognize text, including total amount, date, and merchant.
    - If OCR recognition is weak, a server-side fallback is attempted to enhance the hints using a vision API.

- **Hint Merging**: The extracted OCR data is merged with hints derived from the filename and any additional text.

- **Result Compilation**: The final hints (amount, date, merchant) are compiled and returned to the user.

- **Storage**: The processed receipt hints are stored in the Magic Inbox for further actions, such as matching with transactions.

- **Error Handling**: Notifications are sent to the user if the OCR process fails or if the hints are weak, indicating reliance on filename hints.
