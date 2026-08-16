# Software Requirements Specification (SRS)
## CoreHead CMS — Visual Blog Builder & Layout Management Module

---

## 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to specify the functional and non-functional requirements of the **Corehead CMS Visual Blog Builder & Layout Management Module**. 
This module provides an embedded, low-code interface within the Corehead CMS Admin Panel that allows administrators to visually design, customize, and assign blog templates and static layouts. It leverages Next.js, Tailwind CSS, an Express-based REST API backend, PostgreSQL database isolation, and AI-powered layout generation.

This document serves as a guide and technical reference for:
* Developers & Architects
* Project Supervisors & Lecturers
* Quality Assurance (QA) Testers
* Future System Maintainers

### 1.2 Document Conventions
This document is structured in accordance with IEEE SRS standards and utilizes the following conventions:
* **FR-XX**: Functional Requirements (mandatory system actions).
* **NFR-XX**: Non-Functional Requirements (quality attributes, security, and performance constraints).
* **"shall"**: Used to indicate strict mandatory system behavior.
* **X-Site-Id**: The HTTP header used to scope all admin data requests to the active multi-tenant site workspace.
* All layout templates are structured and validated using JSON schema objects.

### 1.3 Intended Audience and Reading Suggestions
1. **Developers**: Refer to Section 2 (System Architecture & Functions), Section 3 (Software/Data Interfaces), and Section 4 (Functional Requirements) to understand implementation logic, routing, and database schema mappings.
2. **Project Supervisors & Lecturers**: Refer to Section 1.4 (Product Scope), Section 2 (Overall Description), and Section 5 (Non-Functional Requirements) to evaluate system completeness and architecture viability.
3. **QA Testers**: Reference Section 4 (Functional Requirements) and Section 5 (Other Non-Functional Requirements) to formulate unit, integration, and security test cases.
4. **Future Maintainers**: Check Section 3 (External Interfaces) and Section 6 (Glossary) for configuration models, token management, and workspace context definitions.

### 1.4 Product Scope
The Corehead CMS Visual Blog Builder Module transforms traditional static blog template structures into a flexible, dynamic design system. The system operates inside the multi-tenant Corehead CMS platform and enables:
* **Dynamic Layout Templating**: Creating Single Post templates and Blog Archive templates.
* **Low-Code Canvas Builder**: Dragging and dropping blocks (Heading, Text, Image, Container, Columns, and Blog Loop / Collection List).
* **Dynamic Content Binding**: Mapping static elements to dynamic variables (`post.title`, `post.content`, `post.featured_image`, `author.name`).
* **AI-Assisted Layout & Blog Generation**: Generating complete schemas, modifying templates, and drafting content using LLM prompts.
* **Workspace Isolation**: Ensuring distinct sites cannot access each other's layouts or metadata.
* **Public Tenant Rendering**: Dynamically translating saved JSON schemas into search engine optimized (SEO) HTML pages on public routes via a `PublicPageRenderer` component.

#### 1.4.1 Problem in Brief
Conventional CMS systems enforce static layout themes that require HTML/CSS edits or custom developer pipelines to update. This leads to:
* Limited layout customization options for non-technical users.
* High turnaround times for template changes.
* Difficulty in binding site metadata and CMS attributes dynamically.
* Lack of robust isolation and customization in multi-tenant environments.
* Inefficient content creation pipelines that do not utilize modern AI models.

#### 1.4.2 Aim and Objectives
##### 1.4.2.1 Aim
To develop a dynamic, multi-tenant low-code Visual Blog Builder and Layout Management module within the Corehead CMS platform, enabling administrators to visually design, customize, bind, and render blog pages using a drag-and-drop canvas, and leverage AI content generation.

##### 1.4.2.2 Objectives
1. Provide a drag-and-drop visual builder canvas at `/admin/builder` to construct page layouts.
2. Store page structures as layout JSON schemas in a PostgreSQL database via Prisma ORM.
3. Implement a dynamic Data Binding system to link layout components to CMS dynamic fields (`post.title`, `author.name`, etc.).
4. Support the creation and modular assignment of **Single Post Templates** and **Blog Archive Templates** globally or scoped to specific categories.
5. Provide a **Blog Loop (Collection List)** component for rendering repeating list/grid structures of published posts.
6. Enable live preview mode (`/admin/builder/preview`) inside the builder using real CMS test posts.
7. Build a high-performance `PublicPageRenderer` component in Next.js to render JSON schemas to responsive public tenant sites (`/s/{slug}`).
8. Integrate AI generation endpoints (`/api/ai/generate-layout`, `/api/ai/modify-layout`, `/api/ai/generate-blog`) for automated page design.
9. Enforce data isolation using the `X-Site-Id` header and JWT-based Role-Based Access Control (RBAC).

### 1.5 References
1. *Corehead CMS Internal Design & Product Documentation* ([COREHEAD_PRODUCT_DOCUMENTATION.md](file:///c:/Users/deham/Desktop/Corehead/frontend/docs/COREHEAD_PRODUCT_DOCUMENTATION.md))
2. *IEEE 830 / IEEE 29148 Software Requirements Specification Standard*
3. *Next.js Official Documentation* — https://nextjs.org/docs
4. *PostgreSQL Documentation* — https://www.postgresql.org/docs/
5. *Prisma ORM Reference* — https://www.prisma.io/docs
6. *ExpressJS Documentation* — https://expressjs.com/
7. *JSON Web Token (JWT) Introduction* — https://jwt.io/introduction

---

## 2. Overall Description

### 2.1 Product Perspective
The Visual Blog Builder is a key module integrated into the multi-tenant **Corehead CMS** architecture. It interacts with the core authentication, site routing, media library, and blog posting services.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / Client (Next.js App Router)                      │
│  • Marketing Pages (/, /pricing, /guides)                   │
│  • Admin Workspace Dashboard (/admin, /admin/layouts, …)   │
│  • Visual Canvas Editor (/admin/builder)                     │
│  • Tenant Branded Public Frontend (/s/{slug}/*)             │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP Request (JWT + X-Site-Id)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Express API Backend (Node.js REST Server)                  │
│  • Auth Middleware (JWT guard & Site membership check)       │
│  • Layout Builder & Template Controllers                    │
│  • AI generation routes & external LLM integrations         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Database Layer (PostgreSQL via Prisma ORM)                 │
│  • Site isolation via `siteId` foreign keys                 │
│  • Layout schemas stored in JSONB formats                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Product Functions

#### 2.2.1 Auth & Session System
* Users can sign up, verify their email via an OTP code, and log in securely.
* The system manages sessions using JWT tokens stored in client `localStorage` and synced to cookies for middleware-level route protection.
* Roles determine access limits (Platform Admin vs Site Owner, Editor, Author, User).

#### 2.2.2 Workspace Multi-Tenancy
* Administrators can manage multiple sites under one profile.
* Switching the active site in the admin panel updates the `currentSiteId` in storage.
* The system attaches the active site ID to the backend via the `X-Site-Id` header to isolate content.

#### 2.2.3 Visual Drag-and-Drop Canvas
* Provides visual blocks (Heading, Text, Image, Container, Columns, Blog Loop) that can be dragged, reordered, styled, or deleted.
* Supports Tailwind CSS styling presets for margins, paddings, typography, alignment, and background colors.

#### 2.2.4 Layout Templates & Assignment
* Users can create and list layouts, edit raw JSON definitions, or load them directly into the visual editor canvas.
* Supports assigning layout templates to posts globally or overriding them per category.

#### 2.2.5 Public Rendering & Preview
* Admin Visual Editor provides a Preview Mode (`/admin/builder/preview`) using live draft and published posts.
* Public tenant sites resolve via slug API (`/api/sites/by-slug/:slug`) and fetch active templates to render dynamic pages.

#### 2.2.6 AI Content & Layout Assistant
* Allows generating visual layouts directly from prompts.
* Allows modifying layout properties (e.g., "make it a dark theme with three columns") through conversational AI commands.
* Drafts SEO-optimized blog posts using custom topics, tone settings, and targeted keywords.

#### 2.2.7 Settings
* **Appearance Settings**: Configures themes, colors, and site headers/footers.
* **Website Settings**: Configures basic branding (names, logos).
* **Domain Settings**: Allows custom domains with live DNS TXT verification.
* **Billing Tiers**: Provides demo plans (Free, Premium, Enterprise).

### 2.3 User Classes & Roles
* **Platform Admin**: Super-user with full administrative access to user databases, sites, templates, and general platform metrics.
* **Site Owner**: The creator/owner of a site. Has full read, write, update, delete, and publish permissions for site-scoped templates, posts, team members, domains, and configurations.
* **Site Editor / Author**: Team members invited to collaborate. Can read and write layouts/posts, but cannot change billing plans, custom domains, or platform settings.
* **Public Reader**: Non-authenticated visitors reading public blog articles on public tenant paths.

### 2.4 Operating Environment
* **Client Frontend**: Next.js App Router running on modern browsers (Chrome, Edge, Safari, Firefox).
* **Application API Server**: Node.js runtime environment hosting Express.js.
* **Database**: PostgreSQL (Prisma ORM layer) storing relational records and layout schemas.
* **Deployment**: Platforms supporting Next.js (e.g., Vercel) and Node.js servers (e.g., AWS, Vercel, DigitalOcean).

### 2.5 Design and Implementation Constraints
1. **JSON Schema Isolation**: All canvas elements must be represented in a structured layout JSON scheme containing component typings, style classes, and binding variables.
2. **Data Separation**: Every DB transaction inside admin services must execute a where query matching `siteId` derived from `X-Site-Id`.
3. **SEO and Performance**: Public routes must be pre-rendered or fast-rendered with Next.js optimization tools (`next/image`, `next/link`) to avoid Cumulative Layout Shift (CLS) issues.
4. **AI Output Validation**: System must run all LLM outputs through a validator (`layoutValidator.js`) to guarantee correct block formats before saving.

### 2.6 User Documentation
* Admin User Guide: Explains layout creation and blocks toolbox usage.
* Binding Mapping Sheet: Lists available database attributes for binding.
* Developer Readme: Config instructions for backend, database migrations, and testing scripts.

### 2.7 Assumptions and Dependencies
* Corehead CMS content database (posts, categories, media uploads) exists and is accessible.
* LLM API (OpenAI/Gemini) endpoints are accessible.
* PostgreSQL database service is available and online.

---

## 3. External Interface Requirements

### 3.1 User Interfaces

#### 3.1.1 Landing Page & Dashboard Overview (`/admin`)
* Entry point displaying dashboard summaries, active posts, site status, and sidebar links.

#### 3.1.2 Login & Onboarding (`/login`, `/signup`, `/verify-email`, `/onboarding/create-site`)
* Credentials input panel, verification screen for OTP, and a creation wizard for initial company workspace details (name, slug).

#### 3.1.3 Workspace Manager (`/admin/sites`)
* Lists all owned or delegated site spaces, highlights active workspaces, and allows creating or deletion of sites.

#### 3.1.4 Visual Canvas Builder (`/admin/builder`)
* Contains a drag-and-drop workspace, visual block palettes, property styling controls, and an AI chat assistant drawer.

#### 3.1.5 Layout Manager (`/admin/layouts`)
* Lists stored templates, status indicators (Draft/Published), types (Single Post/Archive), and allows manual JSON edits.

#### 3.1.6 Template Assignment Page (`/admin/template-assignment`)
* Configures bindings for default site layouts and category-scoped overrides.

#### 3.1.7 Dynamic Data Binding (`/admin/binding`)
* Configures custom bindings between custom elements and database records.

#### 3.1.8 Appearance Settings (`/admin/settings/appearance`)
* Sets color schemes, font presets (Google Fonts), headers, footers, and home feed layouts.

#### 3.1.9 Custom Domain Verification (`/admin/settings/domain`)
* Allows inputting custom domains and provides generated TXT host-value verification steps.

#### 3.1.10 Public Tenant Site (`/s/{slug}`, `/s/{slug}/blog`, `/s/{slug}/blog/{postSlug}`)
* Renders the branded homepage, published blog lists, and detailed pages using theme variables and layouts.

### 3.2 Hardware Interfaces
No specific physical hardware interfaces. Standard network connections and computer/mobile browser support are sufficient.

### 3.3 Software Interfaces
1. **PostgreSQL / Prisma Database Interface**: Stores schemas, tables (users, sites, posts, templates), and relations.
2. **Express.js API Router**: Handles all client-side JSON REST requests.
3. **LLM API Integrations**: Interfaces with OpenAI/Gemini to fetch JSON layouts and post drafts.
4. **Static Assets Storage**: Utilizes local system folders (Multer) or Cloud Object Stores (AWS S3) to resolve static files and media library URLs.

---

## 4. System Features (Functional Requirements)

### 4.1 User Authentication & Authorization
* **FR-01**: The system shall validate email and password inputs using bcrypt hashing algorithms on login.
* **FR-02**: The system shall generate a secure JWT access token and a refresh token upon successful verification.
* **FR-03**: The system shall save the active token in `localStorage` and sync it to client-readable cookies to support Next.js middleware protection.
* **FR-04**: The system shall restrict unauthorized users from accessing admin routes (`/admin/*`), redirecting them to `/login`.
* **FR-05**: The system shall perform token refresh operations automatically when a API call returns a `401 Unauthorized` response.

### 4.2 Workspace Multi-Tenancy
* **FR-06**: The system shall allow authenticated operators to register new sites, producing unique site slugs.
* **FR-07**: The system shall load sites associated with the user profile, allowing the user to select the active site workspace.
* **FR-08**: The client shall transmit the active site identifier in the `X-Site-Id` header for all protected API requests.
* **FR-09**: The backend API shall validate whether the authenticated user has active membership permissions for the target site, rejecting invalid requests with a `403 Forbidden` error.
* **FR-10**: The backend shall filter all database queries (posts, media, templates, categories) by `siteId` to isolate multi-tenant data.

### 4.3 Visual Builder & Canvas
* **FR-11**: The builder canvas shall support drag-and-drop operations for blocks: Heading, Text, Image, Container, Columns, and Blog Loop.
* **FR-12**: The builder properties drawer shall permit modifications to styling rules, converting user choices into Tailwind CSS class objects.
* **FR-13**: The system shall allow deleting, duplicates, and nesting components (e.g., Columns inside a Container).
* **FR-14**: The system shall write the canvas state to local storage to prevent data loss.
* **FR-15**: The visual editor shall validate the canvas structure against the layout block schemas before saving or publishing.

### 4.4 Template Layouts & Assignment
* **FR-16**: The layout editor shall support CRUD operations on layout schemas, storing structures as JSON objects.
* **FR-17**: The layout schema editor shall support editing raw layout structures.
* **FR-18**: The template manager shall support assigning layouts to post templates as the global default.
* **FR-19**: The template manager shall support assigning layouts to post templates scoped to specific categories, overriding global assignments.
* **FR-20**: Only published templates shall render on the public tenant frontend.

### 4.5 Data Binding Management
* **FR-21**: The editor shall provide a dynamic variable picker to bind fields directly to text or source attributes.
* **FR-22**: Dynamic variable bindings shall support key paths: `post.title`, `post.content`, `post.featured_image`, and `author.name`.
* **FR-23**: The system shall switch between static input mode and dynamic variable binding mode.
* **FR-24**: The data binding resolver shall replace bound variable strings with real CMS values when generating page previews.
* **FR-25**: The system shall support custom field configurations to map dynamic items.

### 4.6 Public Rendering & Preview
* **FR-26**: The builder shall provide a Preview Mode (`/admin/builder/preview`) inside the admin shell.
* **FR-27**: The Preview page shall load the current template structure from localStorage and bind it to real CMS post data.
* **FR-28**: The system shall run a public Next.js page renderer (`PublicPageRenderer`) on reader routes (`/s/{slug}`).
* **FR-29**: The renderer component shall query the layout JSON schema, resolve references, and output responsive HTML markup.
* **FR-30**: The rendering components shall use Next.js optimized elements (`next/image`, `next/link`) and sanitize rich text HTML content.

### 4.7 AI Integration & Content Tools
* **FR-31**: The system shall provide an AI chat assistant drawer inside `/admin/builder`.
* **FR-32**: The system shall allow AI-generated layout structures to be loaded onto the builder canvas.
* **FR-33**: The AI system shall support natural language design commands (e.g., adding components, changing colors) to update the canvas.
* **FR-34**: The system shall provide an AI content generator (`/ai-prompt`) to write blog post drafts based on keywords and tone.
* **FR-35**: The backend shall run AI-generated layout outputs through a structural layout validator schema before saving them to the database.

### 4.8 Team Invites & Custom Domains
* **FR-36**: The team interface shall support inviting new members to a site workspace by email with roles of OWNER, EDITOR, or AUTHOR.
* **FR-37**: The system shall generate a secure, shareable invite token with a defined expiration period (14 days).
* **FR-38**: The platform shall allow custom domain inputs and check DNS TXT records for ownership validation.
* **FR-39**: Next.js public middleware shall capture custom domain host headers and rewrite them to the appropriate multi-tenant `/s/{slug}` path.
* **FR-40**: The system shall enforce billing tier limits, allowing custom domain mappings only on Premium and Enterprise subscription plans.

---

## 5. Other Non-Functional Requirements

### 5.1 Performance Requirements
* **NFR-01**: Layout fetch operations on the backend database shall return JSON payloads within 2.0 seconds under normal loads.
* **NFR-02**: The page rendering pipeline shall maintain Cumulative Layout Shift (CLS) scores below 0.1 by utilizing strict image dimensions.
* **NFR-03**: All database queries for site layouts and templates shall utilize indexes on the `siteId` and `slug` columns.
* **NFR-04**: The system shall support paginated endpoints for media libraries and blog post grids, limiting query memory sizes.
* **NFR-05**: Dynamic preview rendering inside the builder canvas shall complete within 2.0 seconds.

### 5.2 Safety Requirements
* **NFR-06**: The platform shall verify delete operations on active templates and layouts via modal validation dialogs.
* **NFR-07**: The system shall maintain historical logs of layout edits to allow restoring previous configurations.
* **NFR-08**: The system shall store draft states separate from published versions to prevent disrupting public routes.
* **NFR-09**: The backend schema validator shall check template syntax before saving to prevent page crashes.

### 5.3 Security Requirements
* **NFR-10**: The application shall require valid JWT authentication for all requests targeting the `/api/admin/*` path.
* **NFR-11**: The system shall validate role assignments (RBAC) to ensure only authorized roles (Platform Admin, Site Owner, Editor) update templates.
* **NFR-12**: All public-facing network endpoints shall transmit data securely using TLS/HTTPS.
* **NFR-13**: All database queries shall utilize Prisma parameterized operations to prevent SQL injection vulnerabilities.
* **NFR-14**: The frontend shall sanitize raw HTML markdown outputs using DOMPurify or similar sanitizers to block Cross-Site Scripting (XSS).
* **NFR-15**: The API server shall run rate-limiting middleware on AI layout generation endpoints to prevent denial-of-service (DoS) attempts.
* **NFR-16**: Draft posts and templates must return `404 Not Found` if requested by unauthenticated public visitors.

### 5.4 Compatibility & Portability
* **NFR-17**: The web application shall run on modern desktop and tablet screens, supporting widths down to 768px.
* **NFR-18**: The public rendering engine output shall be responsive and cross-browser compatible.
* **NFR-19**: The backend shall run on Node.js LTS versions (v20+).
* **NFR-20**: The system layout schemas shall maintain backward compatibility, ensuring newer components do not crash older layouts.

---

## 6. Glossary

* **Admin Panel**: The management dashboard (`/admin`) where site owners configure posts, themes, settings, and layouts.
* **Binding**: Mapping an element in the builder schema to a dynamic database field like `post.title`.
* **Blog Loop**: A component in the layout editor that dynamically repeats lists or grids of blog posts.
* **Canvas**: The editor workspace workspace where administrators place visual blocks.
* **Current Site ID**: The active site scope stored in the client application context.
* **JWT (JSON Web Token)**: An open standard token format used to transmit secure credentials.
* **Multi-Tenancy**: An architecture where one codebase handles multiple isolated user site workspaces.
* **Platform Admin**: A platform administrator who has control over global users, domains, and sites.
* **Prisma ORM**: The database toolkit used to handle relational database mapping.
* **PublicPageRenderer**: The Next.js rendering component that maps JSON blocks to functional web components.
* **RBAC**: Role-Based Access Control, restricting access rights based on a user's role.
* **Site Switcher**: The dropdown list in the admin header used to switch the active workspace context.
* **X-Site-Id**: The custom HTTP header containing the active site ID, which isolates multi-tenant API transactions.
