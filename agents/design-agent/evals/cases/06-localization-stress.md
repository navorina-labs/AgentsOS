# Localization and reflow stress test

Create a responsive behavior and QA specification for a checkout summary component being expanded from English to German, Arabic, and Japanese.

The component includes item names, quantities, prices, discount codes, tax, total, delivery estimate, an editable address, and “Place order” / “Return to cart” actions. It appears in a two-column desktop checkout and a single-column mobile checkout.

Cover:

- long translations and unbroken content;
- right-to-left layout and mixed-direction values;
- 200% browser zoom and large text;
- currency and date formatting;
- wrapping, overflow, action order, and reading order;
- content-driven layout transitions.

Do not solve required information by hiding it. Provide testable acceptance criteria.
