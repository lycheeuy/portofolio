# Alif Reezi — Engineering Archive

Personal portfolio website for **Nashiruddin Alif Alvareezi** (Alif Reezi) — AI Engineer, Machine Learning Engineer, and Biomedical Engineering graduate.

The site is built as a personal engineering archive rather than a generic developer template: an editorial, typography-led presentation of research and shipped systems.

**Design direction:** `EDITORIAL × ENGINEERING × PERSONAL`

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.3.1 | App Router, fully static generation |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS 4 | CSS-first — no `tailwind.config.js` |
| Animation | Motion for React | Added in Phase 5C |
| Interactive | React Bits Lanyard | Added in Phase 5C (via shadcn CLI) |
| Icons | Lucide React | Added in Phase 5C |
| Fonts | Fraunces · DM Sans · JetBrains Mono | Self-hosted via `next/font/local` |
| Deployment | Vercel | GitHub auto-deploy |

---

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
# → http://localhost:3000

# Type check (no emit)
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

---

## Project structure

portofolio/
├── public/
│ ├── fonts/ Self-hosted variable font files (.woff2)
│ │ ├── fraunces-variable-normal.woff2
│ │ ├── fraunces-variable-italic.woff2
│ │ ├── dm-sans-variable-normal.woff2
│ │ ├── dm-sans-variable-italic.woff2
│ │ └── jetbrains-mono-variable-normal.woff2
│ └── images/
│ ├── projects/
│ │ ├── tuberculosis-detection/
│ │ └── melon-detection/
│ └── og/ Open Graph images
│
├── src/
│ ├── app/ Routes and root layout
│ │ ├── layout.tsx Root layout, font loading, metadata
│ │ ├── page.tsx Homepage
│ │ └── globals.css Tailwind import, design tokens
│ ├── components/ React components, organized by concern
│ │ ├── layout/ Navigation, footer
│ │ ├── sections/ Homepage sections
│ │ ├── work/ Work list and preview interaction
│ │ ├── project/ Case study page components
│ │ ├── research/ Research log entries
│ │ ├── lanyard/ 3D Lanyard wrapper (lazy-loaded)
│ │ ├── ui/ Reusable primitives
│ │ └── seo/ Structured data
│ ├── data/ Content source of truth (Phase 5B)
│ ├── lib/ Utility functions
│ │ └── utils.ts cn() class-name helper
│ └── types/ TypeScript interfaces
│ └── index.ts
│
├── .env.local.example Documents NEXT_PUBLIC_SITE_URL
├── next.config.ts
├── tsconfig.json Alias: @/* → ./src/*
├── postcss.config.mjs Tailwind 4 PostCSS integration
└── eslint.config.mjs


---

## Architecture principles

- **Static-first.** No database, no API routes, no CMS. All content lives in typed TypeScript files under `src/data/` and is rendered at build time.
- **Server Components by default.** Client Components are added only where a browser API or interaction requires them (target: 8 total).
- **Minimal dependencies.** A library is added only when CSS or a few lines of code cannot do the job.
- **The Lanyard is isolated.** The 3D credential card is dynamically imported with SSR disabled, so its Three.js dependency chain never enters the main bundle. A static fallback card always renders first.

---

## Fonts

Fonts are self-hosted to avoid any build- or runtime dependency on Google Fonts.

Variable font files are sourced from `@fontsource-variable/*` packages (dev dependencies) and copied into `public/fonts/`. They are loaded through `next/font/local` in `src/app/layout.tsx` and exposed as CSS variables:

| Role | Family | CSS variable | Tailwind utility |
|---|---|---|---|
| Display | Fraunces | `--font-fraunces` | `font-display` |
| Body | DM Sans | `--font-dm-sans` | `font-sans` |
| Technical | JetBrains Mono | `--font-jetbrains-mono` | `font-mono` |

---

## Environment variables

No secrets are required. Copy `.env.local.example` to `.env.local` for local development:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

Set this to the production domain before launch — it is used for canonical URLs, the sitemap, and Open Graph metadata.

---

## Design constraints

The visual language deliberately avoids the aesthetic commonly associated with AI-generated portfolios. Do **not** introduce:

- Neon blue, purple, or cyan
- Futuristic gradients or glassmorphism
- Glowing borders or particle backgrounds
- Robot or generic "AI" imagery
- Excessive rounded cards or SaaS-dashboard styling

Instead: warm off-white background, charcoal text, a single muted terracotta accent, thin borders, generous whitespace, and typography-led hierarchy.

---

## Implementation phases

| Phase | Scope | Status |
|---|---|---|
| 5A | Project initialization & foundation | ✅ Complete |
| 5B | Design tokens & data layer | ⏳ Next |
| 5C | Hero & Lanyard | — |
| 5D | Work, Research, Capabilities sections | — |
| 5E | Case study pages | — |
| 5F | Responsive, accessibility, SEO, performance | — |

---

## License

Private project. Not licensed for reuse.