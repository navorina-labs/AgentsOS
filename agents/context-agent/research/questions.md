# Evaluation Question Bank

Minimum 125 test questions for AI Context OS experiments. Each question includes expected routing target.

**Format:** `ID | Question | Expected Core(s) | Domain`

---

## Business (25)

| ID | Question | Expected Core(s) |
|----|----------|------------------|
| B01 | Why did revenue drop last week? | Revenue Core |
| B02 | What is our current MRR? | Revenue Core |
| B03 | How has ARR grown over the last quarter? | Revenue Core |
| B04 | What is our monthly churn rate? | Revenue Core |
| B05 | Which pricing tier generates the most revenue? | Revenue Core, Paywall Core |
| B06 | Should we raise prices on the Pro plan? | Revenue Core, Paywall Core |
| B07 | What is our customer acquisition cost? | Revenue Core |
| B08 | What is the LTV to CAC ratio? | Revenue Core |
| B09 | Which customer segment has the highest retention? | Revenue Core |
| B10 | Did the recent paywall change affect conversion? | Paywall Core |
| B11 | What percentage of users convert from trial to paid? | Paywall Core |
| B12 | How many free users do we have? | Paywall Core |
| B13 | What happens when a trial expires? | Paywall Core |
| B14 | Are we losing money on the Starter tier? | Revenue Core |
| B15 | What was revenue impact of the Black Friday promotion? | Revenue Core |
| B16 | How do annual vs monthly subscriptions compare in revenue? | Revenue Core |
| B17 | What is our net revenue retention? | Revenue Core |
| B18 | Which marketing channel brings highest-paying customers? | Revenue Core |
| B19 | Did Stripe outage affect our revenue? | Billing Core, Revenue Core |
| B20 | How many failed payments did we have this month? | Billing Core |
| B21 | What is our refund rate? | Billing Core, Revenue Core |
| B22 | Are discounts hurting our margins? | Revenue Core |
| B23 | What is the revenue forecast for next quarter? | Revenue Core |
| B24 | How does our pricing compare to competitors? | Revenue Core, Product Core |
| B25 | What business KPIs are we missing? | Business Core |

---

## Product (25)

| ID | Question | Expected Core(s) |
|----|----------|------------------|
| P01 | What is this product? | Product Core |
| P02 | Who is the target user? | Product Core |
| P03 | What are the main features? | Product Core |
| P04 | What is on the roadmap for Q2? | Product Core |
| P05 | How does the onboarding flow work? | Onboarding Core |
| P06 | What is the activation rate for new users? | Onboarding Core |
| P07 | Where do users drop off during signup? | Onboarding Core |
| P08 | How can we improve first-run experience? | Onboarding Core |
| P09 | What user feedback have we received about feature X? | Product Core |
| P10 | Should we build feature Y? | Product Core |
| P11 | What personas do we serve? | Product Core |
| P12 | What is the core value proposition? | Product Core |
| P13 | How do users accomplish task Z? | Product Core |
| P14 | What features are behind feature flags? | Product Core, Technical Core |
| P15 | What is the difference between Free and Pro? | Product Core, Paywall Core |
| P16 | What integrations does the product support? | Product Core |
| P17 | What is the most used feature? | Product Core |
| P18 | What support tickets are most common? | Product Core |
| P19 | Is the mobile experience supported? | Product Core |
| P20 | What accessibility standards do we meet? | Product Core |
| P21 | How does our product compare to alternative X? | Product Core |
| P22 | What is the time-to-value for new users? | Onboarding Core |
| P23 | Should we remove feature W? | Product Core |
| P24 | What experiments are running on the product? | Product Core |
| P25 | What does the user journey look like from signup to power user? | Onboarding Core, Product Core |

---

## Technical (25)

| ID | Question | Expected Core(s) |
|----|----------|------------------|
| T01 | How is the system architected? | Technical Core |
| T02 | What tech stack do we use? | Technical Core |
| T03 | Where is authentication implemented? | Technical Core |
| T04 | What database do we use? | Technical Core |
| T05 | How does the API work? | Technical Core |
| T06 | What are the main services? | Technical Core |
| T07 | How is billing implemented in code? | Technical Core, Billing Core |
| T08 | Where is the Stripe webhook handler? | Technical Core, Billing Core |
| T09 | What is the data model for subscriptions? | Technical Core |
| T10 | How do we handle email sending? | Technical Core |
| T11 | What third-party dependencies do we have? | Technical Core |
| T12 | How is caching implemented? | Technical Core |
| T13 | What is the test coverage? | Technical Core |
| T14 | Where should I add a new API endpoint? | Technical Core |
| T15 | How do services communicate? | Technical Core |
| T16 | What is the authentication flow? | Technical Core |
| T17 | Are there known technical debt items? | Technical Core |
| T18 | How is multi-tenancy handled? | Technical Core |
| T19 | What ORM or query layer do we use? | Technical Core |
| T20 | How are background jobs processed? | Technical Core |
| T21 | What is the error handling pattern? | Technical Core |
| T22 | How is logging implemented? | Technical Core |
| T23 | What security measures are in place? | Technical Core |
| T24 | How do I run the project locally? | Technical Core |
| T25 | What ADRs exist for architectural decisions? | Technical Core |

---

## Operational (25)

| ID | Question | Expected Core(s) |
|----|----------|------------------|
| O01 | How do we deploy to production? | Operational Core |
| O02 | How do we deploy to staging? | Operational Core |
| O03 | What CI/CD pipeline do we use? | Operational Core |
| O04 | How do we roll back a deployment? | Operational Core |
| O05 | Production is down — what do we do? | Operational Core |
| O06 | What monitoring do we have? | Operational Core |
| O07 | What alerts are configured? | Operational Core |
| O08 | What was the last incident? | Operational Core |
| O09 | What is our uptime SLA? | Operational Core |
| O10 | Who is on call this week? | Operational Core |
| O11 | How do we access production logs? | Operational Core |
| O12 | What environments exist? | Operational Core |
| O13 | How long does a deploy take? | Operational Core |
| O14 | What is the disaster recovery plan? | Operational Core |
| O15 | How do we scale the application? | Operational Core |
| O16 | What cloud provider do we use? | Operational Core |
| O17 | How are secrets managed? | Operational Core |
| O18 | What happened during incident #42? | Operational Core |
| O19 | How do we run database migrations in production? | Operational Core, Technical Core |
| O20 | What is the backup schedule? | Operational Core |
| O21 | How do we debug a production issue? | Operational Core |
| O22 | What is the status page URL? | Operational Core |
| O23 | How do we rotate API keys? | Operational Core |
| O24 | What SLOs are we tracking? | Operational Core |
| O25 | How do we perform a zero-downtime deploy? | Operational Core |

---

## Mixed (25)

| ID | Question | Expected Core(s) |
|----|----------|------------------|
| M01 | Revenue dropped — is it a product issue or billing bug? | Revenue Core, Billing Core, Product Core |
| M02 | Deploy the new billing feature to production | Technical Core, Operational Core, Billing Core |
| M03 | Users can't complete signup — what's wrong? | Onboarding Core, Technical Core |
| M04 | Should we add a free tier? | Product Core, Revenue Core, Paywall Core |
| M05 | Stripe webhook is failing — impact on revenue? | Billing Core, Revenue Core, Operational Core |
| M06 | How does pricing affect onboarding conversion? | Paywall Core, Onboarding Core |
| M07 | New feature shipped — how to deploy and measure impact? | Product Core, Operational Core, Revenue Core |
| M08 | Is the production outage affecting paying customers? | Operational Core, Revenue Core |
| M09 | Improve trial conversion end-to-end | Onboarding Core, Paywall Core, Product Core |
| M10 | What technical changes are needed for a new pricing tier? | Technical Core, Paywall Core, Revenue Core |
| M11 | Customer complained about billing — investigate | Billing Core, Product Core, Operational Core |
| M12 | How do we safely migrate the database for billing v2? | Technical Core, Operational Core, Billing Core |
| M13 | Competitor lowered prices — what should we do? | Revenue Core, Product Core |
| M14 | Feature flag rollout caused errors — full impact? | Technical Core, Operational Core, Product Core |
| M15 | Onboarding redesign — expected revenue impact? | Onboarding Core, Revenue Core, Product Core |
| M16 | How to set up monitoring for the new payment flow? | Operational Core, Billing Core, Technical Core |
| M17 | Churn spiked after last deploy — root cause? | Operational Core, Revenue Core, Technical Core |
| M18 | Build vs buy for email infrastructure? | Technical Core, Product Core, Revenue Core |
| M19 | GDPR request — what data do we store and where? | Technical Core, Operational Core, Product Core |
| M20 | Launch in EU — billing and compliance changes? | Billing Core, Technical Core, Product Core |
| M21 | A/B test on paywall — how to implement and measure? | Paywall Core, Technical Core, Revenue Core |
| M22 | Support says users can't pay — diagnose | Billing Core, Technical Core, Operational Core |
| M23 | Reduce infrastructure cost without hurting revenue | Operational Core, Revenue Core, Technical Core |
| M24 | New engineer onboarding — what should they read? | Product Core, Technical Core, Operational Core |
| M25 | End of quarter review — business health and system status | Revenue Core, Operational Core, Product Core |

---

## Usage

1. Select subject-specific subset or use full bank
2. Write gold-standard answers per subject project
3. Label routing targets (may differ slightly per project)
4. Run experiment per [experiment-design.md](experiment-design.md)
5. Report scores per domain in results

---

## Extension

Add project-specific questions in `experiments/{subject}/questions.md` extending this bank.
