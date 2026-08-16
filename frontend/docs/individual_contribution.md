# Individual Contribution Report
## CoreHead CMS — AI-Assisted Layout Generation, Builder Integration and Subscription Controls

**Name/Role:** Developer / Software Engineer  
**Areas of Focus:** AI Generation Services, Drag-and-Drop Visual Builder Integration, Billing & Plan Entitlement Logic, Integration Testing, and Multi-Tenant Context Security.

---

### 1. Executive Summary
My individual contributions to the **CoreHead CMS** project focused on the design, integration, and verification of AI-driven website layout generation, its alignment with the visual block builder canvas, and the implementation of backend-enforced subscription controls. 

Specifically, I bridged the gap between raw LLM outputs and the database persistence layer by establishing schema validation, error fallbacks, and layout history logs. In addition, I worked on the builder's dynamic data system—primarily the **Blog Loop / Collection List** component—and tested the security interfaces enforcing JSON Web Token (JWT) credentials, tenant context validation (`X-Site-Id`), Stripe Checkout APIs, PayHere integrations, and plan limits.

---

### 2. AI-Assisted Layout & Content Services

I contributed to the implementation of the platform's AI content and layout pipelines, ensuring that natural-language descriptions provided by users translate into valid, structured page interfaces.

```
                  ┌──────────────────────────────────────────────┐
                  │                 User Prompt                  │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │          AI API Route (/api/ai/...)          │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             LLM Layout Generation            │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Validation Layer (layoutValidator.js)     │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────┴───────────────────────┐
                     Valid? ──[Yes]──► Store to DB & Render Canvas
                     │
                     └──[No]───► Run Fallback/Repair ──► Render Canvas
```

#### 2.1 Prompt-Based Layout Generation
* **Implementation & Integration**: Connected frontend prompt components to the backend AI services (`aiRoutes.js` and `aiService.js`).
* **Structured Layout Handlers**: Managed request payloads including layout types (Single Post vs. Archive templates), design styles (classic, minimalist, nature, dark, magazine), and custom feature arrays.
* **Component Mapping**: Restricted LLM outputs to the builder's valid block registry (Headings, Paragraphs, Images, Buttons, Quotes, Dividers, and Collection Lists) to avoid arbitrary HTML rendering.

#### 2.2 Structural Layout Validation & Reliability
* **Validator Integration**: Integrated backend schema checking (`layoutValidator.js`) to parse and validate AI-generated layout blocks before saving them to the database.
* **Schema Enforcement**: Prevented application failures by catching malformed AI payloads, repairing missing fields, and identifying unsupported block hierarchies.

#### 2.3 Fault Tolerance & Deterministic Fallbacks
* **Fallback Strategy**: Designed fallback layouts for communication failures, network latency, or invalid LLM JSON structures.
* **Seamless UX**: Ensured the builder canvas loads a default valid template rather than crashing or displaying raw errors when AI provider APIs are offline.

#### 2.4 Layout Modifications & Content Refinements
* **AI-Assisted Layout Modifications**: Integrated the `/ai/modify-layout` API, allowing users to apply conversational commands (e.g., *"change to a dark layout with 3 columns"*) to existing blocks while maintaining layout state.
* **Text Refinement Engine**: Tested content-refinement endpoints that permit text-level summaries, expansion, and grammar corrections without reloading the active canvas.
* **AI History Tracking**: Integrated site-scoped AI generation history (`/ai/history`), giving users traceability and allowing previously generated templates to be loaded onto current workspaces.

---

### 3. Visual Builder & CMS Workspace Integration

A primary objective was ensuring AI layouts integrated with manual editor workflows. I worked extensively on building components, separating static and dynamic properties, and binding CMS fields.

#### 3.1 Blog Loop / Collection List Component
* **Dynamic Collections**: Contributed to the development of the **Blog Loop** builder component. Instead of static mock content, it enables administrators to configure dynamic queries (e.g., filtering posts by category or ordering by published date).
* **Card Template Design**: Supported designing a single card template within the loop container that dynamically repeats based on the backend data fetch.
* **Dynamic Variable Binding**: Embedded CMS variables inside layout blocks to map data at runtime:
  * `{post.title}` / `{post.excerpt}`
  * `{post.content}` / `{post.featured_image}`
  * `{author.name}` / `{category.name}`
* **Static vs. Dynamic Execution**: Supported the UI distinction, enabling fields to switch between custom manual text values and database-backed dynamic CMS variables.

---

### 4. Subscription-Based Access Controls & Payment Gateways

I worked on the application's multi-tier access limits, ensuring that advanced features (like custom domains and AI generation) are restricted by subscription levels (FREE, PRO, ENTERPRISE).

```
                      Select Pricing Plan (PRO / ENTERPRISE)
                                        │
                                        ▼
                         Choose Payment / Gateway Option
                       /                                \
           [Stripe Checkout API]               [PayHere Sandbox SDK]
                     │                                   │
                     ▼                                   ▼
             Checkout Page                       Hosted Payment UI
                     │                                   │
                     ▼                                   ▼
             Success Webhook                     successRedirectUrl
                     \                                   /
                      ▼                                 ▼
                     Update Database Site Plan (site.plan = "PRO")
                                        │
                                        ▼
             Synchronized Access: Limits & Entitlements Updated
```

#### 4.1 Plan-Based Constraints & Entitlements
* **Site Limits**: Integrated backend plan enforcement checks preventing FREE tier users from spawning more sites than their quota allows.
* **AI Rate Limits**: Tied AI layout and text generation features to user tier records on the backend, preventing direct API manipulation.
* **Upgrade Redirections**: Configured settings interfaces to alert and redirect users to subscription options if billing features (such as custom domains) are locked.

#### 4.2 Multi-Gateway Payment Interfaces
* **Stripe Hosted Checkout**: Configured API routing (`/payment/checkout-session`) to request a Stripe Checkout Session for plan upgrades, routing the user to a secure hosted interface.
* **PayHere Sandbox Integration**: Configured PayHere gateway checks for alternative regional processing, handling success redirects (`/payment/success`) and payment dismissals.
* **Demo Plan Selection**: Contributed to the development of the admin billing panel (`/admin/settings/billing`), utilizing direct simulated upgrades (`updateSitePlan` API) to verify site configurations and plan states during testing.

---

### 5. API Verification, Security & Integration Testing

I verified system reliability and tenant isolation by testing the API surface under positive and negative conditions.

#### 5.1 Authentication & Workspace Scopes
* **JWT Integrity**: Verified that AI generation, history, and layout modifications are protected by JWT tokens.
* **Tenant Isolation (`X-Site-Id`)**: Confirmed that requests carry the `X-Site-Id` header to ensure backend queries are isolated to the active site context.
* **Data Security Testing**: Tested access control middleware to verify it returns `401 Unauthorized` for missing tokens, and `403 Forbidden` for users attempting cross-tenant template manipulations.

#### 5.2 Layout Persistence Testing
* **Layout Lifecycle**: Tested the lifecycle of templates: creation, layout saving, draft state retention, publication, and schema retrieval.
* **API Stability**: Verified that database schemas persist blocks in JSONB formats without corrupting nested grids, columns, or custom style arrays.

#### 5.3 Technical Verification Scenarios
The table below highlights the verification test cases I conducted:

| Test Case ID | Target Feature | Description / Scenario | Expected Result | Actual Result / Status |
|---|---|---|---|---|
| **TC-AI-01** | AI Layout Generation | Valid prompt request containing target styles and layout rules. | Returns valid, parsed JSON blocks conforming to builder schema. | **PASSED** |
| **TC-AI-02** | AI Validation | Malformed/irregular LLM JSON layout payload returned to backend. | System schema validator flags errors and loads deterministic fallback. | **PASSED** (Fallback Loaded) |
| **TC-AI-03** | AI Modification | Conversational modification instruction sent with current block array. | Returns updated JSON blocks reflecting modifications. | **PASSED** |
| **TC-SEC-01**| Auth Validation | Attempt to update templates/layouts without a valid JWT token. | API rejects request with `401 Unauthorized`. | **PASSED** |
| **TC-SEC-02**| Tenant Context | Attempt to read layout templates of Site B while active on Site A. | System flags discrepancy and returns `403 Forbidden`. | **PASSED** |
| **TC-SUB-01**| Site Limits | FREE tier workspace owner attempts to exceed site creation limits. | Backend rejects creation, prompting upgrade. | **PASSED** |
| **TC-PAY-01**| Upgrade Routing | Checkout initialized for PRO plan. | Directs user to payment gateway destination and updates plan status. | **PASSED** |

---

### 6. Summary of Key Contributions

| Contribution Area | Individual Work & Scope |
|---|---|
| **AI Layout Generation** | Integrated prompt-based layout generation APIs with Next.js editor pages. |
| **AI Validation & Reliability** | Enabled structural checks (`layoutValidator.js`) and safe default templates for AI failures. |
| **AI Page Modifications** | Configured existing block array manipulation via natural language prompts. |
| **AI Text Refinements** | Integrated text assistant utilities (grammar, expansion, and summaries). |
| **Blog Loop / Collections** | Implemented visual builder loop controls with repeating card designs. |
| **Data Variable Binding** | Mapped static fields to CMS databases (`post.title`, `author.name`, etc.). |
| **Multi-Tenant Security** | Verified JWT scopes and `X-Site-Id` context isolation for AI and layout queries. |
| **Subscription Entitlements** | Implemented backend-level site-creation limits and AI usage constraints. |
| **Payment Integrations** | Verified multi-gateway checkout routing (Stripe, PayHere, and simulated dashboard upgrades). |
| **Integration Testing** | Conducted structural and negative tests covering expired tokens, missing context, and AI service downtime. |
