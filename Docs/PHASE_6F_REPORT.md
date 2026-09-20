# Phase 6F — About & Personal Positioning

Branch `main` · 2026-09-20 · on top of `934fb15`

---

## 1. Objective

Turn `/about` from two authored paragraphs and a background list into a page
that says who Alif Reezi is, where he comes from, what he works with, what he
has built and published, where he is heading, and how to reach him — in his
own words where he has supplied them, from the data layer everywhere else,
and with nothing invented.

Constraints held: Lanyard, routes, navigation, metrics, dependencies
untouched; palette, type, spacing, and the one accent unchanged; every
personal claim traceable to `profile.ts` or `Docs/Detail.txt`.

---

## 2. Starting state

- `main` at `934fb15`, in sync with `origin/main`, working tree clean, no
  stash.
- `/about` rendered: the page opener; two **authored** statement paragraphs
  (every claim traceable, but the wording was Phase 5I's, not the owner's);
  a Background list (education, roles, location); the Model/Build/Deploy
  capability groups with a pointer to `/research`; an availability line and
  a Get-in-touch link. No institution, no career direction, no mention of the
  projects or papers by name, no email.
- `profile.pending` still listed the institution and the personal "now" copy
  as missing. `Docs/Detail.txt` (gitignored) held the owner's six-section
  "about me" answer in Indonesian, unraised since it arrived.
- Confirmed for this phase by the owner: institution Telkom University
  Purwokerto; focus Computer Vision · Machine Learning · Deep Learning ·
  Research; everything else already in the data.

---

## 3. Content decisions

**Owner copy is used, in first person.** The six answers are the owner's own
voice ("aku"), so the English keeps the first person. The previous authored
paragraphs were written in the third person specifically because the owner
had not supplied anything; that reason no longer applies, and they are
retired rather than kept beside copy that says the same things better.

**Translation stance.** Faithful and understated: no superlatives added, no
claims sharpened, sentence order kept. Two omissions, both editorial and
both noted in the source comment: the opening "Hai!" and the source's bold
markup. One idiom softened: *"menjadi sesuatu yang benar-benar bisa
digunakan"* is rendered "something that can genuinely be used" where it opens
and closes the copy,
not "truly" or "really", which would read as emphasis in English. The three
intermediate occurrences of *"bisa digunakan"* are varied ("usable", "someone
can actually use", "ready to use") so the refrain does not repeat in every
section; the meaning is unchanged.

**The English rendering, in full** (`profile.about`, `src/data/profile.ts`):

*interests* —
> Right now I am most interested in going deeper into AI engineering, machine learning, and computer vision. I want to understand better how AI is not just built as a model, but developed into a system that can genuinely be used.
>
> Lately I have also become interested in AI automation — how AI can help simplify work and turn workflows that used to be manual into something more automatic.

*background* —
> What first drew me in was how interesting it is to watch data being turned into something that helps people solve problems.
>
> From there I started learning machine learning and computer vision. My background in Biomedical Engineering made me even more interested in applying AI in the real world — one example being a project that detects disease from X-ray images.
>
> What I like most is the process: starting from data that is still messy, trying to build a model, evaluating the results, and finally turning that model into something usable.

*building* —
> I usually like building projects that combine AI with software development.
>
> To me, a project is interesting when it does not stop at training a model or at a notebook. I would rather take the model further, into an application or a system someone can actually use.
>
> I also like working on projects with a real problem to solve — computer vision, AI automation, or applications that bring AI together with a backend and a frontend.

*learning* —
> At the moment I am learning how to build AI/ML systems end to end.
>
> Alongside going deeper into machine learning and computer vision, I am also learning more about FastAPI, React/Next.js, REST APIs, databases, Docker, and deployment.
>
> I want to understand the whole process: building a model, connecting it to a backend, building an interface for people to use, and finally deploying it so it is ready to use.

*direction* —
> If asked where I want to go, I am most interested in becoming an AI Engineer or ML Engineer with a focus on computer vision.
>
> At the same time, I want to keep the research side in that journey. I like running experiments, comparing approaches, finding out why a model works or does not, and looking for ways to improve it.
>
> So if I had to describe it, I want to sit between research and engineering — understanding the technology deeply, but also being able to turn it into something real.

*approach* —
> What I find most interesting is that I like building things from scratch and finding out how everything works.
>
> I am not that interested in making something just so the project is finished. I usually want to know why something works, what could be improved, and how to make it more useful.
>
> I also like combining several fields in one project — AI as the brain, the backend as the connector, and the frontend as the way you interact with the system.
>
> In the end, an interesting project is not only about the final result. I enjoy the journey more: I have an idea, I try to build it, I run into a problem, I fix it — until it becomes something that can genuinely be used.

**The one sentence written for the page** is the Profile opener, composed
clause by clause from data — `displayName`, `fullName`, `roles[0]`,
`status`, `education.field`, `education.institution`, `location`:

> Alif Reezi — Nashiruddin Alif Alvareezi — is an AI / Machine Learning Engineer and a fresh graduate in Biomedical Engineering from Telkom University Purwokerto, now based in Kota Cirebon, West Java, Indonesia.

**Two places, kept apart.** *Studied at* and *Based in* are separate rows
under separate terms, and the opener says "from Telkom University Purwokerto,
now based in Kota Cirebon". Nowhere does the page say he studied in Cirebon
or lives in Purwokerto.

**Not written:** employment, companies, years of experience, clients,
undocumented achievements, titles never held, numbers, certifications.
Nothing in `profile.pending` was filled by inference.

---

## 4. About page changes

Six numbered blocks under the page `h1`, each a `section` with its own `h2`
in an index rail (`01 — PROFILE`), content in the eight columns to its right.

| # | Block | Content (all from the data layer unless noted) |
|---|---|---|
| 01 | Profile | the composed opener; `about.interests` |
| 02 | Background | Education (field — degree, *Completed*), **Studied at**, Roles, **Based in**; `about.background` |
| 03 | Capabilities | Model / Build / Deploy tag rows (unchanged); pointer to Research log (unchanged); `h3` *Learning now* → `about.learning` |
| 04 | Research / Building | `about.building`; *Selected work* — both projects by title + discipline, linked; *Research log* — both papers by title + venue · author position, linked; `h3` *How the work gets done* → `about.approach` |
| 05 | Direction | the `trajectory` ordered list, rendered as the Hero renders it; `about.direction` |
| 06 | Availability / Contact | availability with the accent dot; the email (found by `mailto:` scheme, as `contact.tsx` does); *Get in touch* → `/contact` |

Every `about.*` section renders only if it has paragraphs; every optional
fact (institution, contribution, email) renders only if present. No block
can show an empty frame.

The case studies and research entries are **not** duplicated — block 04
lists title, discipline/venue, and a link, and nothing else.

---

## 5. Data-layer changes

`src/types/index.ts`
- `Education.institution: string | null` — new.
- `AboutCopy` — new interface: six `string[]` paragraph lists (`interests`,
  `background`, `building`, `learning`, `direction`, `approach`); an empty
  list means "not supplied".
- `Profile.about: AboutCopy` — new.

`src/data/profile.ts`
- `education.institution: "Telkom University Purwokerto"` — confirmed by the
  owner.
- `focusAreas` → `Computer Vision · Machine Learning · Deep Learning ·
  Research` (was `AI / ML Engineering · Computer Vision · Research`).
  **This also changes the Hero's Focus colophon line** on `/`, which reads
  the same field — intended: one source, and the owner confirmed the list.
- `about` — the six sections above.
- `pending`: "Graduation year and institution name" → "Graduation year";
  the "Personal / 'now' copy" line removed. Hero mission statement and work
  experience remain.
- Header comment: sources extended; the two-places note added.

Not touched: `projects.ts`, `research.ts`, `site.ts`, every metric.

---

## 6. UI/UX changes

- **New page structure**, built only from existing primitives: `Section`,
  `SectionHeader`, `metaLabel`, `monoMeta`, `bodyText`, `leadText`,
  `smallText`, `tag`, `accentDot`, `ActionLink`, `next/link`, and the
  12-column grid. No new token, colour, radius, shadow, card, gradient, or
  animation. The block rail is the Capabilities row's `lg:col-span-3` /
  content split from before, applied uniformly.
- **Hierarchy:** `h1` About → `h2` ×6, with an `h3` inside Capabilities
  (*Learning now*) and one inside Research / Building (*How the work gets
  done*). Measured outline `1 2 2 2 3 2 3 2 2`; no skipped level.
- **Measure:** opener at 52ch (`leadText`, matching the Research
  standfirst); running copy at 58ch (`bodyText`, the case-study measure).
- **Targets:** every link is ≥ 44px tall (`inline-flex min-h-11`), including
  the email and the project/paper links.
- **Mobile:** blocks stack rail-over-content; the Background `dl` goes to one
  column; the trajectory list wraps; nothing overflows at 375.

Nothing else on the site changed visually except the Hero's Focus line (§5).

---

## 7. Files changed

```
src/types/index.ts                   Education.institution; AboutCopy; Profile.about
src/data/profile.ts                  institution; focusAreas; about; pending; header
src/components/sections/about.tsx    rebuilt on the six-block structure
Docs/PHASE_6F_REPORT.md              this file
Docs/DEVELOPMENT_LOG.md              Phase 6F entry; §8 pending; §9 next phase
```

Not touched: `components/lanyard/*`, every route file, `site.ts`,
`projects.ts`, `research.ts`, `globals.css`, `next.config.ts`,
`package.json`, `hero.tsx` (its Focus line changes through data only).

---

## 8. Verification results

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 — 12/12 static pages |

**Routes** (`next start`, headless Chrome over CDP, fresh server confirmed
serving the new build before measuring):

| Route | `<h1>` | Headings | Title |
|---|---|---|---|
| `/about` | 1 | 1 2 2 2 3 2 3 2 2 | About — Alif Reezi |
| `/contact` | 1 | 1 2 2 2 | Contact — Alif Reezi |
| `/` | 1 | 1 2 | Alif Reezi - AI Engineer |
| `/projects` | 1 | 1 2 2 | Selected work — Alif Reezi |
| `/research` | 1 | 1 2 2 2 | Research log — Alif Reezi |

**Responsive — 5 routes × 7 widths (1440, 1280, 1024, 768, 430, 390, 375) =
35 combinations, 0 with `scrollWidth > clientWidth`, 0 empty blocks.**
Screenshots read at 1440 and 375 for `/about`.

**Keyboard, `/about`:** first Tab reaches the skip link with a `solid 2px`
outline; 22 focusables, 0 unnamed, every Tab lands on a visible element,
0 targets under 24px; desktop nav marks *About* current. Both outbound links
carry `rel="noopener noreferrer"`.

**Console:** clean on all five routes apart from the Lanyard's pre-existing
Three.js notices on `/`.

**Fact check on the built page:** "Telkom University Purwokerto" appears once,
under *Studied at* and in the opener as "from …"; "Kota Cirebon, West Java,
Indonesia" appears under *Based in*, in the opener as "now based in …", and
in the footer. The strings "studied in Cirebon", "lives in Purwokerto",
"based in Purwokerto" do not appear anywhere in the build.

---

## 9. Remaining owner-pending information

**Profile:** graduation year; work experience (none documented; `Experience`
is declared and unused); the Hero mission statement (five options pending
since 5D-1); pronouns are still unstated — the page avoids the need by using
the owner's first person and the Hero's pronoun-free style.

**Projects:** ThoraxVision dates, non-public repository, metric gaps,
"what to highlight"; MelonVision client name and live-link visibility;
lessons-learned copy for both.

**Research:** host/location, submission state, co-authors, paper links.

**Site:** production domain (`site.url` null), Open Graph image, footer
copy.

`Docs/Detail.txt` is now fully ingested except the items above that it
leaves blank or explicitly declines (screenshots, repo not public, domain not
bought).

---

## 10. Recommended next phase

**Phase 6G — Launch readiness.** Every page now reads from confirmed data and
nothing on the site is placeholder. What stands between it and a public URL
is not content:

1. A domain, then `site.url`, canonical URLs, `sitemap`, `robots`, and Open
   Graph metadata composed from `site.ts`.
2. An Open Graph image.
3. The footer copy the log calls a placeholder.
4. The four subjective candidates from `PHASE_6E_REPORT.md` §7, if wanted.
5. Delete the two fully merged side branches.

Not pushed — awaiting confirmation of the English rendering and the diff.
