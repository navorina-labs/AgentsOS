# NV31 (C)

## Answer

The assistant AI usage limits are defined in the `server/ai-limits.js` file and are categorized by user tiers:

- **Free Tier Limits:**
  - financial_verdict: 10
  - portfolio_risk_brief: 10
  - snapshot_analysis_crew: 0
  - goal_planning_crew: 0
  - debt_management_crew: 0
  - trade_review: 0
  - trade_chart_vision: 0
  - money_leak: 5
  - tx_explain: 5
  - monthly_brief: 2
  - crypto_reconcile_brief: 1
  - periodic_review: 1
  - crypto_holdings_explain: 3
  - batch_categorize: 2
  - tax_agent: 0
  - magic_inbox_receipt_ocr: 20

- **Premium Tier Limits:**
  - Same as the limits defined in `premiumLimits` object, which includes higher limits for various agent types.

- **Unlimited Tier Limits:**
  - Same as the limits defined in `premiumLimits` object.

The limits are enforced on a monthly basis, and exceeding these limits results in an error indicating that the AI limit has been exceeded.
