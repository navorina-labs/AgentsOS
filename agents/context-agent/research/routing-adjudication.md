# Routing Boundary Adjudication — Technical vs. Operational

This document defines the boundary classification guidelines to resolve routing overlaps between the **Technical Core** (`technical-core`) and the **Operational Core** (`operational-core`) in AI Context OS.

---

## 1. Domain Definitions

| Core | Primary Scope | Primary Keywords |
| :--- | :--- | :--- |
| **Technical Core** | Code structure, architecture, class interfaces, databases schema, language syntax, algorithms, package compilation, and logic. | API, schema, database design, package targets, imports, functions, handlers, logic. |
| **Operational Core** | Runtime environment, hosting, deployments, CI/CD pipeline runs, host configurations, system diagnostics (CPU/RAM/Network), process/port management, and credentials. | deploy, secrets, monitoring, logs, rollback, ports, process, ping, top, df. |

---

## 2. Adjudication Matrix

| Query Scenario / Topic | Target Core | Boundary Adjudication Rule & Rationale |
| :--- | :---: | :--- |
| **Port Management** | `operational-core` | Runtime port checking (`lsof`) and process termination (`kill`) are immediate runtime environment interventions. |
| **Local Compilation** | `technical-core` | Commands like `swift build` or `npm install` verify codebase structure and dependency syntax locally. |
| **CI/CD Pipelines** | `operational-core` | Build automation and remote deployment scripts (e.g. GitHub Actions, Wrangler deploy) control release delivery. |
| **Database Migrations Run** | `operational-core` | Applying migrations to database environments is an operational deployment stage. |
| **Database Schema Design** | `technical-core` | Fields, indexes, table structures, and constraint logic belong to codebase architecture and data-model definitions. |
| **Secrets & Keys Injection** | `operational-core` | Managing environment variables (Keychain, wrangler secrets) is environment setup, keeping keys out of the codebase. |
| **HTTP Error Handling** | `technical-core` | Writing code to catch exceptions, format JSON responses, and assign error status codes is technical logic. |
| **Log Analysis** | `operational-core` | Fetching and parsing production server logs for runtime errors. |
| **System Diagnostics** | `operational-core` | CPU load averages, memory exhaustion checks, disk space checks, and network packet pings. |
| **Code Layout** | `technical-core` | Swift target maps, package files, folder hierarchies, and source module imports. |

---

## 3. Case Studies (Adjudicated Questions)

### MailAgent Project
- **MA10 ("What environment variables are required?")**
  * *Adjudication:* Routed to `deployment-testing-core` (Operational). Variables represent environment configuration required for deployment.
- **MA43 ("What wrangler bindings does the Worker need?")**
  * *Adjudication:* Routed to `deployment-testing-core` (Operational). Bindings represent resource configuration on the Cloudflare hosting platform.
- **MA03 ("Why are users not receiving emails?")**
  * *Adjudication:* Routed to `email-core` (Technical) and `technical-core` because it covers logic limits (`allowed_senders`) alongside pipeline ingest code.

### Oiloop Project
- **OL08 ("Is my Mac slow? / Check system health")**
  * *Adjudication:* Routed to `personal-core` (General fallback). Since Oiloop is a companion client without backend servers, client system diagnostics map to the user personal core domain.
- **OL15 / OL17 (Cross-cutting reminders and volume controls)**
  * *Adjudication:* Routed via mixed routing to both `workspace-core` (holding sandbox documents) and `system-control-core` (holding AppleScripts for hardware volume).
