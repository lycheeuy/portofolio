# Phase 6E — Content & Case Study Refinement

Branch `main` · 2026-09-19 · on top of `c0f65c3`

---

## 1. Objective

Bring the case studies and research entries up to what the owner has actually
supplied, without inventing anything: ingest the confirmed facts from
`Docs/Detail.txt` item by item, keep every gap a gap, correct the documentation
statements that the 2026-09-19 merge made stale, and review the detail pages
for concrete presentation defects — fixing only those.

Constraints held throughout: multi-page architecture unchanged, Lanyard
untouched, no dependency added, no redesign, `SHOW_MODEL_RESULTS` stays
`false`, the metric values in `projects.ts` stay byte-identical.

---

## 2. Starting state

- `main` at `a6b45ad`, in sync with `origin/main`, working tree clean, no
  stash. Nothing leftover from an earlier session.
- Phase 6D (`ea35364`) and the five owner decisions (`2eed9a8`) merged in
  `2a8b959`; `Docs/Detail.txt` gitignored.
- `DEVELOPMENT_LOG.md` still said in six places that the branch was unmerged
  or 6C/6D uncommitted. `PHASE_6D_REPORT.md` §9.3 / §10 said the same, as a
  dated snapshot.
- Data layer: both research entries venue-only (`title`, `conference.name`,
  `topic`, `contribution`, `projectSlug`, `links` all empty); MelonVision AI
  with `year: null`, a `null` GitHub link, and a generic `Model` stack group.
- Baseline review of the built site (9 routes + 2 404s × 7 widths, headless
  Chrome over CDP): 0 overflow, 1 `h1` per page, 0 empty blocks, 0 console
  errors. No concrete presentation defect to fix before content changed.

---

## 3. Documentation updates

Committed separately as `c0f65c3`, before any content change:

| File | Change |
|---|---|
| `DEVELOPMENT_LOG.md` header | `Last updated` → 2026-09-19 |
| §3 commit history | `2eed9a8`, `2a8b959`, `a6b45ad` added |
| §3 status line | "still not merged" → merged `--no-ff` as `2a8b959`, main/origin in sync, both side branches deletable |
| Phase 5D-3 entry | "merging … still outstanding" → merged 2026-09-19 |
| 6B "Remaining" bullet | struck through, "Resolved 2026-09-19" |
| §9 "Immediate" and "Blocking" bullets | struck through with the merge hash |
| `PHASE_6D_REPORT.md` | one status note under the title; §9/§10 left as the dated record |

Historical passages were annotated, not rewritten.

---

## 4. Content changes

Every item below was put to the owner individually before ingestion; nothing
from `Detail.txt` went in unasked. The owner's four answers are recorded in §5
and §6. Items the owner did **not** select stay as they were.

The two prose fields for MelonVision AI are English renderings of the owner's
Indonesian answers (Detail.txt, Melon §8 and §9). They are shown in full in
§5 so the exact wording is on record.

---

## 5. Project changes

### ThoraxVision — `/projects/thoraxvision`

No content change. Live link `https://thoraxvision.site/` preserved (resolves
200). `SHOW_MODEL_RESULTS` unchanged at `false`; `models` unchanged.

- `outcome: null` added (new field, see §8). Nothing to put in it —
  Detail.txt item 10 ("what to highlight") is unanswered, so that gap is now
  a `pending` line.
- **Related research** now renders (both papers set `projectSlug:
  "thoraxvision"`), listing the two titles as links. No code change; the block
  existed since 6D and was waiting for data.

### MelonVision AI — `/projects/melonvision-ai`

Owner approved: repository URL, year, architecture, purpose, achievement.
Owner did **not** approve the Live-link note change — the existing note
("Deployed on the client's VPS; not published as a public URL") stands.

| Field | Before | After |
|---|---|---|
| `year` | `null` | `2026` — renders as a fourth fact in the colophon strip |
| `links[GitHub].href` | `null` | `https://github.com/lycheeuy/MelonVision_AI` (resolves 200) |
| `stack[Model].items` | `TensorFlow Lite`, `AI inference` | `MobileNetV2 FOMO`, `INT8 quantised`, `TensorFlow Lite` — the generic "AI inference" tag replaced by the stated architecture |
| `problem` | connective paragraph written in 5E | owner's purpose, rendered: *"MelonVision AI was built to help melon farmers identify the condition of their plants automatically, using an IoT camera and AI in place of manual inspection that needs specialist expertise. The system allows remote monitoring through a web dashboard, so pruning decisions can be made faster and more consistently without having to be in the field."* |
| `outcome` | — | owner's achievement, rendered: *"Finding and fixing a critical bug in the FOMO decoder that made a single object produce dozens of bounding boxes at once — in one case, 144 false detections from one image. The fix was to implement Connected Component Analysis from scratch, using a breadth-first search with 8-connectivity. That changed how the system understands "one object": from one grid cell = one detection, to a cluster of neighbouring cells = one detection with an accurate bounding rectangle."* |
| `pending` | 7 lines | 4 — year, repository URL, and architecture removed; "no evaluation figures" reworded to cite the owner's confirmation (Melon §6: *tidak ada*) |

`summary`, `approach`, `dataset`, `timeline`, `context` unchanged.

---

## 6. Research changes

Owner approved all four groups: titles + full conference names + topics;
author positions; repository URLs; link both papers to ThoraxVision. Owner
kept `status: "pending-confirmation"` — nothing in Detail.txt states
submission or acceptance, and it was not inferred.

| Field | ICWT 2026 | ICSMech 2026 |
|---|---|---|
| `title` | The VGG19 and DenseNet121 Model Comparison for the Chest X-Ray Based Tuberculosis Detection on Local Dataset | Application of CNN Model for Early Detection of Tuberculosis in Chest X-ray Images |
| `conference.name` | The 12th International Conference on Wireless and Telematics | The 2nd International Conference on Smart Mechatronics |
| `topic` | verbatim from Detail.txt | verbatim from Detail.txt |
| `contribution` | Second author (*Penulis 2*) | First author (*Penulis 1*) |
| `projectSlug` | `thoraxvision` | `thoraxvision` |
| `links` | Repository → `github.com/lycheeuy/my_research/tree/main/ICWT2026` | Repository → `…/ICSMech2026` |
| `status` | `pending-confirmation` (unchanged) | `pending-confirmation` (unchanged) |
| `pending` | 7 → 4 lines | 7 → 4 lines |

Two normalisations, both noted in the file header: Detail.txt's "Wireeless" is
corrected to "Wireless", and the trailing "2026" is dropped from the ICWT
conference name because `conference.year` already carries it and the UI
composes "acronym · name · year" — keeping it would have printed the year
twice.

Both repository URLs resolve (HTTP 200, checked 2026-09-19).

**Effect on the pages, with no markup change:** `/research` shows the titles
as headings, the venue line beneath, and the topic; each `/research/[slug]`
now has Topic, Contribution, Based on → ThoraxVision, and Links → Repository;
the venue-only note no longer fires on either. The research→project
relationship is now visible in both directions.

---

## 7. UI/UX changes

Review-and-fix only. Screened before and after the content change at 1440,
1280, 1024, 768, 430, 390, 375 by DOM geometry; screenshots read at 375 and
1440 for the four changed pages.

**Changes made, each with the reason it was necessary:**

1. **`ProjectDetail` — Outcome block.** A new `outcome` field needs a place
   to render or the ingested text is invisible. Rendered as an `h2` peer of
   Problem/Approach in the left column, using the existing `blockHeading` and
   `bodyText` strings; conditional on the field, so ThoraxVision shows nothing.
2. **`ResearchLog` standfirst.** It said *"Paper titles, topics, and
   submission state are listed here once they are settled, not before"* —
   directly above a list of paper titles and topics. Now branches on
   `ANY_VENUE_ONLY`: the original sentence while any entry is venue-only, and
   *"Submission state is recorded here once it is settled, not before"* once
   every entry has a title. A contradiction between copy and data is a
   concrete defect, not a restyle.
3. **Stale doc comments** in `research-detail.tsx`, `research-log.tsx`, and
   `project-detail.tsx` that described both entries as venue-only and the
   related-research list as always empty. Comments only.

**Not changed — no defect found:** hierarchy (one `h1`, `h2` blocks in
reading order on every route), metadata (title template, per-route
descriptions), mobile reading (no overflow at 375; long research titles wrap
inside `max-w-[26ch]` / `break-words`; the Related-research links stack on
their own rows at every width), empty blocks (none — every optional block is
conditional), keyboard path (skip link first, 2px focus ring, every focusable
named, no invisible focus target, no sub-24px target).

**Subjective candidates — listed, not applied, awaiting the owner:**

- The `pending-confirmation` label reads *"Venue confirmed · details to
  follow"*. With title and topic now shown, "details" is vaguer than it was;
  *"Venue confirmed · submission state to follow"* would be more exact.
- MelonVision's colophon strip shows `Timeline 20 – 30 June` and `Year 2026`
  as two facts. Composing them into one (`20 – 30 June 2026`) would read more
  naturally but changes how `timeline` and `year` are modelled.
- Dataset notes (*"Class distribution is not documented"*, *"Class breakdown
  is not documented"*) are honest but read as an internal remark on a public
  page. They could move to `pending` and off the page.
- The 404 page carries the root `<title>` ("Alif Reezi - AI Engineer"). Next
  supports `metadata` only on the experimental `global-not-found.js`, which
  replaces the root document — out of scope for a content phase. Next already
  injects `noindex` on 404 responses.

---

## 8. Files changed

**Commit 1 — `c0f65c3` docs only**

```
Docs/DEVELOPMENT_LOG.md
Docs/PHASE_6D_REPORT.md
```

**Commit 2 — content**

```
src/types/index.ts                            Project.outcome: string | null
src/data/projects.ts                          MelonVision facts + prose; ThoraxVision outcome null + pending line; header
src/data/research.ts                          both entries filled per §6; header rewritten
src/components/projects/project-detail.tsx    Outcome block; comment
src/components/research/research-detail.tsx   comment
src/components/sections/research-log.tsx      ANY_VENUE_ONLY standfirst; comments
Docs/PHASE_6E_REPORT.md                       this file
Docs/DEVELOPMENT_LOG.md                       Phase 6E entry; §8 pending list; §9 next phase
```

Not touched: every file under `components/lanyard/`, `globals.css`,
`next.config.ts`, `package.json`, `site.ts`, `profile.ts`, every route file
under `src/app/`, `status.ts`, `selected-work.tsx`.

---

## 9. Verification results

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 — 12/12 static pages; `/projects/{thoraxvision,melonvision-ai}` and `/research/{icwt-2026,icsmech-2026}` SSG |

**Routes** (served from `next start`, headless Chrome over CDP, after a stale
server on the port was found and killed — the first pass had silently
measured the previous build):

| Route | `<h1>` | Headings | Title |
|---|---|---|---|
| `/` | 1 | 1 2 | Alif Reezi - AI Engineer |
| `/projects` | 1 | 1 2 2 | Selected work — Alif Reezi |
| `/projects/thoraxvision` | 1 | 1 2×6 | ThoraxVision — Alif Reezi |
| `/projects/melonvision-ai` | 1 | 1 2×6 | MelonVision AI — Alif Reezi |
| `/research` | 1 | 1 2 2 2 | Research log — Alif Reezi |
| `/research/icwt-2026` | 1 | 1 2 2 2 2 | *paper title* — Alif Reezi |
| `/research/icsmech-2026` | 1 | 1 2 2 2 2 | *paper title* — Alif Reezi |
| `/about` | 1 | 1 2 2 | About — Alif Reezi |
| `/contact` | 1 | 1 2 2 2 | Contact — Alif Reezi |
| `/projects/tuberculosis-detection`, `/projects/melon-detection`, `/research/nope`, `/nope` | 1 | 1 | HTTP 404, styled page inside the layout |

**Responsive — 11 routes × 7 widths (1440, 1280, 1024, 768, 430, 390, 375)
= 77 combinations, 0 with `scrollWidth > clientWidth`, 0 empty blocks.**

**Keyboard — 5 changed pages:** first Tab reaches the skip link with a
`solid 2px` outline; 17–20 focusables per page, 0 unnamed, every Tab lands on
a visible element, 0 targets under 24px. Desktop nav marks `Projects` current
on a project page and `Research` on a research page. Every `target="_blank"`
link carries `rel="noopener noreferrer"`.

**Link crawl:** every internal `href` in the build (9 routes + static assets)
returns 200. The only hash link is `#top` (skip link).

**Console:** no errors on any route. `/` still logs the pre-existing Three.js
deprecation notices from the Lanyard (unchanged, out of scope).

**Data integrity:** the `models` arrays and every metric value are
byte-identical to `2eed9a8`; `0.7075` does not appear in the built HTML or
RSC payload of the ThoraxVision page.

---

## 10. Remaining missing / owner-pending data

Recorded as `pending` arrays in code; consolidated here.

**ThoraxVision:** project dates; GitHub repository (Detail.txt: *belum open
publik* — not public); paper link once a research entry is confirmed;
ResNet50 accuracy; specificity for all three models; the contradictory VGG19
Tuberculosis F1; what the owner wants highlighted (Detail.txt item 10,
unanswered); lessons-learned copy.

**MelonVision AI:** whether the client may be named; evaluation figures (owner
confirms none exist); whether the live deployment may be linked or shown
(Detail.txt says not deployed to hosting; the owner did not approve changing
the current note); lessons-learned copy.

**Research, both entries:** conference host and location; submission state;
co-authors; paper / DOI / presentation link.

**Still in `Detail.txt`, not raised in this phase because it is About-page
content, not case-study content:** the long-form "about me" answers (six
Indonesian sections). `profile.pending` still lists the personal copy as
outstanding, and About's authored paragraphs still stand in for it.

**Profile:** graduation year and institution; work experience; hero mission
statement (five options owner-pending since 5D-1).

**Site:** production domain (Detail.txt: *belum beli domain*) — `site.url`
stays `null`, so canonical, sitemap, robots, and Open Graph remain unset;
Open Graph image; footer copy.

---

## 11. Recommended next phase

**Phase 6F — About page content.** The one remaining block of owner-supplied
material is the six-section "about me" text. Ingesting it means translating
and placing it, so it needs the same item-by-item approval this phase used,
plus a decision on whether it replaces About's authored paragraphs or joins
them. Everything else on the site now reads from confirmed data.

Also decide the four subjective candidates in §7, and whether to delete the
two fully merged side branches.

Nothing in this phase is blocked. Not pushed — awaiting confirmation.
