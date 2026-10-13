# BroCodes 🚀

**BroCodes** is a high-performance, visually engaging showcase website and portfolio for creative software projects.

Built with a **milky pearl / warm-white** light theme and **deep charcoal** dark theme, it features interactive tile cards with screenshot slideshows and video previews, detailed project documentation pages, and automated build-time ZIP generation for direct project downloads.

---

## 🌟 Highlights

- **Interactive Project Tiles:** Screenshot carousel slideshow with auto-play, manual controls, and video preview badges.
- **Dedicated Project Pages:** Individual route (`/projects/<slug>/`) for every project displaying full documentation, README markdown, installation steps, and galleries.
- **Direct 1-Click ZIP Download:** Automatically packages each project into a clean downloadable archive at build time (excluding clutter like `node_modules`, `.git`, `.env`).
- **Milky Pearl & Deep Charcoal Themes:** Bespoke aesthetic, persistent via local storage, zero-flash loading, with system preference fallback.
- **Live Search & Filter:** Instant build-time generated search across titles, summaries, and technology tags.
- **100% Static & Blazing Fast:** Built with Astro, fully compatible with **Google Firebase Hosting**.
- **Clean Ingestion Architecture:** Zero fake or placeholder projects in production. Add your real projects one-by-one by dropping folders into `projects/`.

---

## 📁 Repository Structure

```text
├── projects/               # 📦 Where you drop your real project folders
│   ├── README.md           # Instructions for project folder layout
│   └── <project-slug>/     # Individual project folder (e.g., ai-agent, web-app)
│       ├── project.json    # Project metadata (title, summary, tech, category)
│       ├── README.md       # Project docs rendered on the detail page
│       ├── media/          # Screenshots, cover, and optional video preview
│       └── [source files]  # Your code (packaged into downloadable .zip)
├── src/
│   ├── components/         # Header, Footer, ProjectCard, EmptyState
│   ├── layouts/            # BaseLayout with theme script & SEO meta
│   ├── pages/              # index.astro (home), projects/[slug].astro, 404.astro
│   ├── config/site.ts      # Global site settings (title, hero, contact)
│   ├── styles/global.css   # Milky pearl & deep charcoal theme CSS
│   └── types/              # TypeScript & Zod validation schemas
├── scripts/
│   ├── validate-projects.js# Validates metadata and prevents unsafe paths
│   └── prepare-projects.js # Generates ZIPs & copies media at build time
├── public/                 # Static assets, generated ZIP downloads, and media
├── docs/                   # Additional documentation & schemas
├── firebase.json           # Firebase Hosting configuration
└── package.json
```

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Visit `http://localhost:4321` in your browser.

### 3. Validate Projects
```bash
npm run validate
```

### 4. Build for Production
```bash
npm run build
```
Builds the site into `dist/` and prepares downloads in `dist/downloads/`.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📦 How to Add a Project

Adding a project is completely folder-driven. You never need to touch frontend components.

1. **Create a project folder** inside `projects/` with a lowercase slug:
   ```bash
   projects/my-cool-project/
   ```

2. **Add `project.json`** with metadata:
   ```json
   {
     "title": "My Cool Project",
     "summary": "A clean, reel-worthy showcase project.",
     "category": "Web Application",
     "technologies": ["React", "TypeScript", "Tailwind CSS"],
     "year": 2026,
     "cover": "media/cover.webp",
     "screenshots": [
       { "path": "media/screenshots/01.webp", "alt": "Dashboard view" },
       { "path": "media/screenshots/02.webp", "alt": "Feature preview" }
     ],
     "videoLocal": "media/preview.mp4",
     "features": [
       "Interactive UI",
       "High Performance"
     ],
     "prerequisites": ["Node.js 18+"],
     "installation": ["npm install", "npm run dev"],
     "liveUrl": "https://example.com",
     "githubUrl": "https://github.com/username/project",
     "enableDownload": true
   }
   ```

3. **Add `README.md`** inside `projects/my-cool-project/README.md` for in-depth documentation.

4. **Add media** inside `projects/my-cool-project/media/`.

5. **Place your project code** in `projects/my-cool-project/`.

6. **Validate & Build**:
   ```bash
   npm run validate
   npm run build
   ```
   The site will automatically discover the project, create the download ZIP, and generate the live card and `/projects/my-cool-project/` page!

---

## 🌐 Google Firebase Hosting Deployment

BroCodes is pre-configured for static hosting on Google Firebase.

### Initial Setup (One-time)
1. Install Firebase CLI (if not installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Log in with your Google account:
   ```bash
   firebase login
   ```
3. Create a project in the [Firebase Console](https://console.firebase.google.com/).
4. Set your Firebase project ID in `.firebaserc`:
   ```bash
   cp .firebaserc.example .firebaserc
   ```
   Edit `.firebaserc` and replace `your-firebase-project-id` with your real ID.

### Deploy
```bash
npm run build
firebase deploy --only hosting
```
Your website will be live on Google's global CDN with HTTPS and instant caching!

---

## 🎨 Customizing Brand & Info

Edit `src/config/site.ts` to update:
- Brand title & slogan
- Hero section heading & text
- Social media and GitHub links
