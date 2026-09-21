# Phase 6G — Portfolio Content & Credibility Polish

Branch `main` · 2026-09-20 · on top of `6439cd4` · **at review gate, not committed**

---

## 1. Objective

Make the site read as production-ready to an AI/ML Engineer recruiter without
changing its visual identity: check that every page says who Alif Reezi is,
what he works in, and what the work shown is; make the metadata a crawler or
a share card sees say the same thing; and find anything stale, contradictory,
or placeholder left over from earlier phases.

Constraints held: no visual-system, token, route, dependency, or Lanyard
change; nothing invented — no metric, date, employer, certification, URL,
publication status, or experience; every owner-pending item still pending;
`profile.ts`, `projects.ts`, `research.ts` untouched.

---

## 2. What was reviewed

- `git status` / `git log`; `Docs/DEVELOPMENT_LOG.md`; the 6D, 6E, and 6F
  reports; `Docs/Detail.txt` (the owner-input source, gitignored) to check
  every rendered claim against what the owner actually wrote.
- All four data files and `types/index.ts`.
- Every route file under `src/app/`, the root layout, and the metadata each
  emits; every section and view component; header, mobile overlay, footer.
- README, `.env.local.example`, `public/`, `next.config.ts`.
- The Next 16.3.1 metadata reference in `node_modules/next/dist/docs/`
  (per `AGENTS.md`), and the merge behaviour in
  `next/dist/lib/metadata/resolve-metadata.js`, before writing any metadata.

### 2.1 Positioning — as found

The eight facts the brief lists are all present and consistent across the
data layer and the pages:

| Fact | Where it renders |
|---|---|
| Alif Reezi | Hero `h1`, wordmark, every `<title>`, About opener, footer |
| AI/ML Engineer | `profile.roles[0]` and `profile.positioning` → Hero lead, About opener; `site.title` (fixed, see §3) |
| Computer Vision · Machine Learning · Deep Learning · Research | `profile.focusAreas` → Hero colophon; About Background (added, see §3) |
| Fresh Graduate | `profile.status` → Hero eyebrow, About eyebrow and opener |
| Biomedical Engineering | `profile.education` → Hero colophon, About Background and opener, site index, root description |

None of the generic phrases the brief warns against ("passionate about",
"cutting-edge", "transforming the future", and the like) appear anywhere in
`src/` or in the owner's copy.

### 2.2 Hero — as found

Eyebrow (status) → name → full name → positioning line → career direction →
availability → two CTAs → colophon (location, education, focus, email). A
visitor gets who, what field, and where to go next without scrolling. The
mission statement is still owner-pending (five options, Phase 5D-1) and the
Hero is left exactly as it was. **No change.**

### 2.3 Projects — as found

Both case studies already carry problem/context, what was built, approach,
stack, dataset, and links, all from `projects.ts`:

- **ThoraxVision** — context, problem, six approach steps, three stack
  groups, dataset (4,784 images, two classes), Live link, two related
  papers. `outcome: null` (Detail.txt item 10 unanswered — pending).
  Percentage results hidden per the 2026-09-19 owner decision;
  `SHOW_MODEL_RESULTS` still `false`, `models` byte-identical.
- **MelonVision AI** — context, the owner's purpose statement, six approach
  steps, the owner's CCA/BFS achievement as Outcome, three stack groups,
  dataset, GitHub link. Timeline and year as two facts (6E candidate, left
  for the owner).

Role/contribution: not documented for either project as such. The only
documented statement of the owner's role is the author position on the two
ThoraxVision papers — now surfaced on the project page (§3).

### 2.4 Research — as found

Both entries carry title, full conference name, year, topic, author
position, repository link, and the ThoraxVision link. `status` is
`pending-confirmation` on both and the label says "Venue confirmed · details
to follow" — neither "submitted" nor "accepted" is claimed anywhere.
The `/research` page's `<meta description>` still said titles were withheld
(fixed, §3). Status-label rewording is a 6E candidate, left for the owner.

### 2.5 About — as found

Phase 6F copy untouched. One omission found and fixed (§3): the Hero shows
Focus, About did not, though its own header comment said it repeated
everything the Hero shows.

### 2.6 Contact / footer — as found

`alifalvareezi1@gmail.com` is the only address in `src/`, rendered from
`profile.contact[0]` in the Hero colophon, About, Contact, and the mobile
overlay. LinkedIn and GitHub URLs match `Docs/Detail.txt` ("CONTACT" block)
and render in Contact, footer, and the overlay. The phone number has
`primary: false` and every renderer filters on `primary`; the DOM audit
confirms it appears on no route at any width. **No change.**

### 2.7 SEO / metadata — as found

Per-route `<title>` (template) and `<meta description>` existed since 6D.
Nothing else: no Open Graph, no Twitter card, no canonical, no `robots.txt`,
no sitemap, no `authors`. `site.url` is `null`; `public/images/og/` is
empty. `site.title` used a hyphen where the template uses an em dash, and
said "AI Engineer" where every page says "AI / Machine Learning Engineer".

### 2.8 Content integrity — as found

Swept `src/`, `README.md`, `public/`, and the log for old slugs
(`tuberculosis-detection`, `melon-detection`), old project names, other
cities, other email addresses, placeholder text, fake URLs, invented
metrics, and stale phase terminology.

- `src/` — clean. The only "placeholder" hit is a comment saying a row
  renders nothing *rather than* a placeholder.
- `site.pending` — one stale line: "Footer copy — the current footer is an
  acknowledged placeholder." The real footer landed in Phase 5J.
- `README.md` — PRD-era and wrong on several counts: Motion for React,
  Lucide, React Bits "via shadcn CLI", Vercel auto-deploy, an eight-client-
  component target, folders that do not exist (`seo/`, `work/`,
  `project/`), an env var the app never reads, and a phase table ending at
  5F "next".
- `public/` — five create-next-app SVGs (`next.svg`, `vercel.svg`,
  `file.svg`, `globe.svg`, `window.svg`), referenced nowhere.
- `DEVELOPMENT_LOG.md` — §1 still described a one-page site with an
  owner-pending About statement and three client components (there are
  four since 6D); §4's tree still said "Tuberculosis + Melon"; §9 still
  listed the About copy as debt.
- Route-file comment in `research/[slug]/page.tsx` still said `title` was
  `null` on both entries.

---

## 3. What changed

### 3.1 Content

| Where | Before | After | Basis |
|---|---|---|---|
| `site.title` | `Alif Reezi - AI Engineer` | `Alif Reezi — AI / Machine Learning Engineer` | `profile.roles[0]`; the template's em dash |
| `site.description` | "AI engineer and Biomedical Engineering graduate building machine learning systems for medical imaging and edge AI deployment." | "AI / Machine Learning Engineer and Biomedical Engineering graduate working across computer vision, deep learning, and research — from medical imaging models to edge AI deployment." | role, degree, `focusAreas`, the two case studies' domains |
| `/research` description | "A register of confirmed conference venues. Paper titles, topics, and submission state are listed once they are settled." | "2 conference papers — ICWT 2026 and ICSMech 2026 — with title, topic, and author position for each. Submission state is recorded once it is settled." | composed from `research.ts`; falls back to the old "venues confirmed" wording if any entry lacks title, topic, or contribution |
| `/about` Background | Education · Studied at · Roles · Based in | + **Focus** row (`focusAreas.join(" · ")`, the Hero's join) | data already rendered on `/` |
| `/projects/thoraxvision` Related research | title links only | title link + `ICSMech 2026 · First author` / `ICWT 2026 · Second author` beneath, the same line `/about` prints | `research.ts` `contribution` |
| `site.pending` | 3 lines incl. the footer placeholder | 2 lines, each saying exactly what is blocked and what switches on when `url` is set | — |

Nothing was added to `profile.ts`, `projects.ts`, or `research.ts`. No
prose was rewritten on About, the Hero, or either case study.

### 3.2 Metadata

**`src/lib/metadata.ts`** (new) — `siteUrl(path)` returns an absolute URL
or `null` while `site.url` is `null`; `routeMetadata(path)` returns the
per-route `openGraph` (`type`, `siteName`, and `url` when a domain exists)
and `alternates.canonical` when a domain exists. Every route spreads it into
its `metadata`. Next replaces nested `openGraph` objects rather than merging
them, so the whole object is built in one place.

**Root layout** — adds `authors` and `creator` (`profile.fullName`),
`twitter.card: "summary"`, `metadataBase` when `site.url` is set, and the
`routeMetadata("/")` slice. `og:title`, `og:description`, `twitter:title`,
`twitter:description` are not set by hand: Next fills them from each route's
resolved title (template applied) and description, verified in the built
HTML for all nine routes. An explicit `robots: { index, follow }` was tried
and removed — Next injects `noindex` on the 404 route, and the two tags sat
side by side contradicting each other.

**`src/app/robots.ts`** (new) — `User-Agent: *` / `Allow: /`; the `Sitemap:`
line appears once `site.url` is set.

**`src/app/sitemap.ts`** (new) — every `SECTIONS` route plus one entry per
project and research slug; empty until `site.url` is set (a sitemap entry
must be absolute). No `lastModified`, `changeFrequency`, or `priority` — none
is documented.

**Not declared:** `og:image` / `twitter:image`. The image does not exist
(`public/images/og/` is empty). Documented as pending in `site.pending`
rather than pointed at a missing file.

**Domain switch-on, verified:** with `site.url` temporarily set to
`https://placeholder.invalid` and a throwaway build, `/about` and
`/projects/thoraxvision` emitted `<link rel="canonical">` and `og:url`,
`robots.txt` gained `Sitemap: …/sitemap.xml`, and `sitemap.xml` listed all
nine routes. Reverted to `null`; the committed build emits none of the four.

### 3.3 Housekeeping

- README: stack table, structure tree, architecture principles, env-var
  section, and phase table replaced with what is actually in the repo (the
  log's §4 is the authority; README now points there).
- Five unreferenced SVGs deleted from `public/`.
- `DEVELOPMENT_LOG.md` §1, §4, §8, §9 corrected; Phase 6G entry added.
- Comment in `research/[slug]/page.tsx` updated; About header comment
  updated to say Focus is now rendered.

---

## 4. Intentionally left unchanged

| Item | Why |
|---|---|
| Hero mission statement | Owner-pending since 5D-1; not chosen, not invented |
| `SHOW_MODEL_RESULTS = false`; all `models` figures | Owner decision 2026-09-19 |
| ThoraxVision `outcome: null` | Detail.txt item 10 unanswered |
| MelonVision Live link note, client name | Not approved / not answered |
| Research `status: pending-confirmation` and its label | Nothing confirms submission or acceptance; label rewording is a 6E candidate for the owner |
| MelonVision Timeline + Year as two facts; dataset "not documented" notes | 6E subjective candidates, awaiting the owner |
| 404 page `<title>` (carries the root title) | Needs the experimental `global-not-found`; out of scope (6E) |
| Phase 6F About copy | Approved; only the Focus row was added |
| Trajectory `Applied AI / Generative AI` | Owner-supplied (PRD); not contradicted by the About direction copy |
| `og:locale` | Not set — `<html lang="en">` already states the language; a region would be a guess |
| `.env.local.example` | Kept; README now says it is not read by the app |
| Lanyard, `globals.css`, `next.config.ts`, `package.json` | Untouched |

---

## 5. Files changed

```
src/lib/metadata.ts                          new — siteUrl(), routeMetadata()
src/app/robots.ts                            new
src/app/sitemap.ts                           new
src/app/layout.tsx                           authors, creator, twitter card, metadataBase (when url), routeMetadata("/")
src/app/about/page.tsx                       routeMetadata
src/app/contact/page.tsx                     routeMetadata
src/app/projects/page.tsx                    routeMetadata
src/app/projects/[slug]/page.tsx             routeMetadata
src/app/research/page.tsx                    description composed from research.ts; routeMetadata
src/app/research/[slug]/page.tsx             routeMetadata; stale comment
src/components/sections/about.tsx            Focus row in Background; header comment
src/components/projects/project-detail.tsx   venue · year · author position under each related paper
src/data/site.ts                             title, description, pending; header comment
README.md                                    stack, tree, principles, env, phases
public/{next,vercel,file,globe,window}.svg   deleted
Docs/DEVELOPMENT_LOG.md                      §1, §3 (6G entry), §4, §8, §9
Docs/PHASE_6G_REPORT.md                      this file
```

Not touched: `profile.ts`, `projects.ts`, `research.ts`, `types/index.ts`,
everything under `components/lanyard/`, `globals.css`, `next.config.ts`,
`package.json`, `hero.tsx`, `contact.tsx`, `site-footer.tsx`,
`mobile-nav.tsx`, `research-log.tsx`, `research-detail.tsx`,
`selected-work.tsx`, `site-index.tsx`.

---

## 6. Verification

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npx tsc --noEmit` | clean |
| `npm run build` | 14 static pages (9 routes + 404 + robots + sitemap), no warnings, no `metadataBase` notice |
| Head metadata, all 9 routes + 404 (curl against `next start`) | per-route `<title>` with template, description, `author`, `creator`, `og:title` = tab title, `og:description` = page description, `og:site_name`, `og:type`, `twitter:card/title/description`; no `og:url`, no canonical, no `og:image` (as intended while `url` is null); 404 carries Next's `noindex` alone |
| `/robots.txt` | `User-Agent: *` / `Allow: /` |
| `/sitemap.xml` | well-formed, empty urlset (fills on `site.url`) |
| Domain switch-on (throwaway build, reverted) | canonical + `og:url` on every route, `Sitemap:` line, 9 `<loc>` entries |
| Headless Chrome (CDP), 9 routes × 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 | `scrollWidth == clientWidth` on all 63 renders — 0 horizontal overflow |
| Heading hierarchy | one `h1` per route; outlines `1 2` (home), `1 2 2` (projects), `1 2×6` (case study), `1 2 2 2` (research, contact), `1 2 2 2 2` (entry), `1 2 2 2 3 2 3 2 2` (about); no skipped level |
| Focusables | 0 unnamed on any route/width; `main#top` landmark on every route |
| Target size | 0 focusables under 24px, with one inline exception: the "Research log" link inside a sentence on `/about` measures 21px on the lines where it does not wrap (375–430, 1024). It is an inline text link and pre-dates this phase (6F); WCAG 2.5.8 exempts inline links in running text |
| Empty blocks | 0 (`section`/`ul`/`ol`/`dl` with no text) |
| Phone number | absent from the DOM on every route and width |
| Email | `alifalvareezi1@gmail.com` is the only address in the DOM; present on `/`, `/about`, `/contact` |
| Keyboard (real Tab key events via CDP) on `/about`, `/projects/thoraxvision`, `/research` | 22 / 20 / 17 stops; every stop visible, named, and with a focus outline; order is document order (skip link → header → main → footer) |
| Console | 0 errors. Three pre-existing warnings on `/` only, all from the Lanyard: `THREE.Clock` deprecation, Rapier "deprecated parameters for the initialization function", a WebGL shader-precision info log. None on the other eight routes |

Browser verification was by headless Chrome over the DevTools Protocol
(no extension); screenshots were not taken. Widths were emulated with
`Emulation.setDeviceMetricsOverride`.

---

## 7. Remaining owner-pending items

Unchanged by this phase; consolidated from `site.pending`, `profile.pending`,
`projects[].pending`, `research[].pending`, and the 6E §7 candidates.

**Blocking launch**
- Production domain → `site.url`. Everything downstream is wired.
- Open Graph / share image → `public/images/og/`, then declare it in the
  root layout (`openGraph.images`, `twitter.images`, card `summary_large_image`).

**Profile**
- Hero mission statement (five options, 5D-1).
- Graduation year.
- Work experience entries.

**ThoraxVision**
- What to highlight (Detail.txt item 10) → `outcome`.
- Project dates; GitHub repository (not public).
- ResNet50 accuracy; specificity for all three models; the VGG19
  Tuberculosis F1 (source lists 0.5745 for both classes).
- Whether and when to show the percentage tables (`SHOW_MODEL_RESULTS`).
- Lessons-learned copy.

**MelonVision AI**
- Whether the client may be named.
- Whether the live deployment may be linked.
- Lessons-learned copy. (No evaluation figures exist — owner confirmed.)

**Research, both entries**
- Submission state (submitted / accepted / presented).
- Conference host and location; co-authors; paper / DOI / presentation link.

**Subjective candidates (6E §7), still open**
- Status label "Venue confirmed · details to follow" → "… submission state
  to follow".
- MelonVision Timeline + Year composed as one fact.
- Dataset "not documented" notes moved off the page into `pending`.
- 404 `<title>` via `global-not-found`.

**Repository**
- Delete the two fully merged side branches.

---

## 8. Proposed commit message

```
feat: content and credibility polish — share/crawl metadata, research description, stale-copy sweep (Phase 6G)

Make every route say the same thing to a reader, a crawler, and a share
card, and remove what had gone stale since the site became multi-page.

Metadata: new lib/metadata.ts (siteUrl, routeMetadata) spread into every
route, so og:type, og:site_name, and — once site.url is set — canonical
and og:url are emitted per page. Root layout adds authors, creator, and a
summary Twitter card; og:title/description follow each route's own title
and description. New robots.ts (allow-all) and sitemap.ts (every route and
slug), both keyed on site.url. No og:image: none exists yet.

Content: site.title uses the template's em dash and the full role;
site.description names the focus areas; /research's description no longer
withholds titles it lists; /about gains the Focus row the Hero already
shows; the project page's related papers carry venue, year, and author
position. No data file changed; every owner-pending item stays pending.

Housekeeping: stale footer-placeholder line dropped from site.pending;
README rewritten to match the repo; five unreferenced create-next-app
SVGs removed; development log corrected.

Verified: lint, tsc, build; head metadata on all routes; headless Chrome
over 9 routes × 7 widths with 0 overflow, one h1 per route, 0 unnamed
focusables, phone absent; Tab walk on the changed pages; console clean
apart from the Lanyard's pre-existing notices. Report in
Docs/PHASE_6G_REPORT.md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
