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