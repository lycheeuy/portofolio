# Alif Reezi — Engineering Archive

Personal portfolio website for **Nashiruddin Alif Alvareezi** (Alif Reezi) — AI Engineer, Machine Learning Engineer, and Biomedical Engineering graduate.

The site is built as a personal engineering archive rather than a generic developer template: an editorial, typography-led presentation of research and shipped systems.

**Design direction:** `EDITORIAL × ENGINEERING × PERSONAL`

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.3.1 | App Router, every route statically prerendered |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS 4 | CSS-first — no `tailwind.config.js`; the design system is `src/app/globals.css` |
| 3D | React Three Fiber · drei · Rapier · meshline | The hero Lanyard only; loaded behind `next/dynamic({ ssr: false })` |
| Fonts | Fraunces · DM Sans · JetBrains Mono | Self-hosted via `next/font/local` |
| Deployment | — | No production domain yet; `site.url` in `src/data/site.ts` is `null` until one is chosen |

No animation library, icon set, or UI kit. The Lanyard is adapted from the
React Bits component source (see `Docs/DEVELOPMENT_LOG.md` §5), not installed
as a package.

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

```
src/
├── app/                    One file per route
│   ├── layout.tsx          Root layout: fonts, title template, share/crawl metadata, header + footer
│   ├── page.tsx            /                    Hero + site index
│   ├── projects/           /projects, /projects/[slug]
│   ├── research/           /research, /research/[slug]
│   ├── about/page.tsx      /about
│   ├── contact/page.tsx    /contact
│   ├── not-found.tsx       404, inside the layout
│   ├── robots.ts           /robots.txt
│   ├── sitemap.ts          /sitemap.xml (entries appear once `site.url` is set)
│   └── globals.css         Entire design system (@theme + base layer)
├── components/
│   ├── layout/             Header, navs, footer, section primitives
│   ├── sections/           Page bodies: hero, site index, selected work, research log, about, contact
│   ├── projects/           Project case-study view
│   ├── research/           Research entry view + status labels
│   ├── ui/                 Shared class strings and link primitives
│   └── lanyard/            Isolated 3D bundle (client components)
├── data/                   Content source of truth — profile, projects, research, site
├── lib/                    cn(), metadata helpers
└── types/index.ts          Content interfaces consumed by data/

public/
├── fonts/                  Self-hosted variable woff2 files
├── lanyard/card.glb        Lanyard card geometry
└── images/og/              Reserved for the Open Graph image (empty — pending)
```

`Docs/DEVELOPMENT_LOG.md` carries the full per-file tree and the reasoning
behind it.

---

## Architecture principles

- **Static-first.** No database, no API routes, no CMS. All content lives in typed TypeScript files under `src/data/` and is rendered at build time.
- **Server Components by default.** Client Components exist only where a browser API or interaction requires them — the mobile menu, the desktop nav's current-page marker, and the two Lanyard components.
- **Minimal dependencies.** A library is added only when CSS or a few lines of code cannot do the job.
- **The Lanyard is isolated.** The 3D credential card is dynamically imported with SSR disabled, so its Three.js dependency chain never enters the main bundle. A WebGL capability probe and an error boundary guard it.
- **Nothing is invented.** Every name, figure, URL, and date on the site traces to an owner-supplied document. Anything not yet supplied is `null` in `src/data/` with a `pending` note, and the UI renders nothing for it rather than filler.

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

None are required, and none are read by the app yet. The production origin
is `site.url` in `src/data/site.ts`; it is `null` until a domain is chosen,
and canonical URLs, `og:url`, the sitemap entries, and the robots `Sitemap:`
line all switch on when it is set. There is no `.env` file in the repository:
`.gitignore` excludes `.env*`, so a `.env.local.example` on a local checkout
is not tracked and a fresh clone does not receive one.

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

## Development record

`Docs/DEVELOPMENT_LOG.md` is the rolling record of every phase, what it
changed, how it was verified, and what is still owner-pending. Per-phase
reports sit beside it in `Docs/`.

---

## License

Private project. Not licensed for reuse.