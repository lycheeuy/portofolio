# Phase 6D — Portfolio Information Architecture

Branch `fix/lanyard-5d3-regression` · 2026-09-02 · uncommitted in the working tree

---

## 1. Objective

Convert the portfolio from a single long page with four in-page anchors into a
small multi-page site:

| Route | Content |
|---|---|
| `/` | Profile / Hero, positioning, Cirebon, navigation, Lanyard |
| `/projects` | Project index |
| `/projects/[slug]` | Project case study |
| `/research` | Research index |
| `/research/[slug]` | Research entry |
| `/about` | Existing About content |
| `/contact` | Existing Contact content |

Primary navigation: Home / Projects / Research / About / Contact.

Constraints: no invented content, `src/data/` is the source of truth, missing
fields stay missing, no content duplicated into page components, the editorial ×
engineering × personal direction preserved, no Lanyard redesign, no new
dependencies, responsive and accessible.

---

## 2. Current state when resumed

Phase 6D had **not been started**. The repository was mid-Phase-6C, uncommitted:

- `src/app/` contained only `layout.tsx`, `page.tsx`, `globals.css`,
  `favicon.ico` — one route.
- `page.tsx` rendered `SiteHeader` + Hero + SelectedWork + ResearchLog + About +
  Contact + `SiteFooter` as one document.
- `NAVIGATION` in `src/data/site.ts` carried `#work`, `#research`, `#about`,
  `#contact`.
- Phase 6C's shared UI (`components/ui/styles.ts`, `action-link.tsx`,
  `layout/section-header.tsx`) was present and uncommitted.
- `Docs/PHASE_6D_REPORT.md` did not exist.
- An untracked `Docs/Detail.txt` contained new, un-ingested owner input.

`git log` head: `7ae7682 docs: record the Phase 6B commit hash in the development log`.

---

## 3. Work completed in this session

1. **Navigation moved from anchors to routes.** `NAVIGATION` now carries paths
   and gains `Home`. `SectionMeta` gained `href`, so the `00`–`04` archive index
   still resolves from one list; `getSection(href)` replaces four scattered
   lookups. Short nav labels and full page headings are kept as separate fields.
2. **Header and footer moved into the root layout**, with `main#top` (the
   skip-link target). They no longer unmount on navigation.
3. **`PrimaryNav`** — a new client component that marks the current route with
   `aria-current="page"` and an accent underline. A detail page lights its index.
4. **Case study extracted** to `components/projects/project-detail.tsx` — the
   body previously inlined in `selected-work.tsx`, moved without editing its
   fields, ordering, conditional rendering, or the two scrollable results tables.
5. **`selected-work.tsx` became the `/projects` index** — index number, facts
   rail, linked title, summary, dataset line, flattened stack.
6. **Research split the same way** into `research-log.tsx` (ledger) and
   `components/research/research-detail.tsx`, with `STATUS_LABEL` / `SETTLED`
   lifted to `components/research/status.ts` for both.
7. **Seven route files plus a 404** created under `src/app/`, each resolving a
   route and its metadata and rendering exactly one component.
8. **Per-route metadata** — a `title` template in the root layout and a `title`
   and `description` per route, each composed from the data layer.
9. **`ActionLink` routes internally through `next/link`**, keeping outbound
   links as plain `<a target rel>`. New `BackLink` for detail pages.
10. **`SectionHeader` gained `level`** so a page opener renders `<h1>`.
11. **New homepage `SiteIndex`** — a directory of the four destinations with one
    data-derived line each.
12. **Mobile menu reworked** to derive `open` from the current path, so it
    closes on navigation and on a back gesture with no `useEffect`.

---

## 4. Routes created / changed

| Route | File | Status | Rendering |
|---|---|---|---|
| `/` | `src/app/page.tsx` | changed | Static |
| `/projects` | `src/app/projects/page.tsx` | new | Static |
| `/projects/tuberculosis-detection` | `src/app/projects/[slug]/page.tsx` | new | SSG |
| `/projects/melon-detection` | same | new | SSG |
| `/research` | `src/app/research/page.tsx` | new | Static |
| `/research/icwt-2026` | `src/app/research/[slug]/page.tsx` | new | SSG |
| `/research/icsmech-2026` | same | new | SSG |
| `/about` | `src/app/about/page.tsx` | new | Static |
| `/contact` | `src/app/contact/page.tsx` | new | Static |
| 404 | `src/app/not-found.tsx` | new | Static |

Both dynamic segments set `dynamicParams = false` and enumerate their slugs via
`generateStaticParams`, so an unlisted slug 404s instead of rendering.

**Slugs are the ones in `src/data/`,** not the ones the brief assumed. The brief
named `/projects/thoraxvision` and `/projects/melonvision-ai`; `projects.ts`
records `tuberculosis-detection` and `melon-detection`, and the brief's own rule
("use the actual slugs found in the data layer") settles it. See §9.

---

## 5. Files changed

**New (11)**

```
src/app/not-found.tsx
src/app/about/page.tsx
src/app/contact/page.tsx
src/app/projects/page.tsx
src/app/projects/[slug]/page.tsx
src/app/research/page.tsx
src/app/research/[slug]/page.tsx
src/components/layout/primary-nav.tsx
src/components/projects/project-detail.tsx
src/components/research/research-detail.tsx
src/components/research/status.ts
src/components/sections/site-index.tsx
src/components/ui/back-link.tsx
```

**Modified (12)**

```
src/app/layout.tsx                     header/main/footer, title template
src/app/page.tsx                       Hero + SiteIndex only
src/data/site.ts                       route NAVIGATION, SECTIONS.href, getSection
src/data/research.ts                   + getResearchForProject (no content change)
src/types/index.ts                     SectionMeta.href
src/components/layout/nav-links.ts     + isActiveHref
src/components/layout/site-header.tsx  wordmark → "/", nav extracted
src/components/layout/site-footer.tsx  next/link, wordmark → "/"
src/components/layout/mobile-nav.tsx   derived open state, Link, aria-current
src/components/layout/section-header.tsx  `level` prop
src/components/ui/action-link.tsx      next/link for internal hrefs
src/components/sections/hero.tsx       CTAs → /projects, /contact
src/components/sections/selected-work.tsx  full case study → index rows
src/components/sections/research-log.tsx   ledger rows → linked, status lifted
src/components/sections/about.tsx      level=1, h3→h2, /research and /contact
src/components/sections/contact.tsx    level=1, h3→h2
```

Not touched: `components/lanyard/*`, `globals.css`, `next.config.ts`,
`package.json`, `src/lib/utils.ts`, `src/data/profile.ts`, `src/data/projects.ts`.

---

## 6. Data-model changes

Structural only. **No content was added, edited, or removed.**

- `SectionMeta` gained `href: string`. `id` still names the DOM landmark; `href`
  is the route. They were the same string while the site was one page.
- `NAVIGATION` values changed from `#anchor` to route paths, and `Home` was
  added as a fifth entry.
- `SECTIONS` entries gained `href`.
- `getSection(href)` added to `site.ts`.
- `getResearchForProject(slug)` added to `research.ts` — a filter over existing
  data, returning `[]` for both projects today because `projectSlug` is `null`
  on every entry.

Every `pending` array is byte-identical. No metric, URL, date, title, company,
or publication detail was introduced anywhere.

---

## 7. UI / UX changes

- **Home** is now an entry point: Hero (name, positioning, trajectory,
  availability, Cirebon colophon, Lanyard) followed by **Index** — the four
  destinations at full size with one data-derived line each (`2 projects`,
  `2 venues confirmed`, the education field, the availability line).
- **`/projects`** is a selection screen: index rail with Discipline / Context /
  Timeline, linked title with a stepping arrow, summary, dataset line, stack
  tags. The full case study is one click away, not on the page.
- **`/projects/[slug]`** carries back navigation, the project title as `<h1>`, a
  colophon fact strip, Problem / Approach / Dataset / Stack / Links, the two
  results tables when the project has benchmarked models, a Related-research
  block when the data links one, and a Next-project pager.
- **`/research`** keeps the ruled ledger; each row's heading is now a link.
- **`/research/[slug]`** renders every field conditionally. With both entries
  venue-only it shows the venue, year, and status, then one line stating that
  the title, topic, contribution, and links are published when confirmed.
- **Back navigation** on every detail page (`← SELECTED WORK` / `← RESEARCH LOG`)
  — always a real link to the index, never `router.back()`.
- **Current-page marking** in both the desktop nav and the mobile overlay.
- **A styled 404** inside the layout, with a way back.
- Visual direction unchanged: same tokens, type scale, hairline rules, mono
  metadata, index numbering, single terracotta accent. No cards, gradients,
  glassmorphism, or added animation. The Lanyard is untouched.

---

## 8. Verification results

| Check | Result |
|---|---|
| `npm run lint` | **Clean** — no output, no warnings |
| `npx tsc --noEmit` | **Exit 0** (after `next typegen`; `PageProps<'/projects/[slug]'>` needs generated route types) |
| `npm run build` | **Exit 0** — 29.1s, 12/12 static pages, 8 routes, 4 SSG |

**Every route renders** — served from `next start` and requested:

| Route | HTTP | `<h1>` | Title |
|---|---|---|---|
| `/` | 200 | 1 | Alif Reezi - AI Engineer |
| `/projects` | 200 | 1 | Selected work — Alif Reezi |
| `/projects/tuberculosis-detection` | 200 | 1 | Tuberculosis Detection — Alif Reezi |
| `/projects/melon-detection` | 200 | 1 | Melon Plant Detection — Alif Reezi |
| `/research` | 200 | 1 | Research log — Alif Reezi |
| `/research/icwt-2026` | 200 | 1 | ICWT 2026 — Alif Reezi |
| `/research/icsmech-2026` | 200 | 1 | ICSMech 2026 — Alif Reezi |
| `/about` | 200 | 1 | About — Alif Reezi |
| `/contact` | 200 | 1 | Contact — Alif Reezi |
| `/projects/thoraxvision` | **404** | — | (correctly rejected) |

**Link crawl.** Every `href` on every route followed: 9 internal routes all 200.
No `#work` / `#research` / `#about` / `#contact` anchor survives anywhere; the
only hash left is `#top` (skip link). Three outbound links, all with `target`,
`rel="noopener noreferrer"`, and an `sr-only` note.

**Responsive — 9 routes × 7 widths = 63 combinations, 0 problems.** Measured
`documentElement.scrollWidth` against `clientWidth` in headless Chrome via CDP:

| Width | scrollWidth / clientWidth | Overflow |
|---|---|---|
| 1440 | 1425 / 1425 | 0 |
| 1280 | 1265 / 1265 | 0 |
| 1024 | 1009 / 1009 | 0 |
| 768 | 753 / 753 | 0 |
| 430 | 430 / 430 | 0 |
| 390 | 390 / 390 | 0 |
| 375 | 375 / 375 | 0 |

The `min-w-[34rem]` / `min-w-[38rem]` results tables still scroll inside their
own port at 375 rather than widening the document.

**Accessibility — heading outlines @1440,** one `<h1>` each, no skipped level:

```
/                                 1 2
/projects                         1 2 2
/projects/tuberculosis-detection  1 2 2 2 2 2
/projects/melon-detection         1 2 2 2 2
/research                         1 2 2 2
/research/icwt-2026               1
/research/icsmech-2026            1
/about                            1 2 2
/contact                          1 2 2 2
```

A research detail page carries a lone `<h1>` because every optional block below
it is `null` in the data.

**Landmarks.** Exactly one `body > header`, one `main`, one `body > footer` per
route. Two `nav`s on an index page, three on a detail page (the pager carries
its own `aria-label`).

**Keyboard and overlay — 24 checks, 0 failed,** driven with real key events:

- First Tab reaches the skip link (1×1 while `sr-only`, 131×39 focused) with a
  `rgb(158, 79, 53) solid 2px` focus ring.
- Desktop nav marks `/projects` current while on `/projects/melon-detection`.
- Mobile @390: opens, `aria-expanded="true"`, focus lands on Close, scroll
  locked, 5 links, current route marked, Tab trapped inside, Escape closes and
  restores focus and scroll.
- Tapping a link navigates client-side; the panel is gone and the lock released.
- `history.back()` with the menu open lands on `/` with **no overlay**.
- `/projects`: 18 focusables, none unreachable, none unnamed.

**Target sizes.** Two elements under 24px, both pre-existing and both correct:
the `sr-only` skip link, and About's "Research log" link inline in a sentence
(WCAG 2.5.8 inline exception). Everything else is ≥44px.

**Console.** No errors or warnings on any route. The Lanyard still renders on
`/` under ANGLE/SwiftShader.

---

## 9. Remaining missing data / issues

**1. `Docs/Detail.txt` is not ingested — this is the significant one.**
An untracked file in the working tree contains new owner input that Phase 6D
deliberately did not act on, because 6D was scoped to information architecture
and its own rules made `src/data/` the source of truth. It contains:

- Final project names: **ThoraxVision** and **MelonVision AI** — which is where
  the brief's `/projects/thoraxvision` and `/projects/melonvision-ai` came from.
  Adopting them changes titles, slugs, and therefore URLs.
- MelonVision AI: repository URL, year 2026, and the model architecture
  (MobileNetV2 FOMO, INT8-quantised, via TFLite), plus a stated project goal and
  a described engineering achievement.
- Both paper titles, both full conference names, both topics, both author
  positions, and two research repository URLs — which would turn `/research`
  from a venue register into a real publication list.
- Long-form "about me" copy (in Indonesian), which is exactly the
  owner-pending personal copy that About's authored paragraphs stand in for.
- A **different final email address** from the one currently published
  site-wide.

Two decisions in that file are the owner's, not implementable as written:

- *"untuk sementara tidak perlu menampilkan nilai persentase semua modelnya"* —
  taken literally this removes both results tables from the ThoraxVision page,
  which is currently the densest evidence on the site.
- The email in `Detail.txt` differs from the one in `profile.ts`, which is used
  in the Hero colophon, Contact, the mobile menu, and page metadata. One of them
  is wrong and only the owner can say which.

**2. Still missing after that file is ingested:** ResNet50 accuracy;
specificity for all three ThoraxVision models; the contradictory VGG19
Tuberculosis F1 (`0.5745` recorded for both classes); MelonVision detection
figures; whether the client may be named; graduation year and institution;
work-experience entries; production domain (`site.url` is `null`, so canonical
URLs, sitemap, robots, and Open Graph remain unset).

**3. Pre-existing, unchanged by this phase:** the About statement paragraphs are
authored connective copy pending owner approval; nothing after 5D-2 is merged to
`main`, and Phases 6C and 6D are not yet committed.

**No known defects** were found in the Phase 6D work itself.

---

## 10. Recommended next phase

**Phase 6E — Content ingestion from `Docs/Detail.txt`.** Not more pages; the
structure is finished. The order that avoids rework:

1. Ask the owner the two blocking questions: is the metrics table to be removed
   or kept, and which email address is canonical.
2. Ingest the confirmed facts into `src/data/` — project renames, repository
   URLs, the MelonVision year and architecture, paper titles, conference names,
   topics, author positions, research repository links. Move each ingested item
   out of its `pending` array.
3. Rename the slugs (`tuberculosis-detection` → `thoraxvision`,
   `melon-detection` → `melonvision-ai`) in `projects.ts` only. Every route,
   link, and `generateStaticParams` entry follows automatically — no component
   or page file needs editing. Add redirects from the old paths if either has
   been shared.
4. Set `research` entries' `status` and `projectSlug` from the answers; the
   ledger, the detail pages, and the project↔research cross-links all fill in
   with no code change.
5. Translate and place the personal copy, replacing About's authored
   paragraphs.

Then commit and merge the branch — 5D-3 through 6D are all still unlanded.
