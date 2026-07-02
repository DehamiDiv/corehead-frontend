# CoreHead Admin Dashboard — File Map

## 🖥️ Frontend (`corehead-frontend/frontend`)

### Entry Points
| File | Purpose |
|------|---------|
| [layout.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/layout.tsx) | Admin shell layout (sidebar, nav wrapper) |
| [page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/page.tsx) | Admin dashboard home / overview |

---

### 📝 Posts
| File | Purpose |
|------|---------|
| [posts/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/posts/page.tsx) | All posts list (18.9 KB) |
| [posts/create/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/posts/create/page.tsx) | Create new post form (30.8 KB) |
| [posts/edit/[id]/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/posts/edit/%5Bid%5D/page.tsx) | Edit existing post |

### 💬 Comments
| File | Purpose |
|------|---------|
| [comments/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/comments/page.tsx) | Comments moderation (15.1 KB) |

### 👥 Users
| File | Purpose |
|------|---------|
| [users/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/users/page.tsx) | User management (25.7 KB) |

### 🏷️ Categories
| File | Purpose |
|------|---------|
| [categories/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/categories/page.tsx) | Category management (21.2 KB) |

### 🖼️ Media
| File | Purpose |
|------|---------|
| [media/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/media/page.tsx) | Media library (14 KB) |

### 📄 Static Pages
| File | Purpose |
|------|---------|
| [pages/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/pages/page.tsx) | Static pages list (16.4 KB) |

### 🎨 Layouts & Templates
| File | Purpose |
|------|---------|
| [layouts/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/layouts/page.tsx) | Layout templates list (17.4 KB) |
| [layouts/new/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/layouts/new/page.tsx) | Create new layout |
| [layouts/[id]/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/layouts/%5Bid%5D/page.tsx) | Edit layout |
| [blog-templates/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/blog-templates/page.tsx) | Blog template management (12.6 KB) |
| [template-assignment/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/template-assignment/page.tsx) | Assign templates to posts (19 KB) |

### 🧩 Builder & Binding
| File | Purpose |
|------|---------|
| [builder/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/page.tsx) | Visual page builder |
| [builder/draft/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/draft) | Builder draft mode |
| [builder/preview/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/preview) | Builder preview mode |
| [builder/publish/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/publish) | Builder publish mode |
| [builder/settings/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/settings) | Builder settings |
| [builder/taxonomy/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/builder/taxonomy) | Builder taxonomy |
| [binding/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/binding/page.tsx) | Data binding manager (34.4 KB) |
| [binding/actions.ts](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/binding/actions.ts) | Binding server actions |
| [binding/types.ts](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/binding/types.ts) | Binding TypeScript types |

### 🔧 Settings
| File | Purpose |
|------|---------|
| [settings/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/settings/page.tsx) | Settings hub (4.9 KB) |
| [settings/appearance/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/settings/appearance/page.tsx) | Theme & appearance (28.1 KB) |
| [settings/website/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/settings/website/page.tsx) | Website settings (13.5 KB) |
| [settings/profile/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/settings/profile) | Profile settings |

### 🧪 Other
| File | Purpose |
|------|---------|
| [snippets/page.tsx](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/snippets/page.tsx) | Code snippets manager (5.2 KB) |
| [resolver-test/](file:///d:/projects/my_projects/updated/corehead-frontend/frontend/app/admin/resolver-test) | Resolver testing utility |

---

## ⚙️ Backend (`CoreHead-Backend`)

### Entry Point
| File | Purpose |
|------|---------|
| [server.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/server.js) | Express app, route mounts, middleware setup |
| [prismaClient.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/models/prismaClient.js) | Prisma DB client singleton |
| [schema.prisma](file:///d:/projects/my_projects/updated/CoreHead-Backend/prisma/schema.prisma) | Database schema (all models) |

---

### 🛣️ Routes → Controllers
| Route File | Controller | Covers |
|-----------|-----------|--------|
| [authRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/authRoutes.js) | [authController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/authController.js) | Login, register, JWT |
| [postRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/postRoutes.js) | [postController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/postController.js) | CRUD posts, publish, slug (7.6 KB) |
| [commentRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/commentRoutes.js) | [commentController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/commentController.js) | CRUD comments, moderation |
| [userRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/userRoutes.js) | [userController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/userController.js) | User management |
| [categoryRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/categoryRoutes.js) | [categoryController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/categoryController.js) | Category CRUD |
| [mediaRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/mediaRoutes.js) | [mediaController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/mediaController.js) | Upload & manage media (3.25 KB) |
| [pageRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/pageRoutes.js) | [pageController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/pageController.js) | Static page CRUD |
| [templateRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/templateRoutes.js) | [templateController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/templateController.js) | Blog templates (3.6 KB) |
| [builderRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/builderRoutes.js) | [builderController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/builderController.js) | Layout builder CRUD |
| [bindingRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/bindingRoutes.js) | [bindingController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/bindingController.js) | Data bindings |
| [settingsRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/settingsRoutes.js) | [settingsController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/settingsController.js) | Site settings |
| [blogRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/blogRoutes.js) | [blogController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/blogController.js) | Public blog API |
| [previewRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/previewRoutes.js) | [previewController.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/controllers/previewController.js) | Post preview |
| [aiRoutes.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/routes/aiRoutes.js) | — | AI-powered content tools (3.7 KB) |

---

### 🧱 Services & Repositories (Business Logic Layer)
| File | Purpose |
|------|---------|
| [authService.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/services/authService.js) | Auth logic (JWT, bcrypt) |
| [blogService.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/services/blogService.js) | Blog query logic |
| [templateService.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/services/templateService.js) | Template rendering logic (4 KB) |
| [bindingService.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/services/bindingService.js) | Binding resolution |
| [aiService.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/services/aiService.js) | AI content generation (7.4 KB) |
| [blogRepository.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/repositories/blogRepository.js) | Prisma queries for blog (3.4 KB) |
| [templateRepository.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/repositories/templateRepository.js) | Prisma queries for templates (4.2 KB) |
| [bindingRepository.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/repositories/bindingRepository.js) | Prisma queries for bindings |
| [userRepository.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/repositories/userRepository.js) | Prisma queries for users |

### 🔐 Middleware
| File | Purpose |
|------|---------|
| [authMiddleware.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/middlewares/authMiddleware.js) | JWT auth guard for protected routes |

### 🛠️ Utilities
| File | Purpose |
|------|---------|
| [layoutValidator.js](file:///d:/projects/my_projects/updated/CoreHead-Backend/src/utils/layoutValidator.js) | Validates layout block schemas |

---

## 🗂️ Architecture Flow

```mermaid
graph TD
    FE["Frontend (Next.js)"] -->|HTTP API| BE["Backend (Express)"]
    BE --> MW["authMiddleware.js\n(JWT guard)"]
    MW --> CT["Controllers"]
    CT --> SV["Services"]
    SV --> RP["Repositories"]
    RP --> DB[("PostgreSQL\nvia Prisma")]

    subgraph Admin Pages
        AP["admin/page.tsx\n(Dashboard)"]
        POST["posts/ create/ edit/"]
        COM["comments/"]
        USR["users/"]
        CAT["categories/"]
        MED["media/"]
        LAY["layouts/ blog-templates/"]
        BLD["builder/ binding/"]
        SET["settings/"]
    end

    FE --> Admin Pages
```
