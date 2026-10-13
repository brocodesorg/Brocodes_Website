# BroCodes — Product Requirements Document (PRD)

**Document status:** Build specification  
**Product:** BroCodes  
**Product type:** Static project showcase and downloadable project library  
**Primary audience:** People exploring, viewing, learning from, or downloading the creator's real projects  
**Primary owner workflow:** Add one project folder at a time, commit it to GitHub, and rebuild/redeploy the site  
**Hosting target:** Google Firebase Hosting  
**Recommended stack:** Astro + TypeScript + Tailwind CSS, static output

---

## 1. Product vision

BroCodes is a polished public home for creative, attractive, interactive, and useful software projects. Each project should be easy to discover through visual tiles, easy to understand through a dedicated project page, and easy to try or study through a real README and a direct ZIP download.

The site should feel like a carefully art-directed showcase, not a plain list of GitHub repositories. Visual quality matters, but content integrity and download reliability matter just as much.

### Product promise

**See the project. Understand what it does. Explore real screenshots or video. Read how it works. Download the actual project.**

### Important launch principle

The initial release is a complete website system with **no preloaded example projects**. It must look intentional when the project catalog is empty. Real projects, metadata, media, source files, and links will be added later, one by one by the owner.

---

## 2. Goals and measurable acceptance outcomes

### Primary goals

1. Create a distinctive, premium interface in both warm-white/milky light mode and deep charcoal dark mode.
2. Show a responsive grid of real projects with screenshot slideshows and optional real video previews.
3. Give every project a dedicated detail page with the project's own information and README.
4. Generate a separate, direct-download ZIP for each eligible project at build time.
5. Let the owner add projects by following a folder and metadata convention, without modifying the shared UI components.
6. Deploy as a fast static site on Google Firebase Hosting with HTTPS and CDN delivery.
7. Ship without fake projects, demo screenshots, sample videos, fabricated links, or placeholder portfolio content.

### Success criteria

- A clean checkout can install, run, test, and build successfully while there are zero projects.
- Adding one valid project folder creates a real card, detail route, readable README, valid media links, and downloadable project ZIP at the next build.
- Adding a second project requires no edit to the page components.
- Missing optional video/screenshots/links do not break a project page.
- Invalid required metadata produces an actionable build error.
- The home page and project detail pages work on mobile, tablet, laptop, and desktop.
- The light/dark modes are usable, legible, and persistent.
- The deployment uses static files and does not need a running application server or database.

---

## 3. Non-goals for version one

Do not build an admin dashboard, user accounts, authentication, database, cloud functions, project submissions, comments, likes, star ratings, analytics, mailing list, payment flow, CMS, or server-side ZIP service. Do not create a project editor in the browser. Do not seed the catalog with fictional or starter projects.

These additions can be considered later only if a real need appears. Version one is a repository-driven, static portfolio.

---

## 4. Users and primary journeys

### Visitor

A visitor opens BroCodes, quickly understands that it is a catalog of projects, scans the visual cards, searches or filters, opens one project, reviews its gallery/video and README, and downloads the project or opens its live/GitHub link.

### Learner

A learner opens a project detail page, checks its technologies, features, prerequisites, and setup steps, then downloads the project ZIP to study or run locally.

### Owner / maintainer

The owner creates a new project folder, adds truthful metadata and project documentation, places screenshots/video in the documented media directory, includes the real project files intended for download, runs validation and build, commits the changes, and deploys the new static output.

---

## 5. Brand and visual design requirements

### Brand

- Name: **BroCodes**
- Wordmark: clear, typographic, and ownable; a simple custom wordmark is sufficient.
- Voice: confident, welcoming, creative, concise, and technically clear.
- Do not invent a founder biography, company claims, metrics, testimonial, award, user count, or social profile.

### Visual system

**Light theme:** warm milky/pearl background, near-black text, gentle neutral surfaces, subtle separators, tasteful shadow, restrained accent.  
**Dark theme:** deep charcoal background, slightly lifted dark surfaces, soft light text, subtle borders, the same accent and design language.

Use a coherent spacing scale, responsive typography, balanced line lengths, high-quality cropping, and consistent radii. The interface should feel premium and content-first.

### Project-card visual treatment

- The screenshot/media region is the main visual feature.
- If two or more screenshots are configured, provide an automatic, restrained slideshow plus visible manual controls and indicators.
- Pause rotation while hovered or focused; respect reduced motion and never make information accessible only by waiting for a slide.
- If there is a preview video, show a clear play affordance or concise video preview treatment. Do not autoplay sound.
- Below the media: title, short truthful summary, a small set of technology chips, and optional year/category.
- Card click opens the detail page. Any nested links/buttons must have non-conflicting semantics and work by keyboard.
- Do not show fake media frames, fake counters, fake ratings, or meaningless placeholders.

### Responsive layout

- Mobile: one-column cards with comfortable touch controls and no horizontal overflow.
- Tablet: two-column grid where space allows.
- Desktop: balanced two- or three-column grid based on content width.
- Header, filter tools, cards, gallery and detail content must reflow without clipping.

---

## 6. Information architecture and routes

### Home — `/`

Contains the site header, compact hero/introduction, project search/filter controls, project grid, empty/no-results state, and small footer.

### Project detail — `/projects/<slug>/`

A statically generated page for each valid project slug. Includes breadcrumb/back link, project title and summary, metadata/tags, gallery/video if available, features, external links when configured, README content, setup/prerequisites/troubleshooting when available, download action, and next/previous project navigation where useful.

### 404 — `/404.html`

A designed not-found page with a clear return-to-projects action.

### Supporting routes/assets

Generate sitemap and robots metadata where appropriate. Provide favicon and social-preview metadata. Each project page should have a unique title and description. Configure the canonical site URL through one environment/config value; never guess a custom domain.

---

## 7. Functional requirements

### FR-01: Project discovery

At build time, discover valid project directories under `projects/`. Folder name defines the route slug. Ignore documentation and template files that are not project entries. Enforce safe slug syntax and detect duplicate/conflicting slugs.

**Acceptance:** With zero projects the site builds. With multiple valid project directories, each gets one card and one detail route. No page component is manually edited to add a project.

### FR-02: Structured metadata

Each project directory has a `project.json` file conforming to a documented TypeScript/runtime schema. Required fields include title, summary/description, category, and technology list. All media and external links are optional. Optional fields should be omitted rather than filled with invented values.

**Acceptance:** Invalid JSON, missing required data, duplicate routes, malformed media paths, or invalid links produce a useful build error naming the project and field. Missing optional media is tolerated.

### FR-03: Screenshot slideshow on cards

Cards use only real screenshots/covers present for that project. Multiple screenshots can cycle at a calm interval with manual controls. Single-image cards have no fake slideshow controls. Missing images use a graceful typographic/media-free card layout, not broken images.

**Acceptance:** Keyboard and pointer users can browse slides. The slideshow does not cause layout shifts, trap focus, or disregard reduced-motion preferences.

### FR-04: Search and filters

Search projects by title and useful metadata/description/technology fields. Support category and technology filtering if the catalog has those values. Filters can be combined. Provide a clear-all/reset action and a polite no-results message.

**Acceptance:** Search/filter interaction updates visible cards promptly and accurately. Controls remain usable on small screens and with a keyboard. Do not display empty filter groups when the catalog has no relevant values.

### FR-05: Project detail

Each detail route shows the project-specific metadata and only the sections that actually exist. The layout should prioritize what the project does and the actual media, then supporting documentation and links.

**Acceptance:** Project URLs remain stable from folder slug. Navigation works on reload/direct visit, and the detail route is a real static page—not dependent on client-side routing only.

### FR-06: README rendering

Read the project's root `README.md` and present it as readable, styled Markdown on its detail page. Support ordinary headings, paragraphs, lists, task lists, links, code blocks, inline code, tables, and images as feasible. Provide a visible README/documentation section or tab that remains accessible on mobile.

Sanitize/render Markdown safely. Resolve local relative links/images according to the project's media/documentation conventions where practical. Show a clear missing-documentation state only when the README is genuinely absent; do not create a fake README.

**Acceptance:** Long code lines and tables remain readable on mobile (scroll within code/table containers rather than stretching the page). Broken relative media/links are caught by validation where possible.

### FR-07: Setup instructions and project details

Display explicit prerequisites, install/run commands, and features when the author has provided them. These can be supplied as metadata fields or in the README. Do not synthesize commands from assumptions.

**Acceptance:** A visitor can see the actual setup steps the project author supplied, copy code snippets, and understand which commands belong to which project.

### FR-08: Project ZIP downloads

At build time, package each project according to the documented inclusion/exclusion rules. Publish an archive at a predictable URL such as `/downloads/<slug>.zip`; the page's Download button must point to the generated archive. Support a direct download on the same origin. Show archive size where straightforward.

**Acceptance:** The link returns an actual ZIP created from that project's eligible files. The archive opens, contains the intended project files and README, and omits dependencies, build output, secrets, caches, and generated ZIP recursion. A missing/disabled/failed archive must never produce a dead button.

### FR-09: Live demo and GitHub links

Render `Live demo` and `View on GitHub` actions only when configured with valid HTTPS URLs (or explicitly allowlisted local development URLs in development mode). Open external destinations safely and indicate external navigation where appropriate.

**Acceptance:** No fake link appears. A missing link removes the action cleanly.

### FR-10: Video preview

Support an optional local video path or an approved external video URL. Use a poster/thumbnail if supplied. Use native controls; do not autoplay audio. Avoid loading large external embeds until needed when practical.

**Acceptance:** A project without video renders normally. Invalid video paths/URLs produce a clear validation message during build rather than a broken live element.

### FR-11: Theme switching

Support light and dark themes. Respect `prefers-color-scheme` for first visit, store the user's selection locally, avoid visible flash when feasible, and label the theme control accessibly.

**Acceptance:** The selected theme persists across routes/reloads where browser storage is available. Both themes meet contrast and focus requirements.

### FR-12: Configuration

Keep site-wide content in a clear configuration file: brand name, hero heading/description, optional short about text, optional contact/social URLs, social preview default, and canonical site URL. Empty optional values should hide the corresponding UI.

**Acceptance:** The owner can edit site copy or add legitimate contact links without hunting through UI components.

### FR-13: Build checks and diagnostics

Provide commands for local development, project validation, tests, and production build. Every validation error should mention the relevant project folder, file, and field when known. Build output must be deterministic and cleanup generated artifacts before rebuilding.

**Acceptance:** An empty catalog builds. A malformed project is rejected with actionable information. Test fixtures never ship as visible projects.

---

## 8. Content directory contract

A recommended owner-facing structure is:

```text
projects/
  README.md
  <slug>/
    project.json
    README.md
    media/
      cover.webp                 # optional real cover
      screenshots/               # optional real screenshots
      preview.mp4                # optional; external hosting preferred for large files
    ... actual project files ...
```

This is a convention, not a requirement to restructure every project. Existing project folder structures should be preserved. The build system should understand the project's metadata and know which local image/video paths to publish; the rest of the project should remain outside the static web root and be offered through the generated ZIP (or the configured GitHub link).

### Metadata rules

- Slug: derived from folder name; lowercase and URL-safe.
- Title: human-readable project name.
- Summary/description: truthful, concise, written by the owner or derived conservatively from supplied project documentation.
- Category and technology tags: real values only.
- Screenshots: paths to real files plus alt text where possible.
- Video: optional local path or external video URL.
- URLs: valid and explicitly provided.
- Features/setup/prerequisites/year: optional and factual.
- Download packaging: configurable if a project should not be zipped automatically.

Provide an empty template or JSON schema outside the catalog. It must not be treated as a real project. Define clear conventions for local media paths; reject paths that traverse outside the project directory.

### Media guidelines for the owner

- Prefer compressed WebP/AVIF for screenshots and a sensible maximum display resolution; keep originals separately if needed.
- Use descriptive filenames and useful alt text.
- Avoid committing very large raw recordings into the main repo. Prefer an approved external video host for big previews.
- Ensure the owner has the rights to publish every screenshot, video, image, font, and included source file.

---

## 9. Technical architecture

### Preferred stack

- Astro for file-based pages and static generation.
- TypeScript for components, configuration, metadata types, and validation.
- Tailwind CSS plus a small custom design-token layer for theme and polish.
- Lightweight client-side TypeScript for theme, search/filter behavior, and gallery interactions.
- A well-maintained Markdown renderer with safe HTML handling for README display.
- A ZIP library or well-tested Node archive utility for build-time packaging.
- Firebase Hosting serving the generated `dist/` directory.

### Static-first data flow

1. Developer adds a project folder and metadata.
2. A Node build preparation/validation step discovers project folders and checks their metadata/media/links.
3. Build preparation produces the catalog data used by Astro, copies approved public media to generated public assets, and creates eligible project archives.
4. Astro generates the home page and one static detail page per project.
5. Firebase Hosting deploys the static output. Browsing and downloading do not require a backend service.

### Separation of public and private/source files

Project source files must not be copied into the public site just because they are inside the repository. Only website code, approved display media, and intended ZIP archives are published in `dist/`. The Git repository itself may expose all committed files if it is public; website routing does not make files private.

### Repository structure

Use a maintainable structure broadly similar to:

```text
/
  src/
    components/
    layouts/
    pages/
    styles/
    data/ or config/
  projects/
    README.md
    (no real projects included at launch)
  scripts/
    validate-projects.*
    prepare-projects.*
  docs/
    PROJECT_TEMPLATE.md or project.schema.json
    ADDING_PROJECTS.md
    DEPLOYMENT.md
  public/
    favicon.svg
  tests/                     # as appropriate
  BroCodes_PRD.md
  package.json
  firebase.json
  .gitignore
  README.md
```

Adapt actual filenames to the framework and generated artifacts; do not create unnecessary duplicate configuration files.

---

## 10. Performance, accessibility, and compatibility

### Performance

- Static HTML and assets; avoid unnecessary client JavaScript.
- Responsive images with correct dimensions/aspect ratio to limit layout shift.
- Lazy-load below-the-fold imagery and videos; eagerly load only the content that materially helps initial rendering.
- Use compressed media, sensible cache headers, and avoid large dependencies.
- Avoid continuous animation and heavy background effects.
- Inspect the production build and use Lighthouse or an equivalent audit where tooling is available. Aim for excellent performance/accessibility/SEO without making unsupported claims about measured production data.

### Accessibility

- Semantic landmarks and heading order.
- Keyboard-operable navigation, gallery controls, filters, theme toggle, and buttons.
- Clear focus indication and adequate contrast in both themes.
- Accessible names for icon-only controls.
- Useful alternative text and no essential information encoded by color alone.
- Respect reduced motion and prevent autoplaying audio.
- Screen-reader announcements for result counts/no-results where appropriate.

### Browser support

Support current evergreen desktop and mobile browsers. Avoid APIs without practical fallback where they would break core tasks. Search, project reading, theme switching, and ZIP download must remain usable on common mobile browsers.

---

## 11. Security, privacy, and ownership

- Never commit credentials, API keys, personal tokens, private keys, `.env` files, or secrets into project ZIPs or public source.
- Validate paths to prevent directory traversal; reject paths that escape the project folder.
- Prevent ZIP slip/path traversal in archive entries and avoid following external symlinks.
- Sanitize Markdown-rendered HTML and validate URL protocols. No `javascript:` links, arbitrary executable HTML, or unsafe embeds.
- Use safe external-link attributes where tabs open externally.
- Keep third-party scripts/analytics disabled by default.
- Be transparent in documentation: if the GitHub repository is public, committed projects and source files may be viewable on GitHub whether or not the website shows a download link. Use separate private repositories or an external private workflow for projects that must not be public.
- Respect third-party assets and licenses. Owner is responsible for having permission to publish project content.

---

## 12. Hosting and release requirements

### Hosting choice

Use Firebase Hosting for this static-first site. It serves static assets through Google's CDN and provides HTTPS for hosted domains. Astro's static build is compatible with Firebase Hosting. A server-rendered or database-backed application is not needed for the stated version-one features.

Official references:
- Firebase Hosting quickstart: https://firebase.google.com/docs/hosting/quickstart
- Firebase Hosting overview: https://firebase.google.com/docs/hosting/
- Astro Firebase deployment guide: https://docs.astro.build/en/guides/deploy/firebase/
- Firebase GitHub Actions deployment: https://firebase.google.com/docs/hosting/github-integration
- Firebase Hosting vs App Hosting: https://firebase.google.com/docs/app-hosting/product-comparison

### Local release sequence

1. Install Node.js LTS and the repository's documented package manager.
2. Install dependencies.
3. Run type/lint/tests and `npm run build` (or equivalent).
4. Confirm the static site is in `dist/` and generated project archives are present only for eligible real projects.
5. Create a Firebase project in the Firebase console.
6. Install/use Firebase CLI, authenticate, and initialize Hosting from the repository root.
7. Set the Hosting public directory to `dist`; do not set SPA rewrites that override the static project routes.
8. Test a preview/deployment and verify home, project pages, media, 404, and downloads.
9. Deploy with `firebase deploy --only hosting`.
10. Connect a custom domain later if desired; do not hardcode a domain before it exists.

GitHub Actions auto-deploy can be added after manual deployment is understood. If configured, use Firebase's supported GitHub integration, least-privilege access, and repository secrets generated by the official setup. Never paste credentials into source files.

### Cost and media note

A static site is the simplest, low-maintenance fit for this product. Nevertheless, large project ZIPs and videos add storage, deployment size, and bandwidth. Keep media optimized; use an external video host for large previews and check the current Firebase pricing/usage limits before publishing very large archives.

---

## 13. Testing and quality gates

Minimum pre-release checks:

- clean install works;
- type checks and lint/format commands pass;
- unit tests for metadata/path validation and ZIP exclusions pass;
- static build succeeds with zero projects;
- temporary test fixture can generate a card, detail page, README, media paths, and ZIP, then be fully removed;
- archives do not contain dependencies, secrets, generated build output, or themselves;
- URL and file paths are correctly escaped/validated;
- no broken assets or links in the generated catalog;
- theme toggle works and is persistent;
- gallery supports keyboard interaction and respects reduced motion;
- search/filter combinations work;
- pages are usable by keyboard and on mobile sizes;
- no placeholder/test project appears in production output;
- Firebase deploy configuration points at `dist/` and preserves static routes.

If browser automation is available, test real rendered output in light and dark modes. Report any verification not performed honestly.

---

## 14. Operational workflow for adding a project

1. Create `projects/<new-slug>/`.
2. Add `project.json` using the documented schema.
3. Add its real `README.md` with explanation and actual setup instructions.
4. Add real screenshots to `media/screenshots/`, plus optional cover/video.
5. Put the files intended for the downloadable package inside the project directory, preserving the project's sensible native structure.
6. Check all links, paths, alt text, license rights, and remove credentials/dependency folders/build artifacts.
7. Run the validation/test/build commands.
8. Inspect the generated project card and detail page locally and test the ZIP.
9. Commit/push the changes; deploy manually or let the configured GitHub Action deploy.

Follow the instructions in `README.md` or `docs/ADDING_PROJECTS.md` when adding a project. Each project must be isolated to its own named folder and preserve all existing projects.

---

## 15. Release deliverables

The first completed implementation should include:

- full responsive Astro site with light/dark themes;
- real-content-only project catalog, empty state, search and filters;
- project detail routes generated from project folders;
- screenshot/video support;
- safe README rendering and setup information;
- build-time project ZIP generation with exclusions and validation;
- project schema/template and owner-facing add-project guide;
- complete local development/testing/build instructions;
- Firebase Hosting setup and deployment configuration;
- root `README.md` for project architecture and procedures;
- tests for the key data/archive/path behavior;
- a successful zero-project production build;
- a final summary listing actual files created, test/build results, and owner actions still required.

**Definition of done:** The user can clone the repository, run the documented commands, view a polished empty BroCodes site locally, add one real project by following the convention, rebuild, see it appear on the site with its own detail page, and download its real ZIP without a backend.
