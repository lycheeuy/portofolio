# Development Log

Rolling record of work actually completed and verified on this project.
Last updated: 2026-08-25.

Companion phase docs live alongside this file in `Docs/`. This log is the
entry point; those docs carry the per-phase detail.

---

## 1. Project Overview

### Purpose

Personal portfolio site for **Nashiruddin Alif Alvareezi** ("Alif Reezi"), an
AI / Machine Learning Engineer with a Biomedical Engineering background,
working across computer vision, model experimentation, and research.

Creative direction, carried through every phase: **EDITORIAL × ENGINEERING ×
PERSONAL**. Source brief is `Docs/PRD.txt`.

### Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 (CSS-first, no JS
config), and a React Three Fiber / Rapier 3D scene for the hero lanyard.

### Current architecture

Server Components by default. Exactly three client components exist, each for a
concrete reason:

| Component | Why it is a client component |
|---|---|
| `mobile-nav.tsx` | Open/close state, Escape key handling, body scroll lock |
| `lanyard-wrapper.tsx` | WebGL capability probe + error boundary |
| `lanyard-canvas.tsx` | Three.js / R3F / Rapier scene |

The whole 3D stack sits behind a `next/dynamic({ ssr: false })` boundary, so it
never enters the server bundle and never blocks first paint.

The homepage is Header + Hero + Selected Work + Research log + About +
Contact + Footer. **Every section is built**; no bare anchor remains. The
Hero and both navigations (Phase 5F), `#work` (5G), `#research` (5H),
`#about` (5I), and `#contact` plus the footer (5J) all read from
`src/data/`. No copy, URL, or figure is written in a component except the
About statement, which is flagged in Phase 5I as owner-pending.

---

## 2. Environment

Versions read from the installed tree, not from the semver ranges in
`package.json`.

| Tool | Version |
|---|---|
| Node.js | 24.18.0 |
| npm | 11.16.0 |
| Next.js | 16.3.1 (Turbopack) |
| React / React DOM | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 (`@tailwindcss/postcss` 4.3.3) |
| ESLint | 9.39.5 (`eslint-config-next` 16.3.1) |

3D stack: `three` 0.185.1, `@react-three/fiber` 9.7.0, `@react-three/drei`
10.7.8, `@react-three/rapier` 2.2.0, `meshline` 3.3.1.

All installed without `--force` or `--legacy-peer-deps`; React stayed at
19.2.8.

**Note on Next.js:** this version has breaking changes relative to older
training data. `AGENTS.md` requires reading the relevant guide in
`node_modules/next/dist/docs/` before writing code.

---

## 3. Phase Progress

Commit history:

```
5f6db14  fix(lanyard): render in dev, personalize card, shrink model (Phase 5D-3)
014f2dd  docs: add Phase 5D-2 lanyard integration documentation
3cb6924  feat: integrate 3D Lanyard ... (Phase 5D-2)
04e956c  feat: add hero section with asymmetric editorial composition (Phase 5D-1)
5952f40  feat: project foundation, design system, and page shell (Phase 5A-5C)
46c6c0a  chore: initialize portfolio project
```

### Phase 5A — Foundation · Complete

- **Objective:** Next.js App Router project with TypeScript strict mode and the
  path alias in place.
- **Implemented:** project scaffold, `@/*` → `src/*` alias, `src/lib/utils.ts`
  (`cn` class joiner), `src/types/index.ts` (`Project`, `ResearchEntry`,
  `Experience`, `CapabilityGroup`, `NowItem` — declared ahead of the content
  phases that will consume them).
- **Decisions:** no `clsx`/`tailwind-merge` dependency; a six-line `cn` covers
  current needs.
- **Verified:** builds and typechecks.

### Phase 5B — Design System · Complete

- **Objective:** a complete token layer before any visual work.
- **Implemented:** `src/app/globals.css` — all tokens in Tailwind 4's `@theme`
  block, so each is both a utility and a CSS variable. Base layer sets body
  typography, `::selection`, and `:focus-visible`. A global
  `prefers-reduced-motion` safety net collapses animation and transition
  durations to 1ms.
- **Decisions:** CSS-first Tailwind 4 — no `tailwind.config.js`, no JS config.
  Fonts self-hosted via `next/font/local` from `public/fonts/` rather than
  Google Fonts, so there is no third-party request at runtime.
- **Verified:** contrast ratios recorded inline per colour token (see §6).

### Phase 5C — Page Shell & Navigation · Complete

- **Objective:** structural shell and navigation for all later sections.
- **Implemented:** `page-container.tsx`, `section.tsx`, `site-header.tsx`,
  `mobile-nav.tsx`, `site-footer.tsx`, `nav-links.ts`. Empty anchor sections on
  the homepage.
- **Decisions:** single `NAV_LINKS` source shared by desktop and mobile nav.
  Sticky header with `backdrop-blur-sm` over a 92%-opacity background. Mobile
  menu is a full-screen overlay with Escape-to-close, focus return to the
  trigger, and body scroll lock. `scroll-padding-top: 5rem` on `html` keeps
  anchor targets clear of the sticky header.
- **Verified:** keyboard navigation and anchor behaviour.
- **Doc:** `Docs/Phase 5C — Page Shell & Navigatio.txt`

### Phase 5D-1 — Hero Composition · Complete

- **Objective:** the hero, composition only — no 3D yet, but a reserved slot
  for it.
- **Implemented:** `src/components/sections/hero.tsx`. Asymmetric 12-column
  grid: 8 columns of type, 4 columns reserved for the visual.
- **Decisions:** index number `00` + rule + label as a recurring editorial
  motif. Display name and full legal name are separated (`Alif Reezi` in
  Fraunces, `Nashiruddin Alif Alvareezi` in mono beneath). Lead paragraph
  capped at `36ch`.
- **Verified:** responsive from mobile through desktop.
- **Doc:** `Docs/Phase 5D-1 — Hero Composition.txt`

### Phase 5D-2 — Lanyard Integration · Complete

- **Objective:** drop the React Bits 3D Lanyard into the hero's reserved zone
  without harming load, bundle size, or the Server Component architecture.
- **Implemented:** the three-layer wrapper/canvas/boundary structure, physics
  scene, drag interaction, quiet fallback.
- **Decisions:** assets downloaded from GitHub rather than the jsrepo CLI (a
  known CLI bug corrupts binary assets). Dynamic import with `ssr: false`.
  Mobile gets reduced DPR (1.5 vs 2) and a coarser physics timestep (1/30 vs
  1/60).
- **Verified:** clean install, 0 vulnerabilities, no peer conflicts.
- **Doc:** `Docs/PHASE_5D-2.md`

### Phase 5D-3 — Card Personalisation & Dev Rendering · Complete, fix uncommitted

- **Objective:** replace the stock branded card with a personalised credential,
  make the scene render reliably in dev, and shrink the model.
- **Implemented:** `card-artwork.ts` (runtime-drawn card and strap textures),
  matte card material, a `<Suspense>` boundary inside the Canvas, a WebGL
  capability probe, a `prefers-reduced-motion` branch, and a stripped
  `card.glb`.
- **Decisions:** see §5 — this phase carries the most consequential ones.
- **Verified:** lint, typecheck, build, and browser verification (§7). One
  regression was found after the fact and fixed; see §5 and §8.

**Branch state — read this before continuing.** Phase 5D-3 is *not* on `main`.
`main` sits at `014f2dd` (5D-2 + docs). The original 5D-3 commit `fbdba4d` was
left dangling on a deleted branch and was recovered from the reflog; it is now
preserved on branch `phase-5d-3-lanyard`. Active work is on
**`fix/lanyard-5d3-regression`** (`5f6db14`, a cherry-pick of 5D-3) with the
strap fix **uncommitted** in the working tree. Merging 5D-3 into `main` is
outstanding.

### Phase 5E — Content & Project Data · Complete

- **Objective:** move portfolio content out of component literals and into a
  typed data layer, so the section components built in later phases consume
  structured data instead of hardcoded text. Data only — no UI.
- **Implemented:** `src/data/profile.ts`, `projects.ts`, `research.ts`,
  `site.ts`, and an expanded `src/types/index.ts`.
- **Sources:** `Docs/User Input Session.txt` (identity, contact, TB metrics,
  melon timeline, link availability), `Docs/PRD.txt` §1 (project descriptions,
  technology, research workflow), and the dataset sizes confirmed for this
  phase — TB 4,784 images, melon 1,250 images.
- **Decisions:** see §10.
- **Verified:** `npm run lint` clean, `npx tsc --noEmit` exit 0,
  `npm run build` exit 0 (compiled 31.3s, TypeScript 9.3s, 4/4 static pages).

### Phase 5F — Hero & Navigation · Complete

- **Objective:** build the real Hero and Navigation on top of the Phase 5E data
  layer. Scope was fixed to three things — navigation, hero, and the existing
  Lanyard integration — and nothing else.
- **Implemented:**
  - `site-header.tsx` — desktop nav now reads `site.navigation` and pairs each
    label with its `site.sections` index (`01`–`04`), shown from `lg` up only.
    Nav links and the wordmark were given 44px+ tap targets.
  - `mobile-nav.tsx` — full-screen overlay driven by the same data, with a real
    focus trap, Escape-to-close, focus return to the trigger, body scroll lock,
    and the owner's `primary` contact channels in the footer of the panel.
    Portalled to `<body>` because the header's `backdrop-blur-sm` would
    otherwise become the containing block for `position: fixed`.
  - `hero.tsx` — the identity section, every string sourced from
    `profile.ts` / `site.ts`: index `00` + rule + `profile.status`
    ("Fresh Graduate"), `displayName` as the `h1`, `fullName` in mono beneath,
    `positioning` as the lead, `trajectory` as an ordered mono sequence,
    `availability` behind a terracotta dot, two CTAs, and a colophon strip
    carrying `location`, `education`, `focusAreas`, and the primary email.
  - `page.tsx` — `main` given `tabIndex={-1}` so the skip link can focus it
    without putting it in the tab order.
- **Decisions:**
  - **Nothing invented.** No experience, metric, company, skill, or URL that is
    not already in `src/data/` appears in the UI. The Computer Vision and
    research framing comes from `profile.positioning` and `profile.focusAreas`,
    both of which already carry it; nothing was added to the data layer to
    make the hero read better.
  - **The two CTAs are deliberately unequal.** "View selected work" is the
    page's primary action and takes the single solid ink block in the whole
    composition; "Get in touch" stays a ruled text link. Both are `min-h-11`,
    so the tap target is 44px even though the label box is only ~26px.
  - **The colophon sits below the grid, not inside the text column.** Location,
    education, and focus are facts, not narrative — putting them in a ruled
    `<dl>` under the composition keeps the main column to one idea per line and
    means the metadata never has to compete with the Lanyard for width.
  - **Nav indices are `lg`-and-up only.** Below that there is not enough
    horizontal room for them to read as structure rather than noise.
  - **No scroll-spy / `aria-current`.** It would require making the header a
    client component and an observer per section, for an active state on a
    single-page anchor list. Not worth the cost against the "minimal, no
    excessive animation" constraint.
  - **The Lanyard was not touched.** Physics, WebGL fallback, card artwork, and
    the texture system are exactly as Phase 5D-3 left them. The only
    integration-side code is the bleed wrapper in the hero: the canvas is
    allowed to extend past its column so the strap has room to swing, and the
    bleed is stepped by breakpoint because a fixed `-right-16` at `lg` exceeds
    the page margin and would push the document into horizontal scroll.
- **No new dependencies.**
- **Verified:** see §7 — lint, typecheck, build, and a seven-width browser run.

### Phase 5G — Selected Work · Complete

- **Objective:** build the `#work` section from `src/data/projects.ts` so the
  two projects read as engineering case studies rather than portfolio cards.
  Presentation only — the data layer was not touched.
- **Implemented:**
  - `src/components/sections/selected-work.tsx` (new, server component). A
    section header (index `01`, a derived project count, the `h2`), then an
    ordered list of two `<article>` entries. Each entry is an index rail
    (large ghosted mono numeral + a `<dl>` of discipline / context / timeline)
    beside a content column: `h3` title, summary lead, then a two-column
    technical body — Problem and a numbered Approach list on one side, Dataset
    and Stack on the other — with Results below when the project has models.
  - `src/components/layout/section.tsx` — added an optional `labelledBy` prop
    so a section can name its landmark from the heading a reader can actually
    see, instead of duplicating that text into `aria-label`. Existing callers
    are unchanged.
  - `src/app/page.tsx` — `<SelectedWork />` replaces the empty `#work` anchor.
- **Decisions:**
  - **No project copy in the component.** Every string, figure, class name,
    dataset size, and link comes from `projects.ts`. The component decides
    layout; it does not know that project 01 is about tuberculosis. A
    corrected metric or a supplied URL changes the page without touching the
    file.
  - **The two entries differ because their data differs.** Tuberculosis
    Detection carries three benchmarked models, so `models.length > 0` renders
    the Results block — the research emphasis the brief asked for. Melon Plant
    Detection carries no evaluation figures but does carry a timeline and a
    deployment chain that ends on ESP32-CAM, so its weight lands on Approach
    and on the Deploy stack group. Neither shape is hardcoded per project;
    both are driven by which fields are populated. That also means the
    treatment is already correct for a third project nobody has written yet.
  - **Recorded precision is preserved, not normalised.** The source lists
    ResNet50 precision as `0.57` and DenseNet121 as `0.5491`. Rendering the
    first as `0.5700` would claim two digits of precision that were never
    measured, so figures print exactly as stored. Accuracy is the one
    conversion — stored as a ratio, shown as a percentage.
  - **Blank figures render as an em dash that reads as words.** The two gaps
    the owner left — ResNet50 accuracy and the disputed VGG19 Tuberculosis F1 —
    show `—` visually with a `sr-only` "Not recorded" beside it. A screen
    reader announcing a bare dash in a metrics table tells the listener
    nothing.
  - **Only links with a real `href` are rendered.** Both of the melon
    project's links are `href: null` (the repository URL was never supplied,
    and the deployment is on the client's VPS), so no link row renders at all
    today. The markup handles them the moment a URL lands. The internal
    `pending` notes are not surfaced — they are written for whoever maintains
    the data, not for a visitor.
  - **Metrics are real tables.** `<table>` with `<caption>`, `scope="col"` and
    `scope="row"`, inside a focusable `role="region"` scroll container, so a
    narrow viewport scrolls the table instead of the page and a keyboard user
    can reach that scroll without a pointer.
  - **No detail pages, and no fake affordance standing in for one.** Each
    entry carries an `id` (`work-<slug>`) so it is deep-linkable, but nothing
    pretends to link to a case study that does not exist. Since the section
    renders the whole case study inline, there is currently nothing further to
    click through to.
- **No new dependencies. The Lanyard and the Hero were not modified.**
- **Verified:** see §7 — lint, typecheck, build, and a seven-width browser run.
  Two real layout defects were found and fixed during that run; both are worth
  reading before the next section is built, and are recorded in §11.

### Phase 5H — Research · Complete

- **Objective:** build the `#research` section from `src/data/research.ts`.
  Presentation only; the data layer was not touched.
- **The constraint that shaped everything:** both entries are venue-only. Of
  every field on `ResearchEntry`, only `slug`, `index`, `year`,
  `conference.acronym`, `conference.year`, and `status` carry a value. Title,
  expanded conference name, topic, contribution, `projectSlug`, and `links` are
  all `null` or empty, and `status` is `pending-confirmation` for both — it is
  not known whether these are submitted, accepted, or presented. There is no
  version of this section that can show titles or contributions today without
  inventing them.
- **Implemented:**
  - `src/components/sections/research-log.tsx` (new, server component). A
    section header (index `02`, venue count, `h2`, a two-sentence standfirst
    with the count and year read from the data), a ruled `<ol>` ledger of two
    entries, then a Method block.
  - Each ledger row is `index / year` in a mono rail, the venue as `h3`, and
    the status at the outer edge with a marker dot. Topic, contribution,
    conference name, and links each render only when non-null, so the same
    markup becomes a full entry the moment anything is supplied.
  - `src/app/page.tsx` — `<ResearchLog />` replaces the empty `#research`
    anchor.
- **Decisions:**
  - **A register, not a publication list.** With only venues confirmed, an
    article-per-paper treatment would be two mostly empty blocks pretending to
    be case studies. A ruled ledger — index, year, venue, status — is honest
    about what exists and is the more editorial form anyway. It also scales:
    adding a real paper fills the same row rather than needing a new layout.
  - **The venue is the heading, and the year is not repeated.** With no title,
    `h3` is the bare acronym (`ICWT`), because the rail already sets `2026`
    immediately beside it; an earlier pass rendered `ICWT 2026` next to a
    `2026` and the row read twice. When a title arrives it takes the heading
    and the venue drops to the metadata line, where acronym + name + year *is*
    repeated deliberately, because that pairing is then the citation.
  - **`pending-confirmation` is worded as "Venue confirmed · details to
    follow".** It deliberately does not say submitted, accepted, or under
    review — none of those is known. All six `ResearchStatus` values are
    mapped, including the five unused ones, so a status change in the data can
    never fall through to a raw enum string.
  - **The marker dot only earns colour when the outcome is settled.** Accepted,
    presented, and published get the terracotta accent; everything else gets a
    border-grey dot. Both entries are grey today.
  - **Only links with a real `href` render.** Both entries have empty `links`,
    so no link renders at all. The markup and its focus states were verified
    against an injected link (see §7) rather than left unexercised.
  - **The Method block is the one thing not from `research.ts`, and it is a
    judgement call.** The brief asked the section to communicate that this work
    was researched, evaluated, and communicated — which two venue-only rows
    cannot do. `profile.capabilities` carries a group whose own label is
    "Research": hyperparameter experimentation, model evaluation, ROC/AUC,
    confusion matrix, Grad-CAM, scientific documentation. That is documented
    data saying exactly this, and the research section is its natural home.
    **Open coupling:** if the About section later wants the same group, one of
    the two should reference the other rather than both printing it.
  - **No surface band behind the section.** `--color-surface` was considered to
    separate Research from Selected Work, and rejected on contrast — see §11.
  - **The `tag` class string is duplicated from `selected-work.tsx`** rather
    than extracted, because extracting it would mean editing Selected Work,
    which this phase was told not to touch. If a third section needs it, lift
    all three into one module then.
- **No new dependencies. Hero, Lanyard, Selected Work, project data, and the
  navigation structure were not modified.**
- **Verified:** see §7.

### Phase 5I — About · Complete

- **Objective:** build the `#about` section from `src/data/profile.ts`.
  Presentation only; the data layer was not touched.
- **Implemented:**
  - `src/components/sections/about.tsx` (new, server component). A section
    header (index `03`, `profile.status`, `h2`), a two-paragraph statement
    beside a Background `<dl>`, a Capabilities block, and a closing line that
    renders `profile.availability` next to a contact link.
  - `src/app/page.tsx` — `<About />` replaces the empty `#about` anchor.
- **Decisions:**
  - **The prose is authored copy, and it is flagged as such.** `profile.ts`
    has no `bio` field, and its own `pending` list records "Personal / 'now'
    copy" as owner-supplied content that has not arrived. So the two statement
    paragraphs are connective writing, not data. Every *claim* in them traces
    to a documented field, and the component annotates each at the point of
    use: role and positioning from `roles` / `positioning`, "fresh graduate"
    from `status`, the degree from `education`, "medical imaging" and "edge
    hardware" from `site.description`, and the two project endings from
    `projects.ts`. Nothing asserts employment, a duration, a client, an
    achievement, a certification, or a skill that is not already recorded.
    **The wording is a placeholder the owner should approve or replace; the
    facts behind it are verified.**
  - **No pronouns, and not first person.** `profile.ts` does not state
    pronouns, so the copy avoids them the way the Hero does. First person was
    rejected separately: it would put words in the owner's mouth on a page
    they have not reviewed.
  - **Capability groups are split with `#research`, per the Phase 5H note.**
    About prints Model, Build, and Deploy; the Research group stays in
    `#research` as its Method block, and About links to it in a sentence
    rather than printing a second copy that could drift. The filter keys on
    the group label, so the split survives a reordering of
    `profile.capabilities`.
  - **Overlap with the Hero is deliberate and bounded.** The Hero already
    carries location, education, focus areas, trajectory, and availability.
    About repeats education, location, and availability, because a reader
    landing on the `#about` anchor should not have to scroll up for them — and
    adds what the Hero shows nowhere: all three `roles`, the degree's
    completion state, and the capability groups. Trajectory and focus areas
    are left to the Hero rather than restated.
  - **The closing makes availability actionable.** The Hero states the same
    line as a bare label; About pairs it with a link to `#contact`, so the
    section ends on something to do.
  - **The `tag` class string is now duplicated a third time.** Phase 5H's note
    said About was the point to lift it into a shared module — but doing that
    means editing `selected-work.tsx` and `research-log.tsx`, and this phase
    was told not to touch either. The debt is recorded rather than paid: one
    shared module, three call sites, whenever a phase is free to change all
    three at once.
- **No new dependencies. Hero, Lanyard, Selected Work, Research, and the
  navigation were not modified.**
- **Verified:** see §7.

### Phase 5J — Contact & Footer · Complete

- **Objective:** build `#contact` and the real footer. This closes the page —
  every section is now built and no bare anchor remains.
- **Implemented:**
  - `src/components/sections/contact.tsx` (new, server component). Header
    (index `04`, `profile.availability` behind an accent dot, `h2`, two lines
    of copy), the email as the one large action, then LinkedIn and GitHub as a
    ruled two-column list.
  - `src/components/layout/site-footer.tsx` — replaced the Phase 5C
    placeholder. Wordmark linking to `#top` with the full name beneath, the
    shared `NAV_LINKS` list, the social profiles from `profile.contact`, and a
    copyright + location bar.
  - `src/app/page.tsx` — `<Contact />` replaces the last empty anchor; the now
    unused `Section` import was dropped.
- **Decisions:**
  - **The phone number is not rendered anywhere.** It is in `profile.contact`
    with `primary: false`, and the Phase 5E decision that introduced that flag
    states the intent directly: the flag exists so the contact section can
    publish email, LinkedIn, and GitHub "while treating the phone number as a
    deliberate opt-in rather than default page content". Both components filter
    on `primary`, which honours that decision instead of re-taking it.
  - **The email is found by URI scheme, not by label.** `href.startsWith
    ("mailto:")` is what makes a channel an email; the label is a display
    string that could be renamed or translated. If no mailto channel exists,
    the section drops the headline and lists every primary channel instead.
  - **Social links are the primary channels with an `http(s)` scheme.** That is
    what separates a profile from a way of reaching someone: `mailto:` and
    `tel:` belong to `#contact`, not to a footer row of social links. No URL,
    handle, or address is written in either component.
  - **External links open in a new tab and say so.** `target="_blank"` with
    `rel="noopener noreferrer"`, plus an `sr-only` "(opens in a new tab)" —
    the arrow glyph only tells sighted users, and a link that swaps the tab out
    from under someone should announce it.
  - **The copy is an open door, not a call to action.** The availability line
    above the heading is the offer; the two sentences under it just say
    questions are welcome and that an email is enough. No "let's build
    something amazing".
  - **The email uses `break-all`, not `break-words`.** An address is a single
    token with no spaces, so normal wrapping cannot break it and it would run
    past a 375px column. It sits on one line down to 1024 and wraps to two
    below that.
  - **The footer year is baked at build time.** `new Date()` is evaluated when
    the Server Component renders, and the homepage is statically prerendered.
    A client component purely to keep a footer year live would be the fourth
    client component on the site and would hydrate on every visit to change one
    number. It goes stale only until the next deploy.
  - **The footer nav is labelled.** `aria-label="Footer"` distinguishes it from
    the header's `Primary` nav, and it reads the same `NAV_LINKS` export, so
    the two can never disagree.
- **No new dependencies. Hero, Lanyard, Selected Work, Research, About, and the
  project and research data were not modified.**
- **Verified:** see §7.

---

## 4. Current Portfolio Architecture

```
src/
├── app/
│   ├── layout.tsx          Root layout; three next/font/local families
│   ├── page.tsx            Homepage: header + hero + empty anchors + footer
│   ├── globals.css         Entire design system (@theme + base layer)
│   └── favicon.ico
├── components/
│   ├── layout/             Structural shell
│   │   ├── page-container.tsx   Max-width + page margin (server)
│   │   ├── section.tsx          Semantic section + vertical rhythm (server)
│   │   ├── site-header.tsx      Sticky header + desktop nav (server)
│   │   ├── mobile-nav.tsx       Full-screen overlay menu (client)
│   │   ├── site-footer.tsx      Identity, nav, socials, © (server, 5J)
│   │   └── nav-links.ts         Re-exports NAVIGATION from data/site
│   ├── sections/
│   │   ├── hero.tsx             Hero composition (server)
│   │   ├── selected-work.tsx    #work case studies (server, Phase 5G)
│   │   ├── research-log.tsx     #research venue ledger (server, Phase 5H)
│   │   ├── about.tsx            #about profile (server, Phase 5I)
│   │   └── contact.tsx          #contact channels (server, Phase 5J)
│   └── lanyard/                 Isolated 3D bundle
│       ├── lanyard-wrapper.tsx  WebGL probe + error boundary (client)
│       ├── lanyard-canvas.tsx   R3F scene, physics, band (client)
│       └── card-artwork.ts      Runtime canvas textures
├── data/                   Typed content layer (Phase 5E)
│   ├── profile.ts               Owner identity, capabilities, contact
│   ├── projects.ts              Tuberculosis + Melon case-study data
│   ├── research.ts              ICWT 2026 / ICSMech 2026 entries
│   └── site.ts                  Site config, NAVIGATION, SECTIONS
├── lib/utils.ts            cn()
└── types/index.ts          Content interfaces consumed by data/

public/
├── fonts/                  5 self-hosted variable woff2 files
└── lanyard/card.glb        159 KB, geometry only (as committed — see §8)
```

Architectural rules currently holding:

1. Server Components by default; client only where interaction demands it.
2. The 3D stack is fully isolated under `components/lanyard/` and dynamically
   imported.
3. All design values come from tokens — no hard-coded colours or sizes in
   components.
4. `sections/` holds page content; `layout/` holds reusable structure.
5. Content lives in `data/`, typed by `types/index.ts`; components receive it
   as props rather than embedding copy.

---

## 5. Lanyard Implementation

### Origin

Adapted from the **React Bits** Lanyard component (TypeScript + Tailwind
variant). React Bits is not an npm package — the source is copied into the
project and maintained here.

### Layering

```
Hero (server)
└── LanyardWrapper (client)
    ├── WebGL probe → LanyardFallback when unsupported
    └── LanyardErrorBoundary
        └── LanyardCanvas (dynamic, ssr: false)
            └── Canvas → Suspense → Physics → Band
```

### Three.js / R3F / Rapier

- `<Canvas>` at camera `[0, 0, 20]`, `fov: 20`, transparent clear colour.
- Physics: gravity `[0, -40, 0]`; three `BallCollider` rope segments chained by
  `useRopeJoint` (length 1 each) from a fixed anchor, then a `useSphericalJoint`
  to the card's `CuboidCollider`.
- Dragging switches the card body to `kinematicPosition` and unprojects the
  pointer onto the camera plane.
- The card mesh, clip, and clamp come from `card.glb`; the strap is a `meshline`
  `MeshLineGeometry` fed each frame from a chordal `CatmullRomCurve3`.
- Mobile tuning: DPR capped at 1.5, physics timestep 1/30, 16 curve samples
  instead of 32, clearcoat disabled.

### Custom card artwork (`card-artwork.ts`)

The card face is **drawn at runtime on a 2D canvas** and handed to Three.js as a
`CanvasTexture`, rather than shipped as an image. It reads the live design
tokens via `getComputedStyle`, so the credential stays in sync with
`globals.css` and adds no binary asset to the bundle.

- UV footprints were measured from the model's `TEXCOORD_0` accessor: front face
  on the left half of the texture, back on the right. Created with
  `flipY = false` to match the glTF convention.
- Card texture 1600×1484; letter-spacing applied glyph-by-glyph so tracking is
  identical across browsers and measurable for auto-fitting.
- Front: name, terracotta rule, role, focus lines, hairline footer. Top ~14% is
  left clear because the metal clamp sits over it.
- Textures are repainted once `document.fonts.ready` resolves, so the card never
  ships with fallback fonts.

### Strap customisation

512×128 tiling band: solid ink webbing with two hairline stripes at 26% and 74%,
symmetric so it tiles seamlessly at any repeat. Drawn from the same tokens.

### Model

`card.glb` was stripped of its embedded branded texture: **2.4 MB → 159 KB**.
Only geometry (`card`, `clip`, `clamp`) and the `base` / `metal` material slots
remain; `base` is overridden with the runtime texture. Verified by parsing the
GLB JSON chunk — all node and material names the code depends on are intact.

That 159 KB model is what is **committed** at `5f6db14`. The working tree
currently holds the 2.4 MB 5D-2 model instead — see §8.

### WebGL fallback

R3F creates its renderer asynchronously, so a missing WebGL context rejects a
promise rather than throwing during render — an error boundary would never see
it, leaving a dead canvas. A synchronous probe runs up front via
`useSyncExternalStore`, whose `getServerSnapshot` returns `false`, so the quiet
fallback renders on the server and through hydration, then flips to the scene
once support is confirmed. The fallback itself is a thin rule and a terracotta
dot — deliberately quiet, not an error message.

### Reduced motion

Under `prefers-reduced-motion: reduce`: `frameloop` switches to `"demand"`,
`<Physics>` is `paused`, rigid bodies use a settled `STILL_SEED` instead of the
swinging `LIVE_SEED`, pointer handlers are removed entirely, and a `SettleFrames`
helper requests frames for 2.5s so the environment map, model, and band all land
in the single still image the user is left with.

### Important decisions

- **The `<Suspense>` boundary inside `<Canvas>` is load-bearing.** `<Physics>`
  suspends on Rapier's WASM and `useGLTF` suspends on the model. Without an
  inner boundary that suspension reaches R3F's own `Block` fallback, which makes
  the `Canvas` component itself throw the promise; remounting it runs
  `unmountComponentAtNode → renderer.dispose → forceContextLoss` while
  `configure()` is still in flight, and under Strict Mode the renderer ends up
  permanently disposed — a live `<canvas>` with a dead context.
- **Ambient light is `intensity={1}`, not `Math.PI`.** The stock value suits the
  original metallic card; on a matte card that also picks up the environment it
  blew the face out to the same brightness as the page.

### Strap smoothing bug — found and fixed

**Symptom:** the lanyard appeared on load, then the strap vanished within
seconds.

**Root cause:** the band's smoothing lerp was frame-rate unstable. The chase
factor is `delta * 50`, and `THREE.Vector3.lerp` does not clamp its alpha — so
any frame slower than 20 ms pushed the factor above 1 and threw the control
point *past* its target instead of toward it. `clampedDistance` then saturated
at its own ceiling of 1, leaving the factor at `delta * 50` again, so the error
compounded rather than corrected. One slow frame walked the strap's control
points out to ~1e15, where the band left the frustum permanently.

**Why 5D-3 exposed it:** the bug is inherited from the upstream React Bits
component and was latent in 5D-2. The new inner `<Suspense>` boundary keeps the
Canvas mounted, which means R3F's render loop is already ticking while Rapier's
WASM and the model are still landing on the main thread. Measured on the same
machine and browser:

| Rendering path | max `delta` | outcome |
|---|---|---|
| Without inner Suspense (5D-2 path) | 0.043 s | stable |
| With inner Suspense (5D-3) | 2.07 s at frame 7 | overshoot at frame 3 (alpha 6.26) → diverged |

**Fix** — one line in `lanyard-canvas.tsx`:

```ts
lerped.lerp(
  ref.current.translation(),
  Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))),
);
```

Capping the factor at 1 keeps every step a convex combination of the two points:
it can approach the target but never overshoot. At 60 fps the factor is 0.83, so
normal-speed behaviour is unchanged.

Ruled out during diagnosis, each with evidence: `card-artwork` (divergence
persisted with 8×8 stub textures), `document.fonts.ready`, the WebGL probe
(`false → true` only, never back), reduced motion (`false` throughout), React
remount/keys (each component mounts once), and texture disposal.

---

## 6. Design System

All values below are read from `src/app/globals.css`.

### Fonts

Three self-hosted variable families, loaded with `next/font/local` from
`public/fonts/` at weight range `100 900`, `display: swap`.

| Role | Family | Used for |
|---|---|---|
| `--font-display` | Fraunces (+ italic) | Hero name, headings, editorial statements |
| `--font-sans` | DM Sans (+ italic) | Body copy, navigation, UI labels |
| `--font-mono` | JetBrains Mono | Metadata, index numbers, technical labels |

### Colour — "Warm Archive"

Restrained warm-neutral palette with a single terracotta accent. Contrast
ratios are against `--color-bg`.

| Token | Value | Contrast |
|---|---|---|
| `--color-bg` | `#F6F2EB` | warm off-white, page background |
| `--color-surface` | `#EDE9E1` | section alternation, insets |
| `--color-ink` | `#1B1815` | 15.84:1 (AAA) |
| `--color-secondary` | `#6B6560` | 5.15:1 (AA) |
| `--color-muted` | `#726C66` | 4.64:1 (AA) |
| `--color-border` | `#D5D0C8` | pencil-line rules |
| `--color-accent` | `#9E4F35` | 5.19:1 (AA) |
| `--color-accent-hover` | `#7E3E28` | 7.22:1 (AAA) |
| `--color-selection` | `#9E4F3526` | terracotta @ ~15% |

### Typographic scale

Fluid via `clamp()`, no JS. `--text-hero` `clamp(3.5rem, 9vw, 6.25rem)`
(56→100px), `--text-display` (40→72px), `--text-h1` (36→56px), `--text-h2`
(26→38px), `--text-h3` (20→26px); fixed `--text-body-lg` 18px, `--text-body`
16px, `--text-small` 14px, `--text-meta` 12px, `--text-label` 11px,
`--text-stat` 28px.

Line heights run tight-to-open: `--leading-hero` 0.9 → `--leading-relaxed` 1.7.
Tracking: `--tracking-tight` `-0.02em` for display type, `--tracking-label`
`0.1em` for uppercase labels, `--tracking-mono` `0.02em`.

### Layout & motion

`--container-max` 80rem (1280px), `--container-text` 42.5rem (680px reading
column), `--container-pad` `clamp(1.25rem, 5vw, 5rem)`. Section rhythm
`--spacing-section` `clamp(4rem, 10vw, 8rem)`.

Radii are deliberately minimal — `--radius-sm` 4px is the maximum, keeping the
feel editorial rather than app-like. Easing pairs `--ease-standard` with
`--ease-editorial` `cubic-bezier(0.16, 1, 0.3, 1)`; durations 150 / 250 / 300ms.

### Visual direction

Editorial print sensibility applied to an engineering subject: generous white
space, hairline rules, tracked-out mono metadata, index numbers as a structural
motif, asymmetric grids, and exactly one accent colour used sparingly.

---

## 7. Verification

Latest run, 2026-08-23, on `fix/lanyard-5d3-regression` with the strap fix
applied.

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — compiled in 49s, TypeScript 17.3s, 4/4 static pages, routes `/` and `/_not-found` both static |

### Browser verification — performed

Driven through the Chrome DevTools Protocol against real headless Chrome
(ANGLE/SwiftShader), measuring dark-pixel coverage in the lanyard column
decoded from screenshots.

| Test | Result |
|---|---|
| 16s persistence @ 1440×900 | `9137 → 12532 → 12367 → 12340 → 12332 → 12317 → 12313 → 12313` — settles by t=4s, flat thereafter |
| Drag | 13651 during drag, 12415 three seconds after release; card follows pointer, strap tracks, physics recovers |
| Resize | 1100×800 → 11076; back to 1440×900 → 12319 |
| Mobile 390×844, fresh load | 11529 — strap and card both present |
| Console errors | **None.** The pre-fix `computeBoundingSphere(): radius is NaN` spam (558 occurrences) is gone |

Screenshots confirmed the strap renders from anchor to clip with the card
hanging below, at load, after 16s, during drag, and on mobile.

### Phase 5E run - 2026-08-24

Data layer only; no runtime behaviour changed, so no browser re-verification
was required.

| Check | Result |
|---|---|
| `npm run lint` | Clean - no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 - compiled 31.3s, TypeScript 9.3s, 4/4 static pages, routes `/` and `/_not-found` both static |

**Caveats:**

- Verification ran under SwiftShader software rendering, not a hardware GPU.
  Behaviour on real GPU hardware has not been separately confirmed.
- All three command checks and the browser run were performed against the
  committed 159 KB `card.glb`. The `public/lanyard/` asset change described in
  §8 landed afterwards and has not been re-verified.

### Phase 5F run — 2026-08-25

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — compiled 12.3s, TypeScript 2.7s, 4/4 static pages, routes `/` and `/_not-found` both static |

#### Responsive — seven widths, real headless Chrome over CDP

Driven against `next start` (production build, port 3111) in headless Chrome
with SwiftShader, measuring live `getBoundingClientRect()` geometry rather than
reading screenshots. Each width was a fresh navigation with a 4s settle so the
dynamic import, Rapier WASM, and the model had all landed.

| Width | `scrollWidth` / `clientWidth` | Overflow | Navigation | Canvas | Text ↔ Lanyard |
|---|---|---|---|---|---|
| 1440 | 1425 / 1425 | none | desktop, 4 links | 405×688 | 32px clear |
| 1280 | 1265 / 1265 | none | desktop, 4 links | 411×688 | 32px clear |
| 1024 | 1009 / 1009 | none | desktop, 4 links | 310×688 | 32px clear |
| 768  | 753 / 753   | none | desktop, 4 links | 691×452 | stacked, 16px clear |
| 430  | 430 / 430   | none | Menu button      | 387×452 | stacked, 16px clear |
| 390  | 390 / 390   | none | Menu button      | 350×452 | stacked, 16px clear |
| 375  | 375 / 375   | none | Menu button      | 335×452 | stacked, 16px clear |

- **No horizontal overflow at any width.** The document was also swept element
  by element for any box crossing the viewport edge; the worst offender was
  `null` at all seven widths.
- **Navigation stays usable.** The desktop list is visible and complete from
  768 up; below that it is replaced by the Menu button. Nav links measure 50px
  tall and the wordmark 44px, so both clear the 44px touch minimum at the 768
  breakpoint where the desktop nav is still shown on a touch device.
- **Hero text never collides with the Lanyard.** From `lg` up the two are
  separate grid columns with 32px between the widest line of hero text and the
  left edge of the canvas. Below `lg` they stack, with the canvas's `-top-8`
  bleed landing inside the 48px grid gap and leaving 16px of clearance under
  the CTAs.
- **Both CTAs stay accessible.** 44px tall at every width; at 390 and 375 they
  wrap to two rows rather than shrinking.
- **The Lanyard renders at every width.** Screenshots at 1440, 1280, 1024, 768,
  and 390 all show the strap running from the anchor to the clip with the card
  hanging below.

#### Accessibility — measured, not asserted

| Check | Result |
|---|---|
| Skip link | First Tab stop on a fresh load; `<a href="#top">`, visible on focus |
| Heading hierarchy | Exactly one `h1` on the page; no skipped levels (the four empty anchor sections carry `aria-label`, not headings) |
| Landmarks | `header` / `nav[aria-label="Primary"]` / `main#top` / `footer`; the overlay is `nav[aria-label="Mobile"]` inside `role="dialog"` |
| Mobile menu | Opens with `aria-expanded="true"`, `role="dialog"`, `aria-modal="true"`; focus moves to Close; body scroll locked |
| Focus trap | Nine Tab presses from open — Close → 01 Work → 02 Research → 03 About → 04 Contact → Email → LinkedIn → GitHub → Close. Focus never left the panel |
| Escape | Closes the panel, returns focus to the trigger, releases the scroll lock |
| Touch targets | Every focusable element in the overlay measured 44px or taller (44 / 83 / 83 / 83 / 83 / 44 / 44 / 44) |
| Reduced motion | Under `prefers-reduced-motion: reduce` the canvas still paints a settled 405×688 still image, the quiet fallback does not take over, and there is no overflow |
| Console | Zero errors across all seven widths and the reduced-motion run |

**Caveats:**

- Software rendering again. The Lanyard was exercised under SwiftShader, not
  a hardware GPU.
- This run was against the **2.4 MB** `card.glb` currently in the working
  tree, not the committed 159 KB model (§8). The scene renders from either,
  since the card face is drawn at runtime.

### Phase 5G run — 2026-08-25

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — 4/4 static pages, routes `/` and `/_not-found` both static |

#### Responsive — seven widths, real headless Chrome over CDP

Against `next start` (production build) in headless Chrome, measuring live
geometry. Each width was a fresh navigation with a 4s settle.

| Width | `scrollWidth` / `clientWidth` | Overflow | Entries | Title | Results tables | Table scroll |
|---|---|---|---|---|---|---|
| 1440 | 1425 / 1425 | none | 2 | 38px | 2 (3 + 6 rows) | not needed |
| 1280 | 1265 / 1265 | none | 2 | 38px | 2 | not needed |
| 1024 | 1009 / 1009 | none | 2 | 30.7px | 2 | not needed |
| 768  | 753 / 753   | none | 2 | 26px | 2 | not needed |
| 430  | 430 / 430   | none | 2 | 26px | 2 | scrolls in place |
| 390  | 390 / 390   | none | 2 | 26px | 2 | scrolls in place |
| 375  | 375 / 375   | none | 2 | 26px | 2 | scrolls in place |

- **No horizontal overflow at any width**, confirmed two ways: `scrollWidth`
  equals `clientWidth` at all seven, and an element-by-element sweep found no
  box crossing the viewport edge that was not clipped by an ancestor.
- **Typography stays readable.** The summary holds 18px at `1.7` leading
  throughout, measuring roughly 85 characters per line at 1440 down to 37 at
  375 — inside a comfortable measure at both ends. Titles scale 38 → 26px and
  the ghosted index numeral 72 → 40px, so the index never competes with the
  title on a narrow screen.
- **Hierarchy holds.** At every width each entry renders, in order: index,
  discipline/context metadata, title, summary, then the five (or four) labelled
  technical blocks. Below `md` the two technical columns stack rather than
  compressing.
- **Metrics tables scroll themselves.** At 375 the model-comparison table is
  544px inside a 335px port; it scrolls in place, is reachable by keyboard, and
  the page does not overflow while it is scrolled.

#### `#work` anchor and keyboard

| Check | Result |
|---|---|
| Nav anchor | Clicking `01 Work` sets `#work` and lands the section top at 80px against a 65px sticky header — clear, with the `h2` visible |
| Heading hierarchy | `h1` Alif Reezi → `h2` Selected work → `h3` per project → `h4` per block. One `h1`, no skipped levels |
| Landmark naming | `#work` is named by `aria-labelledby="work-heading"` — the visible heading, not a duplicated string |
| Tab order | Both table scroll regions are reachable, in document order, each with a visible 2px focus outline |
| Table semantics | `<caption>`, `scope="col"` on headers, `scope="row"` on the model name in every row |
| Blank figures | The two `null` metrics render `—` with an `sr-only` "Not recorded" |
| Console | Zero errors at all seven widths |

#### Two defects found and fixed during this run

Both were found by measurement, not by reading the diff, and both are the kind
that look fine in a screenshot at one width.

1. **`sr-only` escaped the table's scroll container.** At 375 the document's
   `scrollWidth` was 557 against a 375 viewport. No unclipped element appeared
   to overflow, and `body.scrollWidth` was a clean 375 — only
   `documentElement.scrollWidth` was wrong. Cause: Tailwind's `sr-only` is
   `position: absolute`, and an absolutely positioned box is clipped by an
   ancestor's overflow only if that ancestor is in its containing block chain.
   With no positioned ancestor, the "Not recorded" labels resolved against the
   initial containing block, escaped the scroll port, and were laid out at
   their static position — which for the last column of a 608px table sits far
   past a 375px viewport. Adding `relative` to the scroll container took
   `scrollWidth` from 557 to 360.

2. **`inline-block` is not safe in this design system.** Every stack tag was
   rendering at exactly 48px regardless of its text, so `DenseNet121` spilled
   out of its own border and collided with the tag beside it. It was not a
   flex problem — the width survived `shrink-0`, `flex-basis`, and switching
   the container to plain inline flow. The generated stylesheet had **two**
   rules: `.inline-block{display:inline-block}` and
   `.inline-block{inline-size:var(--spacing-block)}`. Because `globals.css`
   defines `--spacing-block` in `@theme`, Tailwind 4 also reads `inline-block`
   as the `inline-*` sizing utility with the `block` spacing key, and the
   second rule wins on source order — `clamp(2rem, 5vw, 3rem)` is exactly 48px
   at 1440. Dropping the class fixed it; the span is a flex child and was
   blockified anyway. See §11.

**Caveats:**

- Software rendering (SwiftShader), as with every previous browser run here.
- Run against the 2.4 MB `card.glb` in the working tree, not the committed
  159 KB model (§8). Phase 5G does not touch the Lanyard either way.

### Phase 5H run — 2026-08-25

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — 4/4 static pages, routes `/` and `/_not-found` both static |

#### Responsive — seven widths, real headless Chrome over CDP

Against `next start` (production build) in headless Chrome, measuring live
geometry. Fresh navigation and a 4s settle per width.

| Width | `scrollWidth` / `clientWidth` | Overflow | Rows | `h2` | Venue `h3` | Status |
|---|---|---|---|---|---|---|
| 1440 | 1425 / 1425 | none | 2 | 72px | 26px | one line |
| 1280 | 1265 / 1265 | none | 2 | 72px | 26px | one line |
| 1024 | 1009 / 1009 | none | 2 | 61.4px | 25.6px | one line |
| 768  | 753 / 753   | none | 2 | 46.1px | 20px | one line |
| 430  | 430 / 430   | none | 2 | 40px | 20px | one line |
| 390  | 390 / 390   | none | 2 | 40px | 20px | one line |
| 375  | 375 / 375   | none | 2 | 40px | 20px | one line |

- **No horizontal overflow at any width.** `scrollWidth` equals `clientWidth`
  at all seven, and an element sweep — skipping boxes clipped by an ancestor,
  the refinement §11 calls for — found no offender at any width.
- **Titles stay readable.** The standfirst holds 18px at `1.7` throughout. The
  venue heading scales 26 → 20px and the year rail sits beside it in mono, so
  the ledger keeps its register reading from 1440 down to 375, stacking below
  `sm` rather than compressing.
- **Status fits on one line at every width.** It did not initially: at 1440 the
  longest label measures ~277px against a three-column track of ~260px and
  broke across "DETAILS TO / FOLLOW". The status track was widened to four
  columns and the content track narrowed to six.

#### Long-title wrapping

Every `title` in the data is `null`, so wrapping was exercised by injecting a
real title into the DOM at runtime — the CSS is tested without inventing
content in the repo.

| Width | 133-char title | 85-char unbroken token |
|---|---|---|
| 1440 | 4 lines, no column or page overflow | contained, no page overflow |
| 768  | 4 lines, no column or page overflow | contained, no page overflow |
| 375  | 5 lines, no column or page overflow | contained, no page overflow |

The heading is capped at `34ch` and carries `break-words`, so an unbroken
token — a long compound or a pasted identifier — breaks inside the column
rather than widening the document.

#### Anchor, keyboard, focus, reduced motion

| Check | Result |
|---|---|
| `#research` anchor | Clicking `02 Research` sets the hash and lands the section top at 80px against a 65px sticky header; the `h2` is visible |
| Landmark naming | `aria-labelledby="research-heading"` — the visible heading |
| Heading hierarchy | `h1` → `h2` Research log → `h3` ICWT / ICSMech / Method. No skipped levels; still exactly one `h1` on the page |
| Tab order | The section has **zero** focusable elements today, because no entry has a resolvable link. Tab passes cleanly through it, which is the honest outcome, not a defect |
| Focus state | Verified against an injected link: reachable by real Tab keypresses at stop 12, `:focus-visible` matches, outline `2px solid rgb(158, 79, 53)` — `--color-accent` — at 2px offset, and the link measures 44px tall |
| Reduced motion | Under `prefers-reduced-motion: reduce` every transition in the section collapses to `0.001s` via the global net; the section renders in full with no overflow |
| Console | Zero errors at all seven widths |

Note on method: an earlier focus check used `element.focus()` and reported
`outline-style: none`. That was correct behaviour, not a bug — `globals.css`
sets `:focus:not(:focus-visible) { outline: none }`, and a programmatic focus
does not satisfy Chrome's `:focus-visible` heuristic. Only a real Tab keypress
proves the ring, so the check was redone that way.

**Caveats:**

- Software rendering (SwiftShader), as with every previous browser run here.
- Run against the 2.4 MB `card.glb` in the working tree, not the committed
  159 KB model (§8). Phase 5H does not touch the Lanyard.

### Phase 5I run — 2026-08-25

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — 4/4 static pages, routes `/` and `/_not-found` both static |

#### Responsive — seven widths, real headless Chrome over CDP

Against `next start` (production build) in headless Chrome, measuring live
geometry. Fresh navigation and a 4s settle per width.

| Width | `scrollWidth` / `clientWidth` | Overflow | Statement measure | Tags | Links |
|---|---|---|---|---|---|
| 1440 | 1425 / 1425 | none | 640px, ~71 cpl | 14, none clipped | 2 |
| 1280 | 1265 / 1265 | none | 640px, ~71 cpl | 14, none clipped | 2 |
| 1024 | 1009 / 1009 | none | 516px, ~57 cpl | 14, none clipped | 2 |
| 768  | 753 / 753   | none | 640px, ~71 cpl | 14, none clipped | 2 |
| 430  | 430 / 430   | none | 387px, ~43 cpl | 14, none clipped | 2 |
| 390  | 390 / 390   | none | 350px, ~39 cpl | 14, none clipped | 2 |
| 375  | 375 / 375   | none | 335px, ~37 cpl | 14, none clipped | 2 |

- **No horizontal overflow at any width.** `scrollWidth` equals `clientWidth`
  at all seven, and an element sweep — skipping boxes clipped by an ancestor,
  per §11 — found no offender.
- **Text stays readable.** Both statement paragraphs hold 18px at `1.7`
  leading. The measure was capped at `52ch` after a first pass measured ~75
  characters per line at 768, where the two-column grid collapses and the
  paragraph would otherwise take the full container; capped, the widest case
  is ~71. The cap matches the Research standfirst, since both are
  section-opening statements.
- **14 capability tags render, none clipped** — Model (6), Build (4), Deploy
  (4). The Research group is correctly absent; it stays in `#research`.
- **The Background list renders all three rows** — Education (with the
  `Completed` status beneath), Roles (all three), Based in — at every width,
  stacking below `lg`.

#### Anchor, keyboard, focus, reduced motion

| Check | Result |
|---|---|
| `#about` anchor | Clicking `03 About` sets the hash and lands the section top at 80px against a 65px sticky header; the `h2` is visible |
| In-section link | The `#research` pointer actually navigates — hash becomes `#research` and the target lands at 80px, clear of the header |
| Landmark naming | `aria-labelledby="about-heading"` — the visible heading |
| Heading hierarchy | `h1` → `h2` About → `h3` Background / Capabilities. No skipped levels; still exactly one `h1` on the page |
| Keyboard | Both links reachable by real Tab keypresses, in document order |
| Focus states | Both match `:focus-visible` and paint a 2px solid accent outline at 2px offset |
| Target size | `Get in touch` is 44px tall. The inline `Research log` link is 21px — it sits inside a sentence, which WCAG 2.5.8 exempts, and boxing it out to 44px would break the prose it belongs to |
| Reduced motion | Under `prefers-reduced-motion: reduce` every transition in the section collapses to `0.001s` via the global net; the section renders in full with no overflow |
| Console | Zero errors at all seven widths |

**Caveats:**

- Software rendering (SwiftShader), as with every previous browser run here.
- Run against the 2.4 MB `card.glb` in the working tree, not the committed
  159 KB model (§8). Phase 5I does not touch the Lanyard.

### Phase 5J run — 2026-08-25

| Check | Result |
|---|---|
| `npm run lint` | Clean — no output, no warnings |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0 — 4/4 static pages, routes `/` and `/_not-found` both static |

#### Responsive — seven widths, real headless Chrome over CDP

Against `next start` (production build) in headless Chrome, measuring live
geometry. Fresh navigation and a 4s settle per width.

| Width | `scrollWidth` / `clientWidth` | Overflow | Email link | Contact links | Footer links | Footer overflow |
|---|---|---|---|---|---|---|
| 1440 | 1425 / 1425 | none | 44px, 1 line | 3 | 7 | none |
| 1280 | 1265 / 1265 | none | 44px, 1 line | 3 | 7 | none |
| 1024 | 1009 / 1009 | none | 44px, 1 line | 3 | 7 | none |
| 768  | 753 / 753   | none | 44px, 2 lines | 3 | 7 | none |
| 430  | 430 / 430   | none | 51px, 2 lines | 3 | 7 | none |
| 390  | 390 / 390   | none | 51px, 2 lines | 3 | 7 | none |
| 375  | 375 / 375   | none | 51px, 2 lines | 3 | 7 | none |

- **No horizontal overflow at any width.** `scrollWidth` equals `clientWidth`
  at all seven, and an element sweep — skipping boxes clipped by an ancestor,
  per §11 — found no offender. The 35-character email address wraps rather
  than widening the page at every narrow width.
- **The footer stays readable on mobile.** It never overflows its own box; the
  three column groups stack below `sm`, and the copyright and location lines
  wrap to two rows at 390 and below. Meta type holds 12px throughout.
- **Only real data is rendered.** Three links in `#contact` — `mailto:`,
  LinkedIn, GitHub — and seven in the footer: the `#top` wordmark, four nav
  anchors, and the two social profiles. Every `href` comes from
  `profile.contact` or `NAV_LINKS`.
- **The phone number appears nowhere.** Checked at every width against both
  the `tel:` scheme and the digits themselves, in the section and the footer.

#### Anchors, links, keyboard, focus, reduced motion

| Check | Result |
|---|---|
| `#contact` anchor | Clicking `04 Contact` sets the hash and lands the section top at 80px against a 65px sticky header; the `h2` is visible |
| Footer navigation | All four footer anchors resolve to a real `<section>` on the page, and the wordmark's `#top` target exists |
| Semantics | `<footer>` is a direct child of `<body>`, so it is a `contentinfo` landmark; its nav carries `aria-label="Footer"` against the header's `Primary` |
| Landmark naming | `#contact` is named by `aria-labelledby="contact-heading"` |
| Heading hierarchy | `h1` → `h2` Contact → `h3` Email / LinkedIn / GitHub. No skipped levels; still exactly one `h1` on the page |
| Keyboard | All 10 stops across `#contact` and the footer reachable by real Tab keypresses, in document order |
| Target size | **Every one of the 10 is 44px tall or more** — zero under the minimum |
| Focus states | All 10 match `:focus-visible` and paint a 2px solid outline at 2px offset |
| New-tab links | Both external links carry `target="_blank"`, `rel="noopener noreferrer"`, and an `sr-only` "(opens in a new tab)" |
| Reduced motion | Under `prefers-reduced-motion: reduce` every transition in the section and the footer collapses to `0.001s`; no overflow |
| Console | Zero errors at all seven widths |

**Caveats:**

- Software rendering (SwiftShader), as with every previous browser run here.
- Run against the 2.4 MB `card.glb` in the working tree, not the committed
  159 KB model (§8). Phase 5J does not touch the Lanyard.
- The footer year read `2026` in this run because that is the build date. It is
  build-time, not visitor-time — by design, see the Phase 5J decisions.

---

## 8. Known Issues / Remaining Work

### Fixed

- **Strap divergence (Phase 5D-3 regression).** Unclamped lerp alpha sent the
  band's control points to ~1e15 within seconds of load. Fixed by clamping the
  chase factor to 1. Verified over 16s plus drag, resize, and mobile. Fix is
  **uncommitted** in the working tree.

### Remaining

- **Working tree has the 5D-2 lanyard assets back, contradicting 5D-3.**
  `public/lanyard/card.glb` is currently the 2.4 MB branded model and
  `public/lanyard/lanyard.png` (7.5 KB) has reappeared as an untracked file.
  Both are byte-identical (SHA-1 verified) to the Phase 5D-2 versions, and both
  are timestamped after the 5D-3 work — they were restored outside the 5D-3
  changes. Nothing in `src/` references `lanyard.png` any more, and the card
  face is drawn at runtime, so the scene should still render from the larger
  model; but this reverts 5D-3's 2.3 MB asset reduction and needs a deliberate
  decision. Left in place rather than reverted, since it is an application
  asset. Restore the committed state with
  `git checkout HEAD -- public/lanyard/card.glb` and delete the stray
  `lanyard.png` if the 5D-3 reduction is intended.
- **Phase 5D-3 is not merged to `main`.** `main` is still at 5D-2. Work sits on
  `fix/lanyard-5d3-regression`, with `phase-5d-3-lanyard` preserving the
  recovered original commit. Both the 5D-3 work and the strap fix need
  committing and merging.
- **Card face contrast is very low.** `--color-surface` card stock on
  `--color-bg` under `ambientLight intensity={1}` renders the card nearly the
  same value as the page. This is the 5D-3 design as specified, not a bug, but
  it is worth a deliberate legibility decision.
- **Texture disposal under Strict Mode.** The cleanup in `useDrawnTextures`
  disposes `CanvasTexture`s that live materials still reference. Three.js
  re-uploads them, so there is no visual effect — dev-only cost. Not causal to
  the regression; left alone to keep the fix minimal.
- **No Phase 5D-3 doc.** Phases 5C, 5D-1, and 5D-2 each have one; 5D-3 does not.

### Owner input still required (blocks parts of the content sections)

Recorded in code as `pending` arrays on each data export, so nothing is
silently invented. Consolidated here:

- **Research — both entries are venue-only.** ICWT 2026 and ICSMech 2026 are
  confirmed as venues; paper titles, full conference names, topics,
  contributions, submission state, co-authors, and links are all unknown. The
  Research section cannot be built beyond a "venue confirmed" treatment until
  these arrive.
- **Links.** No GitHub repository URL for either project; the melon live
  deployment sits on the client's VPS and may not be public. `ExternalLink.href`
  is `null` with a note rather than a guessed address.
- **Melon project.** No year (only 20–30 June), no model architecture behind
  the TFLite build, no evaluation figures, and the "may the client be named?"
  question was asked but never answered.
- **TB metrics gaps.** ResNet50 accuracy and specificity for all three models
  were left blank. VGG19 records F1 `0.5745` for *both* classes, which cannot
  both be right — the Tuberculosis value is stored as `null` pending
  correction.
- **Location conflict.** `src/app/layout.tsx` metadata says Purwokerto; the
  owner's own input says Cirebon, West Java. `profile.ts` uses Cirebon and
  `site.ts` drops the location from the description until this is settled.
  Root metadata was left untouched — Phase 5E does not change components.
- **Hero mission statement** — still owner-pending from Phase 5D-1.
- **Personal / experience content.** No work experience and no "now" copy are
  documented; `Experience` and `NowItem` remain declared but unpopulated.
- **Production domain.** `site.url` is `null`, so canonical URLs, sitemap,
  robots, and Open Graph images cannot be finalised.

### Future planned work

- ~~Section components for `#work`, `#research`, `#about`, `#contact`.~~ All
  four are built (Phases 5G–5J), as is the real footer.
- Per-page metadata, Open Graph, and structured data beyond the root title and
  description; `site.ts` is the intended source once a domain exists.

---

## 9. Next Phase

**Immediate:** commit the strap fix and land Phase 5D-3 on `main`. The work is
verified but stranded on a side branch, and the original commit was already lost
once to a deleted branch — leaving it unmerged risks repeating that.

**Note on numbering.** An earlier revision of this log reserved 5F for the
Selected Work section. 5F was scoped to Hero & Navigation instead, and
Selected Work became 5G. Both are complete.

**The page is complete.** Phases 5F–5J built every section, and each reads
from `src/data/`. What is left is not more sections.

**Blocking a real launch:**

- **No production domain.** `site.url` is `null`, so canonical URLs, the
  sitemap, robots, and Open Graph cannot be finalised. Root metadata in
  `src/app/layout.tsx` also still says Purwokerto where `profile.ts` says
  Cirebon — that conflict is now visible on the page, since the footer and
  About both render Cirebon.
- **Phase 5D-3 is still not merged to `main`,** and neither is anything
  after it. Every phase from 5D-3 to 5J sits uncommitted or on
  `fix/lanyard-5d3-regression`. See the branch note in §3.
- **`public/lanyard/card.glb` is the 2.4 MB model,** not the committed
  159 KB one — a 2.3 MB regression on a page that is otherwise static
  (§8).

**Debt worth paying in one pass, now that no phase is scoped away from
touching several files:**

- The square-tag class string exists in *three* components
  (`selected-work.tsx`, `research-log.tsx`, `about.tsx`). Phases 5H and 5I
  were each told not to edit the others, so it was duplicated twice rather
  than lifted. One shared module, three call sites.
- **The About statement copy is authored, not owner-supplied.** Its claims
  are all traceable, but `profile.pending` still lists personal copy as
  outstanding. It needs approval or replacement.

**Content still owner-pending** is unchanged and listed in §8: paper details
for both venues, repository and deployment URLs, the melon year and
architecture, the TB metric gaps, graduation year and institution, and any
work-experience entries. Every one of those renders itself the moment it is
supplied — `#research` in particular is built to fill in without a code
change.

Phase 5J was explicitly scoped to stop here.

---

## 10. Content Data Layer (Phase 5E)

### Shape

Four modules under `src/data/`, each exporting one typed constant plus, where
useful, a lookup helper.

| File | Exports | Holds |
|---|---|---|
| `profile.ts` | `profile` | Identity, status, location, roles, trajectory, education, capability groups, contact channels |
| `projects.ts` | `projects`, `getProject()` | Tuberculosis Detection (`01`), Melon Plant Detection (`02`) |
| `research.ts` | `research`, `getResearchEntry()` | ICWT 2026 (`01`), ICSMech 2026 (`02`) |
| `site.ts` | `site`, `NAVIGATION`, `SECTIONS` | Site name, title, description, tagline, locale, nav, section index/labels |

`src/types/index.ts` was expanded to match: `ExternalLink`, `Education`,
`ContactChannel`, `Profile`, `ProjectDataset`, `ClassMetrics`, `ModelResult`,
`Conference`, `ResearchStatus`, `NavItem`, `SectionMeta`, and `SiteConfig` are
new; `Project` and `ResearchEntry` grew from three-field stubs into full
shapes. `CapabilityGroup` is reused unchanged; `Experience` and `NowItem` are
left as declared-but-unused stubs, since no content exists for them.

### Decisions

**Unknown is a value, not an empty string.** Every field that is known to exist
but has no documented value is `null`, and the reason is recorded in a
`pending: string[]` on the same object. That keeps "this project has no GitHub
link" distinguishable from "the URL has not been supplied yet", and it means the
gaps travel with the data instead of living only in this log. No metric, date,
URL, client name, or achievement was inferred.

**Metrics are transcribed, not corrected.** The TB figures are reproduced
exactly as the owner recorded them. Where a value was left blank (ResNet50
accuracy, specificity throughout) the field is `null`. Where the source is
internally inconsistent — VGG19 lists F1 `0.5745` for both classes — the
suspect value is `null` with the conflict noted, rather than being
back-computed from precision and recall.

**Navigation moved into the data layer.** `NAVIGATION` now lives in `site.ts`;
`src/components/layout/nav-links.ts` became a one-line re-export
(`export { NAVIGATION as NAV_LINKS }`). The header and mobile overlay still
import from the path they already used and were not touched, so the single
source of truth from Phase 5C holds while ownership of the labels sits with the
content layer.

**Dataset sizes are recorded despite an earlier deferral.** The owner's original
input said the melon dataset size need not be shown; the Phase 5E brief
confirmed 4,784 TB images and 1,250 melon images as usable. Both are stored.
Whether they are *rendered* is a decision for the Work section; Phase 5F
(Hero & Navigation) does not surface them.

**Contact includes the phone number, marked non-primary.** `ContactChannel`
carries a `primary` flag so the Contact section can publish email, LinkedIn, and
GitHub while treating the phone number as a deliberate opt-in rather than
default page content.

**Sections carry editorial indices.** `SECTIONS` in `site.ts` assigns `00`–`04`
to the hero and the four anchors, extending the index motif the hero already
uses so later sections stay numbered from one source.

### Not done in this phase

No components were modified except `nav-links.ts` (re-export only). No UI, no
new sections, no Lanyard changes, no new dependencies, no route or metadata
changes.

---

## 11. Design System Landmines

Traps that cost real debugging time and will recur in the remaining sections.
Both were found in Phase 5G.

### `inline-block` means something else here

`globals.css` defines `--spacing-block` in `@theme`. Tailwind 4 turns every
`--spacing-*` key into a spacing value usable by the sizing utilities, and
`inline-*` is the utility for `inline-size`. So `inline-block` matches **two**
utilities and the stylesheet contains both:

```css
.inline-block{display:inline-block}
.inline-block{inline-size:var(--spacing-block)}
```

Same specificity, so source order decides — and the sizing rule wins. Anything
with `inline-block` gets pinned to `clamp(2rem, 5vw, 3rem)`: 32px at mobile,
48px at 1440. It looks like a mysterious fixed width that survives every flex
fix you try, because it is not a flex problem.

The same collision is waiting for any other utility whose value name matches a
spacing key. The three keys are `section`, `block`, and `gutter`; `--radius-*`,
`--text-*`, and `--color-*` keys can collide the same way in their own utility
families.

**Use `inline-flex`, or nothing at all** — a flex or grid child is blockified
regardless. Reach for arbitrary values (`py-[var(--spacing-section)]`) rather
than bare utility names when a token is involved, which is what the rest of the
codebase already does.

### `sr-only` escapes `overflow` containers

Tailwind's `sr-only` is `position: absolute`. An absolutely positioned box is
clipped by an ancestor's `overflow` only when that ancestor is in its
containing block chain, so an `sr-only` span inside an `overflow-x-auto`
container with no positioned ancestor resolves against the initial containing
block, escapes the scroll port, and is laid out at its static position. Inside
a wide horizontally scrolled table that position can be hundreds of pixels
past the viewport, and it silently widens `documentElement.scrollWidth`.

The symptom is deceptive: `body.scrollWidth` looks correct, no visible element
overflows, and an element sweep finds nothing, because the sweep quite
reasonably treats the scroll container as a clipping ancestor.

**Any `overflow-*` container that may contain an `sr-only` (or any other
absolutely positioned descendant) needs `relative`.**

### `--color-surface` cannot carry `--color-muted` text

Considered in Phase 5H for a full-bleed band behind `#research`, to separate
it from Selected Work, and rejected on contrast. `--color-muted` (`#726C66`)
is documented at 4.64:1 against `--color-bg`; against `--color-surface`
(`#EDE9E1`) it falls to **4.28:1**, under the 4.5:1 AA floor — and muted is
exactly what the 11px tracked mono labels use. `--color-secondary`
(`#6B6560`) clears it at 4.74:1.

So a surface band is not a drop-in: it forces that section onto a different
token for every small label, which is both inconsistent and easy to get
wrong later. If a section ever does need one, swap muted → secondary
throughout it and record the exception. Research instead differentiates
itself by form — a sparse ledger against Selected Work's dense case
studies — which needs no colour at all.

### How to catch these

Neither shows up in a screenshot at one width, and neither fails lint, tsc, or
the build. What caught them was measuring `documentElement.scrollWidth` against
`clientWidth` at every target width, and — once a number looked wrong —
bisecting with live DOM experiments rather than reading the diff. Keep doing
that for each new section.
