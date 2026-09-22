# Owner Data Finalization — Final Portfolio Content

Branch `main` · 2026-09-21 · on top of `60ecd70` (Phase 6H) · **at review gate, not committed**

---

## 1. Owner decisions applied

Every item below was supplied by the owner in the finalization brief. Nothing
outside that brief was added; where the brief left something unsupplied
(the ICWT paper URL, conference host/location, the OG image, the domain) it
stays absent and is listed in §11. The ICSMech paper URL was confirmed the
following day (2026-09-22) and is applied below.

| Area | Decision | Applied as |
|---|---|---|
| Hero | Mission statement, exact wording | `profile.mission`; Fraunces italic line between positioning and career direction — the slot 5D-1 reserved |
| Profile | Degree "Bachelor of Biomedical Engineering" | `education.degree`; Hero and About print it alone (it names the field), `field` kept for sentences |
| Profile | Graduation year 2026 | `education.graduationYear`; Hero colophon "…, 2026", About note "Completed · 2026" |
| Profile | Location "Cirebon, West Java, Indonesia" | `profile.location` (was "Kota Cirebon, …") |
| Profile | Career direction first step "AI/ML Engineer" | `trajectory[0]` = "AI / ML Engineer" (site spacing convention, as in `availability`) |
| Profile | LinkedIn `https://linkedin.com/in/nashiruddinalifalvareezi/` | `contact[LinkedIn].href` exactly as given (was the `www.` form; both resolve) |
| Profile | No formal employment; use "Independent Projects" | `profile.experience = "Independent projects"`; rendered as an About Background row. No employer, title, or period anywhere |
| Profile | Phone: never render | Already removed in 6H; still absent (verified on 63 renders) |
| ThoraxVision | Public GitHub | `links[GitHub]` = `https://github.com/lycheeuy/thoraxvision` (the owner's `.git` clone URL 301-redirects there; same repository) |
| ThoraxVision | Live site | unchanged, `https://thoraxvision.site/` |
| ThoraxVision | No project dates | `year`/`timeline` stay `null`; the dates line removed from `pending` (decided, not pending) |
| ThoraxVision | Metrics hidden | `SHOW_MODEL_RESULTS` stays `false`; `models` data untouched; no figure in any rendered page |
| ThoraxVision | Outcome, exact wording | `outcome` — screening *research*, web interface for inference; no clinical claim |
| ThoraxVision | Lessons learned | `lessons`: four paragraphs, each tied to a recorded step (imbalanced two-class evaluation; preprocessing/augmentation as part of the experiment; the three-backbone comparison under one protocol; training vs. serving) |
| MelonVision AI | Client not named; no live URL | unchanged; `Live` stays `href: null` (renders nothing) |
| MelonVision AI | Lessons learned | `lessons`: four paragraphs (camera → device → API → DB workflow; model output ≠ detection; the FOMO decoder bug and the CCA / BFS 8-connectivity fix; debugging the whole inference path) |
| Research 1 | ICSMech paper: Published · IEEE Xplore · 2026 | `status: "published"`, `platform: "IEEE Xplore"` |
| Research 2 | ICWT paper: In publication process · IEEE · 2026 | new `ResearchStatus` value `in-publication`, label "In publication process"; `platform: "IEEE"`; not settled (grey marker), never "Accepted" |
| Research | Co-authors not displayed | nothing rendered; "Co-authors" dropped from `pending` |
| Research 1 | Paper URL confirmed 2026-09-22: `https://ieeexplore.ieee.org/document/11647113` | `links[Paper]` on the ICSMech entry, ahead of its repository; rendered on `/research/icsmech-2026` only |
| Research 2 | No public paper/DOI URL yet | ICWT entry links its repository only; the paper link stays in its `pending` |
| 6E-A | Paper-specific status | `statusLine()` composes "label · platform · year"; the vague label retired |
| 6E-B | Keep Timeline + Year separate | unchanged |
| 6E-C | No "not documented" notes in UI | ThoraxVision note → "Binary classification."; MelonVision note removed; both gaps moved to `pending` |
| 6E-D | 404 title | untouched |
| OG / domain | Not in this phase | `site.url` stays `null`; no `og:image`, canonical, `og:url`, or sitemap host |

---

## 2. Profile changes (`src/data/profile.ts`)

- `location`: "Kota Cirebon, West Java, Indonesia" → "Cirebon, West Java, Indonesia".
- `mission` (new): the approved sentence.
- `experience` (new): "Independent projects".
- `trajectory[0]`: "AI Engineer" → "AI / ML Engineer".
- `education.degree`: "Bachelor's degree (S1)" → "Bachelor of Biomedical Engineering"; `graduationYear: 2026` (new).
- `contact[LinkedIn].href`: `www.` dropped.
- `pending`: `[]` — mission and graduation year supplied; employment confirmed non-existent.

`displayName`, `fullName`, `status`, `positioning`, `roles`, `focusAreas`,
`availability`, `capabilities`, email, GitHub, and the Phase 6F `about`
copy are unchanged.

## 3. Hero changes (`hero.tsx`)

- New `<p data-hero-mission>` after the positioning paragraph, conditional on
  `profile.mission`: `font-display italic`, `--text-body-lg`, 38ch measure,
  ink. Existing tokens only; no new colour, size, or spacing value.
- Education colophon value: `degree` + ", " + `graduationYear` →
  "Bachelor of Biomedical Engineering, 2026" (was "Biomedical Engineering —
  Bachelor's degree (S1)").
- Hierarchy, CTAs, Lanyard zone, and the rest of the colophon unchanged.

## 4. Independent-project positioning (`about.tsx`)

- Background gains an **Experience** row: "Independent projects", rendered
  only when `profile.experience` is set. It sits between Roles and Focus.
- Block 04 already lists both projects and both papers by name as the
  evidence; no employment-style entry, employer, title, or period exists.
- Education row: value `degree`, note "Completed · 2026".
- Header comment updated (Cirebon; the experience decision).

## 5. ThoraxVision changes (`projects.ts`, `project-detail.tsx`)

- `outcome` set (was `null`), so the Outcome block now renders.
- `lessons` added; `ProjectDetail` gains a **Lessons learned** block after
  Outcome, one paragraph per lesson, conditional on the list.
- `links`: GitHub added beside Live.
- `dataset.note`: "Binary classification." (the "class distribution is not
  documented" clause moved to `pending`).
- `pending`: dates, repository, "what to highlight", and lessons removed as
  decided/supplied; paper-link, class-distribution, and the three metric gaps
  remain.

## 6. MelonVision changes (`projects.ts`)

- `lessons` added (renders through the same block).
- `dataset.note` removed; gap in `pending`.
- `pending`: client-name and live-link questions removed as decided; the
  no-evaluation-figures note and the dataset gap remain.
- `links[Live]` unchanged: `href: null` with its note — data only, the page
  renders no row for it (verified: no "VPS" string in any rendered page).

## 7. Research changes (`research.ts`, `types`, `status.ts`, log, detail, page)

- `ResearchStatus` gains `"in-publication"`; `ResearchEntry` gains
  `platform: string | null`.
- ICSMech 2026: `published` / "IEEE Xplore"; `links` = Paper
  (`https://ieeexplore.ieee.org/document/11647113`, confirmed 2026-09-22)
  then Repository; `pending` = host/location only. ICWT 2026:
  `in-publication` / "IEEE"; `links` = Repository only; `pending` =
  host/location and the paper / DOI link once published.
- `status.ts`: `STATUS_LABEL["in-publication"] = "In publication process"`;
  `pending-confirmation` reworded to the 6E-exact "Venue confirmed ·
  submission state to follow" (no entry uses it now); new `statusLine(entry)`
  → "Published · IEEE Xplore · 2026" / "In publication process · IEEE ·
  2026"; new `statusSummary(entries)` → "1 in publication process · 1
  published".
- Research index: status column prints `statusLine`; eyebrow "2 papers" (was
  "2 venues"); standfirst "2 conference papers for 2026: 1 in publication
  process · 1 published." (was "…venues are confirmed… Submission state is
  recorded here once it is settled").
- Research detail: status line prints `statusLine`.
- `/research` description: "…with title, topic, and author position for
  each: 1 in publication process · 1 published."
- Home site index row: "2 conference papers" (was "2 venues confirmed").
- Entry order unchanged (ICWT `01`, ICSMech `02`) — the brief numbered them
  the other way round but did not ask for a reorder; see §11.

## 8. 6E subjective decisions applied

A — applied (§7). B — kept as two facts, unchanged. C — applied (§5, §6).
D — untouched.

## 9. Content integrity audit

Searched `src/`, `README.md`, and the rendered HTML of all nine routes.

| Check | Result |
|---|---|
| Old email | absent |
| Old project names / slugs | absent |
| Old location "Kota Cirebon" | absent from `src/` and pages (one comment in `profile.ts` records the change) |
| "studied in Cirebon" / "lives in Purwokerto" | no such string; About prints "from Telkom University Purwokerto, now based in Cirebon, West Java, Indonesia" |
| Invented employment | none; the only experience string is "Independent projects" |
| Publication status | "Published" only on ICSMech; "Accepted" appears nowhere |
| MelonVision client name / VPS note | absent from every rendered page |
| ThoraxVision metrics | no percentage or ratio figure in any rendered page |
| Fake live URLs | none; the six external hrefs are the three contact links, two GitHub repos, the ThoraxVision live site, and the two research repos — all previously verified to resolve, plus the new ThoraxVision repo (200) |
| "not documented" / "details to follow" | absent from every rendered page |
| Phone / `tel:` | absent from every rendered page |
| `undefined` / `null` / `NaN` in rendered text | none |

## 10. Verification results

| Check | Result |
|---|---|
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0; 14 static pages; no warnings |
| Routes | all nine 200 from `next start`; robots and sitemap unchanged |
| Rendered content | every decision in §1 found in the built HTML of its page (mission, degree + year, trajectory, location, Experience row, both status lines, Outcome, both Lessons blocks, ThoraxVision GitHub + Live, MelonVision GitHub, contact hrefs) |
| Responsive | headless Chrome, 9 routes × 7 widths (375–1440): 0 horizontal overflow on 63 renders; Hero with the mission line included |
| Accessibility | one `h1` per route; no skipped heading level (case study outline now `1 2×8` / `1 2×7` with the Lessons block); 0 unnamed focusables; 0 empty blocks; Tab walk on `/` (12 stops) and `/projects/thoraxvision` (21 stops, GitHub link included) all visible and ringed; mobile dialog opens/closes with focus return |
| Console / network | 0 exceptions, 0 failed requests, 0 hydration messages; the Lanyard's two pre-existing deprecation warnings on `/` only |
| Phone | absent on all 63 renders |

## 11. Remaining owner-pending items

- Production domain → `site.url`.
- Open Graph image (production preparation).
- Paper / DOI link for the ICWT 2026 paper once it is published (the
  ICSMech 2026 paper is linked).
- Conference host and location for both papers.
- ThoraxVision figures still blank in the source: ResNet50 accuracy,
  specificity ×3, VGG19 Tuberculosis F1 — data-layer only while
  `SHOW_MODEL_RESULTS` is `false`.
- Dataset class distribution (ThoraxVision) / breakdown (MelonVision) — not
  documented; kept off the page.
- Research entry order: the brief numbers the ICSMech (published, first
  author) paper first; the log still lists ICWT first. Left unchanged
  pending an explicit instruction.
- Whether to rewrite git history for the phone number (separate decision).
- Push `main`; delete the two fully merged side branches.

---

## Proposed commit message

```
content: apply the owner's final data decisions (Owner Data Finalization)

Profile: mission statement in the Hero's reserved line; degree wording
and graduation year; location "Cirebon, West Java, Indonesia"; first
career step "AI / ML Engineer"; LinkedIn URL as given; "Independent
projects" as the experience label (no formal employment exists);
profile.pending emptied.

ThoraxVision: public GitHub repository linked; owner-approved outcome;
lessons learned; dates stay undisplayed, model figures stay hidden.
MelonVision AI: lessons learned; client unnamed, no live URL.
Dataset "not documented" notes moved from the page to pending.

Research: ICSMech 2026 published on IEEE Xplore; ICWT 2026 in the
publication process with IEEE (new in-publication status, never
"accepted"); status lines composed as "label · platform · year";
research index, detail, description, and home index row read the
statuses from the data. The published ICSMech paper links to its IEEE
Xplore page; the ICWT paper has no public URL yet and none is invented.
Co-authors not displayed.

Types: Education.graduationYear, Profile.mission, Profile.experience,
Project.lessons, ResearchEntry.platform, ResearchStatus in-publication.
ProjectDetail gains a Lessons-learned block. No visual-system, Lanyard,
route, dependency, or metadata-origin change; site.url stays null.

Verified: lint, tsc, build; rendered HTML for every decision; headless
Chrome 9 routes × 7 widths, 0 overflow, one h1, clean console.
Report in Docs/OWNER_DATA_FINALIZATION_REPORT.md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
