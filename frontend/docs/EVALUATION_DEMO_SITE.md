# Evaluation Demo Site — **Verdura**

Complete tenant site package for CoreHead project evaluation / viva.
Use this as the **public multi-tenant demo** at `/s/verdura`.

---

## 1. Brand identity

| Field | Value |
|--------|--------|
| **Site name** | Verdura |
| **Public slug** | `verdura` |
| **Public URL** | `/s/verdura` |
| **Tagline** | Nature is essential. Stories that grow with you. |
| **One-line pitch** | Verdura is a nature & sustainable living magazine built on CoreHead — posts, media, themes, and a branded public site. |
| **Theme** | Nature (`theme-1`) |
| **Primary colour** | `#166534` |
| **Accent** | `#22c55e` |
| **Header bg** | `#14532d` |
| **Background** | `#f0fdf4` |
| **Font** | DM Sans |

### Logo files (in this frontend repo)

| File | Use |
|------|-----|
| `public/demo/verdura-logo.svg` | Full logo (dark text) — light backgrounds |
| `public/demo/verdura-logo-light.svg` | Full logo (white text) — dark headers / footer |
| `public/demo/verdura-icon.svg` | Square icon / favicon-style mark |
| `public/demo/verdura-icon.jpg` | Raster leaf mark (upload as site logo in admin) |

**Upload tip:** In Admin → create site / Appearance, upload `verdura-icon.jpg` or the SVG as **site logo**. For header on dark green, prefer `verdura-logo-light.svg`.

---

## 2. Navigation & footer copy

### Header nav

| Label | Link |
|-------|------|
| Home | `/s/verdura` |
| Blog | `/s/verdura/blog` |
| About | `/s/verdura/p/about` |
| Contact | `/s/verdura/p/contact` |

- **CTA text:** Explore  
- **CTA URL:** `/s/verdura/blog`

### Footer

- **Description:** Verdura is your guide to gardens, wildlife, eco living, and outdoor adventure — thoughtful stories for people who care about the planet.
- **Copyright:** © 2026 Verdura. All rights reserved. Powered by CoreHead.
- **Quick links:** Home · Blog · About · Contact

---

## 3. Categories

| Name | Slug | Description |
|------|------|-------------|
| Plants & Gardens | `plants-gardens` | Growing food, flowers, and green spaces at home |
| Eco Living | `eco-living` | Practical sustainability for everyday life |
| Wildlife | `wildlife` | Conservation, species, and ethical nature |
| Environment | `environment` | Climate, ecosystems, and planetary health |
| Nature Photography | `nature-photography` | Camera craft and outdoor storytelling |
| Outdoor Adventures | `outdoor-adventures` | Trails, travel, and time outside |
| Aquatic Plants | `aquatic-plants` | Planted tanks and water gardens |

---

## 4. Published posts (copy-paste ready)

Use **status: Published** so they appear on `/s/verdura` and `/s/verdura/blog`.

### Post 1 — Featured

- **Title:** Beginner's Guide to Planting a Vegetable Garden from Scratch  
- **Slug:** `beginners-guide-vegetable-garden`  
- **Category:** Plants & Gardens  
- **Cover:** `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80`  
- **Excerpt:** Learn how to start your first vegetable garden with this complete beginner-friendly guide covering soil prep, plant selection, and ongoing care.  
- **Content (HTML):**

```html
<h2>Getting Started with Your Vegetable Garden</h2>
<p>Starting a vegetable garden is one of the most rewarding experiences you can have. Whether you have a sprawling backyard or just a small balcony, growing your own food connects you to nature and provides fresh, healthy produce for your family.</p>
<h3>Choosing the Right Location</h3>
<p>Most vegetables need at least 6–8 hours of direct sunlight per day. Choose a spot that gets morning sun and is protected from harsh afternoon winds. Good drainage is essential — avoid low-lying areas where water tends to pool.</p>
<h3>Preparing Your Soil</h3>
<p>Healthy soil is the foundation of a productive garden. Start by testing your soil's pH level (most vegetables prefer 6.0–7.0). Add compost or well-rotted manure to improve soil structure, drainage, and nutrient content.</p>
<h3>Best Vegetables for Beginners</h3>
<p>Start with easy-to-grow varieties like tomatoes, lettuce, radishes, green beans, and herbs like basil and mint. These are forgiving plants that produce well even with minimal experience.</p>
<blockquote>"The glory of gardening: hands in the dirt, head in the sun, heart with nature." — Alfred Austin</blockquote>
<p>Remember, every expert gardener was once a beginner. Start small, learn from your mistakes, and enjoy the journey of growing your own food.</p>
```

### Post 2

- **Title:** Solar Energy for Your Home: A Beginner's Guide to Going Green  
- **Slug:** `solar-energy-home-guide`  
- **Category:** Eco Living  
- **Cover:** `https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&q=80`  
- **Excerpt:** Learn how to harness solar power for your home, reduce energy costs, and contribute to a sustainable future.  
- **Content (HTML):**

```html
<h2>Why Solar Energy Matters</h2>
<p>Solar energy is no longer a futuristic concept — it's a practical, affordable solution for homeowners looking to reduce their carbon footprint and energy bills. With advances in technology, solar panels are more efficient and accessible than ever.</p>
<h3>How Solar Panels Work</h3>
<p>Solar panels convert sunlight into electricity using photovoltaic (PV) cells. When sunlight hits these cells, it creates an electric field that generates direct current (DC) electricity, which is then converted to alternating current (AC) for your home.</p>
<h3>Cost and Savings</h3>
<p>While the initial investment can seem significant, most homeowners see a return on investment within 5–8 years. Government incentives, tax credits, and net metering programs can significantly reduce costs.</p>
<p>The average household can save between $10,000 and $30,000 over the lifetime of a solar panel system, while also increasing property value.</p>
```

### Post 3

- **Title:** Organic Gardening 101: Growing Your Own Vegetables at Home  
- **Slug:** `organic-gardening-101`  
- **Category:** Plants & Gardens  
- **Cover:** `https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80`  
- **Excerpt:** Start your organic gardening journey without synthetic chemicals or pesticides.  
- **Content (HTML):**

```html
<h2>What is Organic Gardening?</h2>
<p>Organic gardening is the practice of growing plants without synthetic fertilizers, pesticides, or genetically modified organisms. It relies on natural processes, companion planting, and biological pest control.</p>
<h3>Building Healthy Soil Naturally</h3>
<p>Use compost, leaf mulch, cover crops, and natural amendments like bone meal and kelp. Healthy soil produces plants that resist pests and disease more easily.</p>
<h3>Natural Pest Control</h3>
<p>Encourage beneficial insects like ladybugs and lacewings. Plant marigolds to deter aphids, and use neem oil when needed.</p>
```

### Post 4 — Featured

- **Title:** Protecting Endangered Species: Conservation Efforts That Are Making a Difference  
- **Slug:** `protecting-endangered-species`  
- **Category:** Wildlife  
- **Cover:** `https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=80`  
- **Excerpt:** Discover conservation success stories and how global efforts are saving endangered species.  
- **Content (HTML):**

```html
<h2>The State of Wildlife Conservation</h2>
<p>Around the world, conservationists, scientists, and communities work to protect endangered species — from snow leopards to sea turtles.</p>
<h3>Success Stories</h3>
<p>The giant panda has been downlisted from Endangered to Vulnerable thanks to decades of work in China. Bald eagle populations in North America recovered after the ban of DDT.</p>
<h3>What You Can Do</h3>
<p>Support wildlife organisations, reduce single-use plastics, choose sustainable products, and share knowledge about biodiversity.</p>
<blockquote>"In the end, we will conserve only what we love." — Baba Dioum</blockquote>
```

### Post 5

- **Title:** How to Photograph Wildlife in Their Natural Habitat  
- **Slug:** `wildlife-photography-guide`  
- **Category:** Nature Photography  
- **Cover:** `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80`  
- **Excerpt:** Equipment, camera settings, animal behaviour, and ethical practices for wildlife photography.  
- **Content (HTML):**

```html
<h2>The Art of Wildlife Photography</h2>
<p>Wildlife photography requires patience, technical skill, and respect for animals in their natural habitat.</p>
<h3>Essential Equipment</h3>
<p>A telephoto lens (200–600mm), a sturdy tripod, and a camera with fast autofocus help you capture motion safely from a distance.</p>
<h3>Ethical Guidelines</h3>
<p>Never disturb wildlife for a photo. Maintain safe distances, don't bait animals, and put animal welfare first.</p>
```

### Post 6 — Featured

- **Title:** Climate Change and Its Impact on Global Ecosystems  
- **Slug:** `climate-change-impact-ecosystems`  
- **Category:** Environment  
- **Cover:** `https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200&q=80`  
- **Excerpt:** How climate change reshapes coral reefs, forests, and ecosystems — and what we can do.  
- **Content (HTML):**

```html
<h2>A Changing Planet</h2>
<p>Rising temperatures, shifting weather, and extreme events are reshaping ecosystems at an unprecedented rate.</p>
<h3>Coral Reefs</h3>
<p>Ocean warming causes bleaching; acidification weakens reef structures. Over half of global coral cover has already been lost.</p>
<h3>Forests Under Threat</h3>
<p>Wildfires, pests, and droughts threaten forests that act as critical carbon sinks.</p>
<h3>Taking Action</h3>
<p>Cut emissions, support renewables, protect natural carbon sinks, and adapt daily practices. The time to act is now.</p>
```

### Post 7

- **Title:** Exploring the World's Most Breathtaking Hiking Trails  
- **Slug:** `breathtaking-hiking-trails`  
- **Category:** Outdoor Adventures  
- **Cover:** `https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80`  
- **Excerpt:** From the Inca Trail to the Tour du Mont Blanc — spectacular routes every outdoor enthusiast should know.  
- **Content (HTML):**

```html
<h2>Trails That Will Take Your Breath Away</h2>
<p>These routes offer more than exercise — they connect you with wilderness and lasting memories.</p>
<h3>Inca Trail, Peru</h3>
<p>A multi-day trek through cloud forests and Inca ruins ending at Machu Picchu.</p>
<h3>Tour du Mont Blanc</h3>
<p>Alpine scenery across France, Italy, and Switzerland.</p>
<h3>Milford Track, New Zealand</h3>
<p>Rainforests, waterfalls, and mountain passes in Fiordland National Park.</p>
```

### Post 8

- **Title:** The Healing Power of Aquatic Plants in Home Aquariums  
- **Slug:** `aquatic-plants-home-aquariums`  
- **Category:** Aquatic Plants  
- **Cover:** `https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=1200&q=80`  
- **Excerpt:** How live plants improve water quality, oxygen, and calm in your home aquarium.  
- **Content (HTML):**

```html
<h2>Why Aquatic Plants Matter</h2>
<p>Live plants filter water, produce oxygen, and create natural habitats that reduce stress for fish — and for you.</p>
<h3>Beginner-Friendly Plants</h3>
<p>Java Fern, Anubias, Amazon Sword, and Java Moss thrive in many conditions with low maintenance.</p>
<h3>Setting Up a Planted Tank</h3>
<p>Use nutrient-rich substrate, 8–10 hours of light daily, and add CO₂ later as you gain experience.</p>
```

---

## 5. Static pages

### About (`/s/verdura/p/about`) — status: Published

**Name:** About  
**Slug:** `about`

```html
<section style="max-width:720px;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.7;color:#14532d">
  <h1 style="font-size:2rem;margin-bottom:0.5rem">About Verdura</h1>
  <p style="color:#4d7c5a;margin-bottom:1.5rem">Stories of nature, sustainability, and conscious living.</p>
  <p>Verdura is a digital magazine for people who want to live closer to the natural world — whether that means planting a balcony garden, photographing wildlife, or making greener choices at home.</p>
  <p>This site is powered by <strong>CoreHead</strong>, a multi-tenant AI-assisted CMS. Each organisation gets its own workspace, branding, posts, media library, and public URL.</p>
  <h2 style="margin-top:2rem;font-size:1.35rem">What you'll find here</h2>
  <ul>
    <li>Practical gardening and eco-living guides</li>
    <li>Wildlife conservation stories</li>
    <li>Outdoor adventure inspiration</li>
    <li>Photography tips from the field</li>
  </ul>
  <p style="margin-top:1.5rem">Thank you for reading. Grow something good today.</p>
</section>
```

### Contact (`/s/verdura/p/contact`) — status: Published

**Name:** Contact  
**Slug:** `contact`

```html
<section style="max-width:720px;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.7;color:#14532d">
  <h1 style="font-size:2rem;margin-bottom:0.5rem">Contact Verdura</h1>
  <p style="color:#4d7c5a;margin-bottom:1.5rem">We'd love to hear from readers, contributors, and partners.</p>
  <p><strong>Editorial:</strong> hello@verdura.demo</p>
  <p><strong>Partnerships:</strong> partners@verdura.demo</p>
  <p><strong>Location:</strong> Colombo, Sri Lanka (demo address for evaluation)</p>
  <p style="margin-top:1.5rem">For project evaluation, this page demonstrates CoreHead custom pages published at <code>/s/{slug}/p/{pageSlug}</code>.</p>
</section>
```

---

## 6. Author profile (optional polish)

| Field | Value |
|-------|--------|
| Name | Ava Green |
| Designation | Editor-in-Chief |
| Bio | Writer and naturalist covering gardens, climate, and wildlife for Verdura. |
| Avatar | `https://api.dicebear.com/7.x/avataaars/svg?seed=AvaGreen` |

---

## 7. How to set up for evaluation (manual)

1. **Login** to CoreHead admin.  
2. **Create site:** name `Verdura`, slug `verdura`, upload logo from `public/demo/`.  
3. **Appearance:** activate **Nature** theme (`theme-1`); set nav/footer as above.  
4. **Categories:** create the 7 categories.  
5. **Posts:** create all 8 posts as **Published** with covers + HTML content.  
6. **Pages:** create About + Contact as **Published**.  
7. **Demo:** open `/s/verdura`, blog list, a post, About, Contact, and admin dashboard.

### One-command seed (recommended)

From **CoreHead-Backend**:

```bash
node scripts/seedVerduraDemoSite.js
```

This creates the site, branding settings, categories, posts, and pages for the first admin/owner user (or creates `demo@verdura.demo` if needed).

Public site: `http://localhost:3000/s/verdura`

---

## 8. What to show examiners (checklist)

| Area | URL / path | What it proves |
|------|------------|----------------|
| Marketing platform | `/` | CoreHead product landing |
| Admin dashboard | `/admin` | Multi-tenant CMS |
| Active site | Site switcher → Verdura | Site isolation |
| Public home | `/s/verdura` | Branded tenant site |
| Blog | `/s/verdura/blog` | Published posts only |
| Single post | `/s/verdura/blog/{slug}` | Content + media |
| About page | `/s/verdura/p/about` | Custom pages |
| Appearance | Admin → Settings → Appearance | Themes / branding |
| Media | Admin → Media | Uploads library |
| Posts CRUD | Admin → Posts | Content workflow |

---

## 9. Short viva script (30 seconds)

> “CoreHead is a multi-tenant CMS. Companies create their own site workspace. For evaluation we built **Verdura**, a nature magazine at `/s/verdura`. Owners manage posts, media, categories, and branding in admin; readers see only published content on the public site. The Nature theme, logo, eight articles, and About/Contact pages show a complete end-to-end product.”
