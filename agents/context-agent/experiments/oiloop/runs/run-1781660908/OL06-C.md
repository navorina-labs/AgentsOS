# OL06 (C)

## Answer

When a user requests "organize downloads," the following occurs:

- The **FileOrganizer** scans the Downloads folder for loose files.
- It checks user-defined rules (e.g., "don't touch invoices") using the **RuleEnforcer**.
- A proposed plan for organizing files is created by the **FileOrganizeService**.
- The user is presented with a **FilePreviewSheet** to confirm or cancel the proposed file movements.
- If confirmed, the files are moved according to the plan. 

This process ensures that no files are moved without explicit user confirmation.
