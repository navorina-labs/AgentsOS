# Playbook: Building Context Cores

This playbook is a step-by-step practical guide for developers and architects to analyze a repository, define responsibility boundaries, compress guidelines, configure routing, and maintain **Context Cores** using the **AI Context OS** framework.

---

## The Core Philosophy: Sufficiency Over Completeness

Traditional code assistants load entire repositories or use semantic search (RAG) over raw code chunks. This introduces token inflation, slow responses, and attention dilution. 

Context Cores operate on the **Minimal Context Principle**:
> [!IMPORTANT]
> Provide the minimum context sufficient to make the decision at hand. Minimize noise to maximize the model's reasoning accuracy.

---

## Step-by-Step Core Building Pipeline

```text
Step 1: Domain Mapping ──► Step 2: Extraction ──► Step 3: Template Population
                                                               │
Step 6: Maintenance   ◄── Step 5: Routing    ◄── Step 4: Pruning & Tuning
```

---

## Phase 1: Domain Mapping & Boundary Definition

Before writing any text, map the repository's modules to distinct **Context Cores**. 

### 1. The Standard Four-Core Baseline
For most SaaS and web applications, start with these four cores:
1. **Personal/Default Core (`personal-core`):** Developer identity, conversational memory, and task state.
2. **Workspace Core (`workspace-core`):** Database schemas, local files, scratch pads, and folder organization rules.
3. **Communication Core (`communication-core`):** Messaging APIs, mail draft structures, templates, and integration routes.
4. **System Control Core (`system-control-core`):** Subprocess runners, shell environments, script files (JXA, AppleScript), keyboard/mouse inputs, and hardware access.

### 2. Spawning Project-Specific Subcores
If a project features highly complex sub-domains (e.g. a billing module with Stripe, or a spatial tracking pipeline in spatial companion apps), spawn a **Subcore** to prevent the parent core from exceeding token limits.
* *Rule of thumb:* Spawn a subcore if a specific domain requires more than **1,500 tokens** of rules and API contracts.

### 3. Setting Hard Scope Boundaries
For each core, explicitly document what is **In Scope** and **Out of Scope** (including deferral rules).
> [!WARNING]
> If a core lacks clear boundaries, it will leak context. A technical core containing webhook implementation logic *must* defer database transaction details to the database core.

---

## Phase 2: Extracting Entities & Rules

Cores contain **prose guidelines** and **structural symbol mappings**, not raw source code.

### 1. Technical/Architecture Entities
Use static analysis or grep to compile a list of:
* Class names and structural responsibilities.
* Key public API endpoints (without internal implementations).
* System configurations and settings dictionaries (e.g., `PresenceSettings`, `MailSettings`).
* Third-party package dependencies (SDK names and versions).

### 2. Invariants & Constraints
Gather the codebase invariants—rules that the model *must* respect during code generation or decision support:
* *Security invariants:* e.g., *"No destructive write operations without user confirmation."*
* *Sandbox invariants:* e.g., *"Temporary files must be written strictly to security-scoped bookmark paths."*
* *Threading invariants:* e.g., *"Isolate UI services to `@MainActor` under strict concurrency."*

---

## Phase 3: Template Population Guidelines

Use the standard templates located in [context-os/cores/](../context-os/cores/) to write your cores.

### Structure of a Context Core Document

```markdown
# [Domain Name] Core

## Metadata
| Field | Value |
|-------|-------|
| id    | core-identifier |
| version | 1.0.0 |
| parent_core | parent-identifier or null |
| last_updated | YYYY-MM-DD |

## Purpose
A concise 2-3 sentence statement explaining what class of decisions this core supports.

## Scope
### In Scope
- Detailed bullet list of topics handled by this core.
### Out of Scope
- Detailed list of topics deferred elsewhere (e.g., "Database writes -> Defer to Workspace Core").

## Key Entities
| Entity Name | Location / File | Responsibility |
|-------------|-----------------|----------------|
| `ClassName` | `file://...`    | Summary description of what it does |

## Invariants & Rules
1. Hard architectural constraints.
2. Coding standards and API rules for this domain.

## Exclusions
- Explicit list of files or APIs that should never be loaded (e.g., full test files, legacy migration classes).

## Sources
- Absolute or relative file paths linking to primary source files where these interfaces are defined.
```

---

## Phase 4: Context Compression & Tuning

A context core must be highly compressed to remain efficient. Convert raw code patterns into high-density prose rules.

### 1. Code Pruning Examples

#### Bad (Raw Code Dump - 240 tokens):
```swift
struct MailSettings: Codable {
    var mailEnabled: Bool = false
    var inboxFetchLimit: Int = 10
    var useCustomMail: Bool = false
    var imapHost: String = ""
    var imapPort: Int = 993
    var imapUser: String = ""
    var imapPass: String = ""
    var imapDraftsFolder: String = "Drafts"
    var sendViaSmtp: Bool = false
    var smtpHost: String = ""
    var smtpPort: Int = 465
    var smtpUser: String = ""
    var smtpPass: String = ""
}
```

#### Good (Compressed Prose - 42 tokens):
> Configured via `MailSettings` (Codable struct in `PersonaSettings.swift`). Tracks toggles for mail enablement, custom IMAP/SMTP host/port/credentials, and drafts folder selection.

### 2. Computing Core Compression Ratio (CCR)
Measure the efficiency of your core using the following metric:
$$\text{CCR} = \frac{\text{Tokens in Full Repository (Condition A)}}{\text{Tokens in Compiled Context Core (Condition B)}}$$
* *Target CCR:* $\ge 10\times$ (for large codebases, targets of $50\times$ to $100\times$ are common).

### 3. Ablation Testing
To optimize your core:
1. Run a sample query set against the core.
2. Remove a paragraph or metadata table from the core document.
3. Re-run the queries. If accuracy or actionability does not degrade, **permanently remove the section** to keep the core minimal.

---

## Phase 5: Configuring Routing Rules

A Core is only useful if the user query reaches it. Configure the **Context Router** to classify user intent.

### 1. Define Keyword Vocabulary
For each core, compile a list of highly specific domain keywords:
* **`communication` core:** `mail`, `inbox`, `telegram`, `slack`, `сообщение`, `почта`.
* **`systemControl` core:** `terminal`, `keyboard`, `click`, `run`, `запустить`, `нажми`.

### 2. Multi-Core Routing for Cross-Cutting Tasks
Some tasks span multiple domains (e.g., *"archive desktop screenshots"* touches both workspace files and system graphics APIs). 
* **Implementation Rule:** If the query scores highly in two domains (e.g., scores are within 1 point of each other and both are $\ge 2$), **return both cores** and instruct the prompt builder to compose their guidelines.

---

## Phase 6: Core Maintenance & Drift Mitigation

As the code changes, Context Cores risk becoming stale (semantic drift).

### 1. Sync Audits
Incorporate context core updates into your development lifecycle:
* **Rule:** If a Pull Request modifies a file listed in the `Sources` table of a core, or changes a class listed under `Key Entities`, the developer **must** review and update the corresponding context core document.

### 2. Automated Drift Checks
Set up a git pre-commit hook or CI step to verify that:
* All file links listed in `Sources` actually exist in the working directory.
* Key class declarations mentioned in cores are still present in AST symbol trees.

---

## Real-world Case Studies

### 1. MailAgent (TypeScript, 320k LOC)
* **Strategy:** Leveraged a flat 6-core model. Lexical keyword routing proved highly effective (F1-score: 1.00) because business domains (e.g., IMAP folders, AI classification rules) had distinct keywords.
* **Result:** Achieved a **45× Core Compression Ratio** and **3× latency reduction** with zero quality regression.

### 2. Oiloop (macOS Swift App, 180k LOC)
* **Strategy:** Used a 5-core model. A single-core routing approach initially failed on cross-cutting tasks (e.g., screenshot organization) due to high coupling between macOS APIs.
* **Mitigation:** Implemented **Multi-Core Routing**, enabling the router to load both `workspace` and `systemControl` guidelines.
* **Result:** Restored quality to a **60.0% expert preference rate** while keeping an **83× Core Compression Ratio** and **98.5% cost savings**.
