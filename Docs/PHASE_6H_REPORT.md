# Phase 6H — Final QA & Launch Readiness

Branch `main` · 2026-09-21 · on top of `5bc1766` (Phase 6G) · **at review gate, not committed**

---

## 1. Scope

A technical and content audit of the portfolio before production launch. No
feature work, no visual-system, route, dependency, or Lanyard change, nothing
invented, no owner decision taken by the audit itself, nothing deployed. Every check below was
run against a fresh production build (`next build` + `next start` on
`localhost:3123`) and, where a browser was needed, against headless Chrome
over the DevTools Protocol (no extension; widths emulated with
`Emulation.setDeviceMetricsOverride`).

Result: **PASS WITH NOTES.** Two fixes made: a README sentence, and the
removal of the phone number from the repository (owner decision, taken
after the audit surfaced it). One housekeeping note remains (§15).

---

## 2. Repository baseline

| Check | Result |
|---|---|
| Branch | `main` |
| Working tree at start | clean |
| `HEAD` | `5bc1766` feat: content and credibility polish … (Phase 6G) |
| `origin/main` | `6439cd4` (Phase 6F) — local is **ahead by 1** (6G not pushed) |
| Side branches | `fix/lanyard-5d3-regression` (fully merged), `phase-5d-3-lanyard` — both still present |
| Remote | `https://github.com/lycheeuy/portofolio.git`; the repository is **publicly reachable** (HTTP 200 unauthenticated) |
| History | not modified |

---

## 3. Route audit

Build output: 14 static pages — 9 routes, `/_not-found`, `/robots.txt`,
`/sitemap.xml`. Every route under `src/app/` maps to the expected
architecture; no obsolete route file exists.

| Path | Status | Notes |
|---|---|---|
| `/` | 200 | Hero + site index; Lanyard canvas present at all 7 widths |
| `/projects` | 200 | |
| `/projects/thoraxvision` | 200 | SSG from `generateStaticParams` |
| `/projects/melonvision-ai` | 200 | SSG |
| `/research` | 200 | |
| `/research/icwt-2026` | 200 | SSG |
| `/research/icsmech-2026` | 200 | SSG |
| `/about` | 200 | |
| `/contact` | 200 | |
| `/robots.txt` | 200 | |
| `/sitemap.xml` | 200 | |
| `/projects/tuberculosis-detection` (old slug) | 404 | |
| `/projects/melon-detection` (old slug) | 404 | |
| `/research/nope` | 404 | |
| `/does-not-exist` | 404 | |

The 404 renders inside the root layout with one `h1` ("Not found"), the
header, the footer, and four `ActionLink`s back into the site. Next injects
`<meta name="robots" content="noindex">` on it and nowhere else.

---

## 4. Internal / external link audit

**Internal.** Every `href` in `src/` either is a literal route (`/`,
`/projects`, `/research`, `/about`, `/contact`, `#top`) or is composed from
`site.sections` and a data slug (`/projects/${slug}`, `/research/${slug}`).
The set of distinct `href`s across all nine rendered pages and the 404:

```
#top  /  /about  /contact  /projects  /projects/melonvision-ai
/projects/thoraxvision  /research  /research/icsmech-2026  /research/icwt-2026
mailto:alifalvareezi1@gmail.com
https://github.com/lycheeuy
https://github.com/lycheeuy/MelonVision_AI
https://github.com/lycheeuy/my_research/tree/main/ICSMech2026
https://github.com/lycheeuy/my_research/tree/main/ICWT2026
https://thoraxvision.site/
https://www.linkedin.com/in/nashiruddinalifalvareezi/
```

Every internal target returns 200; `main#top` exists on every page for the
skip link. No `href="#"`, no `TODO`/`FIXME`/lorem, no old slug or old route
name anywhere in `src/`, `README.md`, or the rendered HTML. Back links
(`← Selected work`, `← Research log`), next-item pagers, and both CTAs
(`View selected work`, `Get in touch`) resolve.

**External.** Six URLs are rendered. All were fetched:

| URL | Result |
|---|---|
| `https://www.linkedin.com/in/nashiruddinalifalvareezi/` | 999 — LinkedIn's bot block, not a broken link; slug matches the confirmed profile (`www.` form of the brief's URL) |
| `https://github.com/lycheeuy` | 200 |
| `https://thoraxvision.site/` | 200 |
| `https://github.com/lycheeuy/MelonVision_AI` | 200 |
| `https://github.com/lycheeuy/my_research/tree/main/ICWT2026` | 200 |
| `https://github.com/lycheeuy/my_research/tree/main/ICSMech2026` | 200 |

`mailto:alifalvareezi1@gmail.com` is well-formed and is the only email
address in `src/`. Every external anchor carries `target="_blank"
rel="noopener noreferrer"` and an "(opens in a new tab)" accessible suffix.
No placeholder, fake, or internal URL is rendered; the MelonVision live
deployment stays `href: null` with its note.

---

## 5. Content integrity audit

Searched `src/`, `README.md`, `public/`, and the rendered HTML of every
route.

| Looking for | Found |
|---|---|
| Old email `nashiruddinalifalvareezi1@…` | none (only in git history / this log's record of the 2026-09-19 decision) |
| Old slugs / titles (`tuberculosis-detection`, `melon-detection`, "Tuberculosis Detection", "Melon Plant Detection") | none as a name or route; the phrase "melon plant detection system" appears once in the MelonVision summary as a description, which is correct |
| Old location | none; `location` is "Kota Cirebon, West Java, Indonesia" (owner, 2026-09-19); institution "Telkom University Purwokerto" is a separate, documented fact |
| lorem / placeholder / example.com / local paths | none in `src/` or `public/` (`localhost:3000` appears once in README's dev-server instructions) |
| `undefined`, `null`, `NaN`, `[object Object]` in rendered text | none on any route at any width |
| Fake metrics | none rendered; `SHOW_MODEL_RESULTS = false` keeps the ThoraxVision figures off the page; MelonVision has none |
| Invented dates / employers / certifications | none; `year`/`timeline` are `null` for ThoraxVision, `2026` / "20 – 30 June" for MelonVision (owner, 6E); no experience entries exist |
| Invented publication status | none; both research entries are `pending-confirmation` |
| Client-private information | the MelonVision client is not named; the live URL is not rendered |

Display name, full name, status, email, and both project names match the
brief's known facts everywhere they render.

---

## 6. Project / research audit

- **Names.** "ThoraxVision" and "MelonVision AI" are the only spellings in
  data, titles, metadata, index rows, pagers, and About.
- **Case-study links.** `/projects` → both slugs; About → both slugs; each
  case study's next-project pager → the other; every one returns 200.
- **Technical claims.** Every stack item, approach line, dataset count
  (4,784 / 1,250), and the MelonVision outcome paragraph is present in
  `projects.ts` with its documented source; no component adds a claim.
- **Hidden figures.** The `models` arrays render nothing (`SHOW_MODEL_RESULTS`
  false); no accuracy, AUC, precision, or recall figure appears in any
  rendered page.
- **Research relationships.** Both entries carry `projectSlug: "thoraxvision"`;
  the ThoraxVision page renders the Related-research block with both
  papers, MelonVision renders none; each research detail links back to
  ThoraxVision as its source project.
- **Venue / year / contribution.** ICWT 2026 · Second author, ICSMech 2026 ·
  First author — the same on `/about`, `/projects/thoraxvision`, `/research`,
  and both detail pages. All from `research.ts` (owner, 6E).
- **Consistency note (no change).** The home index row reads "2 venues
  confirmed" while `/research`'s description reads "2 conference papers".
  Both are true and both come from the data; the status-label wording is
  one of the four open 6E §7 candidates and is left for the owner.

---

## 7. SEO / metadata audit

Head metadata was dumped for all nine routes and the 404 from the
production server.

- **Titles.** Homepage: `Alif Reezi — AI / Machine Learning Engineer`. Every
  other route: `<page> — Alif Reezi` via the template. Research detail
  titles are the full paper titles.
- **Descriptions.** One per route, each composed from data; the research
  index description is the 6G data-driven wording ("2 conference papers —
  ICWT 2026 and ICSMech 2026 — …").
- **Open Graph / Twitter.** `og:title` = tab title, `og:description` = page
  description, `og:site_name`, `og:type: website`, `twitter:card: summary`,
  `twitter:title`, `twitter:description` on every route. `author` and
  `creator` = full name.
- **No fabricated origin.** `site.url` is `null`. No `<link rel="canonical">`,
  no `og:url`, no `og:image`, no `metadataBase` is emitted; `robots.txt` is
  `User-Agent: *` / `Allow: /` with no `Sitemap:` line; `sitemap.xml` is a
  well-formed empty `urlset`. (The switch-on path was verified in 6G with a
  throwaway build and is unchanged.)
- **No duplicates or conflicts.** One `<title>`, one `description`, one of
  each `og:`/`twitter:` tag per page. The 404 carries Next's own `noindex`
  and no second robots tag.
- **Sitemap composition.** `site.sections` + project slugs + research slugs
  — exactly the nine public routes, nothing else, once a domain exists.

---

## 8. Accessibility audit

Headless Chrome, 9 routes × 7 widths (63 renders), plus keyboard walks.

| Check | Result |
|---|---|
| `h1` per page | exactly 1 on all 63 renders and on the 404 |
| Heading outline (at 1280) | `/` 1 2 · `/projects` 1 2 2 · case study 1 2×6 · `/research` 1 2 2 2 · entry 1 2 2 2 2 · `/about` 1 2 2 2 3 2 3 2 2 · `/contact` 1 2 2 2 — no skipped level anywhere |
| Landmarks | one `<main id="top">`, one site `<header>`, one `<footer>` on every page; a second `<header>` on case-study and entry pages is the article's own header inside `<main>` (not a banner landmark) |
| `<nav>` | 2 per page (primary + footer), 3 on detail pages (the back-link nav) |
| Unnamed focusables | 0 on all 63 renders |
| Images | 0 `<img>` elements on any route (the Lanyard is a canvas, the card artwork is generated); nothing needs `alt` |
| Empty `section`/`ul`/`ol`/`dl` | 0 |
| Target size | the only focusable under 24px is the skip link at rest (visually hidden until focus; measured 1px). The inline "Research log" link in About's running text is exempt (WCAG 2.5.8 inline exception), as recorded in 6G |
| Focus ring | `outline: 3px` in the ink colour on links; every Tab stop in the three walks had `outlineStyle != none` |
| Tab walk `/` @390 | 12 stops: skip link → wordmark → menu button (`aria-expanded=false`) → both CTAs → email → 4 index rows → footer; all visible, named, ringed, in document order |
| Tab walk `/about` @390 | 8 stops sampled; same properties |
| Tab walk `/projects/thoraxvision` @1280 | 20 stops: skip → wordmark → 5 primary nav → back link → Live (opens in new tab) → 2 papers → next project → footer wordmark → 5 footer links → LinkedIn, GitHub; all visible, named, ringed |
| Mobile menu | button `aria-label="Open menu"`, `aria-controls="mobile-menu"`, `aria-expanded` false→true on open; panel is `role="dialog" aria-modal="true" aria-label="Menu"`; focus moves inside the panel on open; body scroll locked; no horizontal overflow while open; Escape closes it and returns focus to the button; panel links = 5 routes + email + LinkedIn + GitHub |
| Contrast | no colour, token, or text-style change was made in 6G or 6H; the 6B/6C contrast fixes stand |

---

## 9. Responsive audit

Widths 375, 390, 430, 768, 1024, 1280, 1440 on all nine routes:
`scrollWidth − clientWidth = 0` on all 63 renders. The homepage at every
width renders the Lanyard `<canvas>`. Navigation, hero, project rows,
research entries, About, Contact, footer, and both detail-page types were
part of the same sweep (they are what the nine routes contain). Screenshots
were not taken; no cosmetic change was made.

---

## 10. Runtime / console audit

Captured per render: `Runtime.consoleAPICalled` (error/warning),
`Runtime.exceptionThrown`, `Log.entryAdded` (error/warning),
`Network.loadingFailed`, and any `Network.responseReceived` with status ≥ 400.

| Route(s) | Result |
|---|---|
| All 9 routes × 7 widths | 0 uncaught exceptions, 0 failed requests, 0 responses ≥ 400, 0 hydration messages |
| `/` only | 3 pre-existing Lanyard warnings, all inside the dynamically imported 3D bundle: `THREE.Clock` deprecation (7/7 widths), Rapier "deprecated parameters for the initialization function" (7/7), a WebGL program-info-log precision note `X4122` (2/7). None is an error; none was introduced by 6G/6H; none affects the page. Unchanged from the 6G record |
| Other 8 routes | console completely clean |

Every static asset referenced by the rendered HTML (15 distinct: JS chunks,
CSS, 5 fonts, favicon) returned 200 from the production server; `card.glb`
loads (the canvas mounts at every width).

---

## 11. Asset / dependency audit

**`public/`** (tracked): 5 self-hosted variable `.woff2` files (37–82 KB
each) and `lanyard/card.glb` (163 KB). Each font byte-matches the
`@fontsource-variable/*` package file it was copied from. All are
referenced (`layout.tsx`, the Lanyard). The five create-next-app SVGs were
removed in 6G; nothing obsolete remains. `public/images/og/` and
`public/images/projects/*` exist locally as empty directories, which git
does not track — a fresh clone will not have them (note only; nothing
references them).

**Largest tracked files:** `package-lock.json` 263 KB, `card.glb` 163 KB,
`DEVELOPMENT_LOG.md` 118 KB. Nothing unexpectedly large.

**Dependencies** — each checked against repository usage:

| Package | Used by |
|---|---|
| `next`, `react`, `react-dom` | app |
| `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `meshline` | `components/lanyard/*` |
| `tailwindcss`, `@tailwindcss/postcss` | `globals.css`, `postcss.config.mjs` |
| `eslint`, `eslint-config-next`, `typescript`, `@types/*` | tooling |
| `@fontsource-variable/{dm-sans,fraunces,jetbrains-mono}` (dev) | no import — they are the documented source of the files in `public/fonts/` (README "Fonts"); kept |

No dependency was added, removed, or re-versioned. `next.config.ts` is the
empty default.

---

## 12. Privacy / security audit

Scanned every tracked file (and `git grep` across the index) for phone
numbers, credentials, key patterns (`AKIA…`, `sk-…`, `ghp_…`, PEM headers),
`.env` values, local filesystem paths, and internal URLs.

| Check | Result |
|---|---|
| `.env*` ignored | yes (`.gitignore:34`); no `.env` file is tracked; `process.env` is not read anywhere |
| Secrets / keys / tokens | none (every "token" hit is a design token) |
| Local paths / internal URLs | none in `src/` or `public/`; `localhost:3000` only in README's dev instructions |
| Phone number in the UI | **absent** from the DOM on all 63 renders and the 404 (`primary: false` filters it out of Contact, footer, and mobile menu) |
| Phone number in the repository | **was present** in two tracked files — `src/data/profile.ts` (a `Phone` contact channel, `primary: false`, never rendered) and `Docs/User Input Session.txt:5` — in a publicly reachable repository. **Removed from both** on the owner's instruction (§15 #2). `git grep` over the index and a grep over the whole working tree now find no occurrence of the digits in any form; the only `tel:` hits left are two historical sentences in `DEVELOPMENT_LOG.md` describing the URI scheme, not the number. The value remains in git history (`5bc1766` and earlier); history rewriting is a separate decision |
| Client-private information | MelonVision client unnamed; live URL `null`; no internal hostname anywhere |
| Email | the confirmed address only; the previous address survives only in git history and this log's decision record |

---

## 13. Build verification

| Command | Result |
|---|---|
| `npm run lint` | exit 0, no output |
| `npx tsc --noEmit` | exit 0, no output |
| `npm run build` | exit 0; 14 static pages (9 routes + `/_not-found` + `robots.txt` + `sitemap.xml`); no warnings |

Re-run after both fixes (§15): identical results. The built `/contact`
page renders exactly three channels — `mailto:alifalvareezi1@gmail.com`,
LinkedIn, GitHub — and no `tel:` link appears in any built page.

---

## 14. Launch readiness checklist

**READY**
- Codebase: lint, types, build clean; no dead route, link, or asset.
- Routes: 9 public routes + 404 + robots + sitemap, all resolving; old slugs 404.
- Content integrity: every rendered fact traces to `src/data/`; no stale name, slug, email, or location; no placeholder; no invented figure.
- Accessibility: one `h1`, clean outline, named focusables, working skip link, accessible mobile dialog, visible focus.
- Responsive: 0 horizontal overflow at 7 widths on 9 routes.
- Runtime: no errors, failed requests, or hydration warnings; Lanyard's three deprecation notices are pre-existing and non-fatal.
- Metadata infrastructure: per-route titles, descriptions, OG and Twitter tags; canonical, `og:url`, sitemap entries, and robots `Sitemap:` line wired to `site.url`.

**OWNER-PENDING** (unchanged; nothing assumed)
- Production domain → `site.url`.
- Open Graph / share image → `public/images/og/` + declaration in the root layout.
- Hero mission statement (five options, 5D-1).
- Graduation year; work experience entries.
- ThoraxVision: project dates; GitHub repository; `outcome` (Detail.txt item 10); ResNet50 accuracy, specificity ×3, VGG19 TB F1; whether/when to show the percentage tables; lessons-learned copy.
- MelonVision AI: whether the client may be named; whether the live deployment may be linked; lessons-learned copy.
- Research (both): submission state; host and location; co-authors; paper / DOI / presentation link.
- 6E §7 subjective candidates: status-label wording; MelonVision Timeline + Year as one fact; dataset "not documented" notes moved to `pending`; 404 `<title>` via `global-not-found`.
- Phone number in git history: removed from the working tree in this phase, but `5bc1766` and earlier commits still carry it. Whether to rewrite history is a separate decision.
- Repository: push `5bc1766`; delete the two fully merged side branches.

---

## 15. Findings and fixes

| # | Finding | Severity | Action |
|---|---|---|---|
| 1 | README "Environment variables" said `.env.local.example` "is kept" — but `.gitignore` matches `.env*`, so the file is untracked and a fresh clone does not have it | Doc inaccuracy | **Fixed**: sentence rewritten to say no `.env` file is in the repository and why |
| 2 | Phone number present in `src/data/profile.ts` (`Phone` channel, `primary: false`, never rendered) and `Docs/User Input Session.txt`, both tracked in a publicly reachable repository | Privacy | **Fixed on the owner's instruction**: the `Phone` entry removed from `profile.contact` (no replacement field; `ContactChannel.primary` and the `primary` filters stay, and the three public channels render exactly as before); the `No hp` line removed from the owner-input document, nothing else in it touched; three code comments that described the phone as "kept out" updated (`contact.tsx`, `site-footer.tsx`, `contact/page.tsx`). Repo-wide grep: no occurrence left. Git history not rewritten |
| 3 | `main` is one commit ahead of `origin/main` (6G unpushed); two fully merged side branches remain | Housekeeping | **Not changed** (brief: do not push) |
| 4 | `public/images/og/` and `public/images/projects/*` are empty local directories git does not track | Note | **Not changed**; README describes `og/` as reserved, which is still accurate for a local checkout |

Beyond #1 and #2 no code, data, style, route, dependency, or Lanyard
change was made. #2 is a data removal and three comment edits; no rendered
output changed (verified in the built HTML).

---

## 16. Remaining owner-pending items

See §14 "OWNER-PENDING". Consolidated from `site.pending`,
`profile.pending`, `projects[].pending`, `research[].pending`, the 6E §7
candidates, and the two new notes from this phase (phone number still in
git history; unpushed commit and stale branches).

---

## Proposed commit message

```
docs: final QA and launch-readiness audit (Phase 6H)

Audit-only pass over the production build before launch: repository
baseline, all 9 routes + 404 + robots + sitemap, every internal and
external link, content integrity against the confirmed facts, project and
research consistency, per-route metadata, accessibility, 7-width
responsive sweep, runtime console and network, assets and dependencies,
privacy, and lint/tsc/build. Result: PASS WITH NOTES.

Two fixes. README no longer claims a `.env.local.example` is kept in the
repo (it is gitignored and untracked). The phone number is removed from
the repository on the owner's instruction: the never-rendered `Phone`
channel is dropped from src/data/profile.ts and the line from
Docs/User Input Session.txt; three comments that referred to it are
updated; rendered output is unchanged. Git history is not rewritten —
that is a separate decision.

Report in Docs/PHASE_6H_REPORT.md; development log updated.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
