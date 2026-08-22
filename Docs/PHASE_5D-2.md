# Phase 5D-2 — Lanyard Integration

**Status:** Complete and verified
**Date:** August 2026
**Depends on:** Phase 5D-1 (Hero Composition)

---

## Objective

Integrate the React Bits 3D Lanyard — a physics-driven credential card — into
the Hero's reserved visual zone, without compromising page load, bundle size,
or the Server Component architecture.

---

## Dependencies added

Installed at versions pre-verified compatible with React 19.2.8:

| Package | Version | Purpose |
|---|---|---|
| `three` | 0.185.1 | 3D rendering core |
| `@react-three/fiber` | 9.7.0 | React renderer for Three.js |
| `@react-three/drei` | 10.7.8 | Helpers (useGLTF, useTexture, Environment) |
| `@react-three/rapier` | 2.2.0 | Physics (rope + spherical joints) |
| `meshline` | 3.x | The lanyard band geometry/material |

Installed cleanly with **0 vulnerabilities** and no peer-dependency conflicts —
no `--force` or `--legacy-peer-deps`. React remained at 19.2.8.

Note: React Bits is not an npm package. The component source is copied into the
project. The version installed here (from the official TS+Tailwind variant)
already includes `'use client'` and customization props.

---

## Assets

The 3D model and band texture live in `public/lanyard/`:

| File | Size | Type |
|---|---|---|
| `card.glb` | 2.4 MB | glTF binary 3D model (card, clip, clamp) |
| `lanyard.png` | 7.4 KB | Band texture (1025×250 PNG) |

Downloaded directly from the GitHub repository, not via the jsrepo CLI — a
known bug corrupts the binary assets during CLI installation. File integrity
was verified (type and byte length) after download.

---

## Architecture

Three layers, each with one responsibility:
Hero (Server Component)
└── LanyardWrapper (Client) ← wrapper.tsx
├── LanyardErrorBoundary ← catches WebGL/Three failures
└── LanyardCanvas (dynamic) ← canvas.tsx, ssr: false
└── Three.js + physics scene


### `lanyard-canvas.tsx` (client)
The adapted React Bits source: canvas, lighting environment, physics world,
rope-jointed band, and the draggable card. Two Next.js adaptations:
- Asset imports replaced with public paths (`/lanyard/card.glb`,
  `/lanyard/lanyard.png`).
- Container sizing changed from `h-screen` to `h-full w-full` so it fits the
  hero slot rather than the viewport.

### `lanyard-wrapper.tsx` (client)
- Loads the canvas via `next/dynamic` with `ssr: false` — Three.js never runs
  on the server.
- Provides a quiet fallback (thin rule + terracotta dot).
- Wraps the canvas in an error boundary so a WebGL failure degrades gracefully.
- Passes camera configuration (`position`, `fov`) to size the card.

### `hero.tsx` (remains a Server Component)
Renders `<LanyardWrapper />` in the right column. The client boundary begins
inside the wrapper, so the Hero and page stay server-rendered.

---

## Bundle isolation (verified)

- Three.js lives in a **separate async chunk**, loaded only after hydration.
- The prerendered homepage HTML does **not** reference the Three.js chunk.
- The homepage renders fully (with the fallback) before any 3D code loads.

Confirmed by inspecting build output: the chunk containing `WebGLRenderer` is
absent from the homepage's initial HTML and initial JS.

---

## Card sizing

Size is controlled by the camera, passed from the wrapper:

- `position={[0, 0, z]}` — smaller `z` = camera closer = larger card.
- `fov={n}` — smaller `fov` = zoomed in = larger card.

Default React Bits values (`z: 30`, `fov: 20`) rendered the card too small in
the hero slot. Set to `z: 20`, `fov: 20` to fill the slot well. Adjust only
these two values in `lanyard-wrapper.tsx` — no canvas or physics change needed.

---

## Drag area

The physics allows the card to be dragged, but the draggable region is bounded
by the canvas element. With the canvas sized exactly to the narrow hero column,
the card could only move a short distance before hitting the edge.

To expand it, the canvas is layered as an absolutely-positioned element that is
larger than its column:
- The column keeps a stable `min-height` so text layout never shifts.
- The canvas overflows the column vertically (`-inset-y-16`) and to the right
  (`-right-16`) on desktop, while its left edge stays at the column boundary
  (`left-0`) so it never covers the hero text.
- `pointer-events` are scoped so only the canvas layer is interactive.

Result: the card can be dragged much further — up, down, and to the right —
without the empty canvas area being visible (the canvas is transparent) and
without interfering with the hero text.

---

## Fallback and error handling

The fallback is not a spinner or gray box — it reuses the Hero's editorial
language (thin vertical rule + terracotta dot). It appears:
- Before the dynamic import finishes.
- If WebGL is unavailable.
- If the scene throws (caught by the error boundary).

---

## Accessibility

- The Lanyard is decorative: its container is `aria-hidden="true"`.
- All identity it visually implies already exists as real text in the Hero.
- The drag interaction is pointer-based enrichment, not a required control.

---

## Verification

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass (2 static routes) |
| Server components | Hero + page remain server-rendered |
| Client chunks | mobile-nav, lanyard-wrapper, lanyard-canvas only |
| Three.js isolation | Absent from homepage initial HTML/JS |

---

## Known console messages (harmless)

In development, the Three.js runtime logs two deprecation notices:
- `THREE.Clock: deprecated, use THREE.Timer`
- `using deprecated parameters for the initialization function`

These originate in the React Bits / R3F stack, not our code. They do not affect
functionality or the production build.

---

## Deferred

- **Custom card texture.** The card shows the default React Bits texture, not a
  personalized "Alif Reezi" credential. Replacing it (via `frontImage` /
  `backImage` props or editing the GLB atlas) is an optional follow-up.
- **Reduced-motion behavior.** A future refinement could render the static
  fallback instead of the physics canvas when `prefers-reduced-motion` is set.