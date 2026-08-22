import * as THREE from "three";

/* ---------------------------------------------------------------------------
   CARD ARTWORK (Phase 5D-3)

   The card.glb model ships with a branded base-colour texture. Rather than
   swapping in another image asset, the card face is drawn at runtime on a 2D
   canvas using the site's own design tokens and webfonts, then handed to
   Three.js as a CanvasTexture. That keeps the credential in sync with the
   palette in globals.css and adds no binary assets to the bundle.

   UV footprints below were measured from card.glb's TEXCOORD_0 accessor:
   the front face occupies the left half of the base texture, the back face
   the right half. Both read top-left origin (glTF convention), so the
   textures are created with flipY = false.
   --------------------------------------------------------------------------- */

const FRONT_UV = { u0: 0.011, u1: 0.4888, v0: 0.0106, v1: 0.7485 };
const BACK_UV = { u0: 0.5116, u1: 0.994, v0: 0.0087, v1: 0.7508 };

/* Sized so one texel is square on the physical card face (the front UV island
   is slightly narrower than the geometry it covers). */
const TEXTURE_W = 1600;
const TEXTURE_H = 1484;

const BAND_W = 512;
const BAND_H = 128;

interface Tokens {
  bg: string;
  surface: string;
  ink: string;
  secondary: string;
  muted: string;
  border: string;
  accent: string;
  display: string;
  sans: string;
  mono: string;
}

const FALLBACK_TOKENS: Tokens = {
  bg: "#F6F2EB",
  surface: "#EDE9E1",
  ink: "#1B1815",
  secondary: "#6B6560",
  muted: "#726C66",
  border: "#D5D0C8",
  accent: "#9E4F35",
  display: "Georgia, serif",
  sans: "system-ui, sans-serif",
  mono: "ui-monospace, monospace",
};

function readTokens(): Tokens {
  if (typeof window === "undefined") return FALLBACK_TOKENS;
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string): string => {
    const value = style.getPropertyValue(name).trim();
    return value.length > 0 ? value : fallback;
  };
  return {
    bg: read("--color-bg", FALLBACK_TOKENS.bg),
    surface: read("--color-surface", FALLBACK_TOKENS.surface),
    ink: read("--color-ink", FALLBACK_TOKENS.ink),
    secondary: read("--color-secondary", FALLBACK_TOKENS.secondary),
    muted: read("--color-muted", FALLBACK_TOKENS.muted),
    border: read("--color-border", FALLBACK_TOKENS.border),
    accent: read("--color-accent", FALLBACK_TOKENS.accent),
    display: read("--font-display", FALLBACK_TOKENS.display),
    sans: read("--font-sans", FALLBACK_TOKENS.sans),
    mono: read("--font-mono", FALLBACK_TOKENS.mono),
  };
}

/* --- text helpers ---------------------------------------------------------
   Letter-spacing is applied glyph by glyph rather than via ctx.letterSpacing
   so tracking is identical in every browser and can be measured for fitting. */

function trackedWidth(ctx: CanvasRenderingContext2D, text: string, tracking: number): number {
  const chars = Array.from(text);
  if (chars.length === 0) return 0;
  let width = -tracking;
  for (const char of chars) width += ctx.measureText(char).width + tracking;
  return width;
}

type Align = "left" | "right";

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: Align = "left",
): void {
  const chars = Array.from(text);
  let cursor = align === "right" ? x - trackedWidth(ctx, text, tracking) : x;
  for (const char of chars) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

/** Shrinks `size` until the tracked string fits `maxWidth`. */
function fitSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  size: number,
  trackingEm: number,
  maxWidth: number,
): number {
  let current = size;
  for (let i = 0; i < 24; i += 1) {
    ctx.font = `${weight} ${current}px ${family}`;
    if (trackedWidth(ctx, text, current * trackingEm) <= maxWidth) break;
    current *= 0.96;
  }
  return current;
}

/* --- card faces ----------------------------------------------------------- */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function uvRect(uv: typeof FRONT_UV): Rect {
  return {
    x: uv.u0 * TEXTURE_W,
    y: uv.v0 * TEXTURE_H,
    w: (uv.u1 - uv.u0) * TEXTURE_W,
    h: (uv.v1 - uv.v0) * TEXTURE_H,
  };
}

/**
 * Front of the credential. Composition is anchored on a single left margin —
 * name, a short terracotta rule, role, focus, then a footer row under a
 * hairline. The top ~14% stays clear because the model's metal clamp sits
 * over it.
 */
function drawFront(ctx: CanvasRenderingContext2D, t: Tokens): void {
  const r = uvRect(FRONT_UV);
  const padX = r.w * 0.115;
  const left = r.x + padX;
  const right = r.x + r.w - padX;
  const contentW = right - left;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Name — display face, tracked slightly open so it reads as a credential
  // rather than a repeat of the hero headline.
  const nameTracking = 0.015;
  const nameSize = fitSize(ctx, "ALIF REEZI", t.display, "600", r.h * 0.092, nameTracking, contentW);
  ctx.font = `600 ${nameSize}px ${t.display}`;
  ctx.fillStyle = t.ink;
  drawTracked(ctx, "ALIF REEZI", left, r.y + r.h * 0.215, nameSize * nameTracking);

  // The one accent mark on the card: the same short rule the hero uses.
  ctx.fillStyle = t.accent;
  ctx.fillRect(left, r.y + r.h * 0.259, contentW * 0.19, Math.max(2, r.h * 0.0055));

  // Role — fitted so the long first line can never run past the margin
  const roleSize = fitSize(ctx, "AI / MACHINE LEARNING", t.sans, "500", r.h * 0.04, 0.09, contentW);
  const roleTracking = roleSize * 0.09;
  ctx.font = `500 ${roleSize}px ${t.sans}`;
  ctx.fillStyle = t.secondary;
  drawTracked(ctx, "AI / MACHINE LEARNING", left, r.y + r.h * 0.358, roleTracking);
  drawTracked(ctx, "ENGINEER", left, r.y + r.h * 0.409, roleTracking);

  // Focus — mono metadata, the same register as the hero's focus list
  const focusSize = r.h * 0.034;
  const focusTracking = focusSize * 0.13;
  ctx.font = `400 ${focusSize}px ${t.mono}`;
  ctx.fillStyle = t.muted;
  drawTracked(ctx, "COMPUTER VISION", left, r.y + r.h * 0.578, focusTracking);
  drawTracked(ctx, "RESEARCH", left, r.y + r.h * 0.629, focusTracking);

  // Footer
  ctx.fillStyle = t.border;
  ctx.fillRect(left, r.y + r.h * 0.852, contentW, Math.max(1, r.h * 0.0014));

  const footSize = r.h * 0.029;
  const footTracking = footSize * 0.13;
  ctx.font = `400 ${footSize}px ${t.mono}`;
  ctx.fillStyle = t.muted;
  drawTracked(ctx, "FRESH GRADUATE", left, r.y + r.h * 0.918, footTracking);
  drawTracked(ctx, "2026", right, r.y + r.h * 0.918, footTracking, "right");
}

/** Back of the credential: card stock, one hairline, the full legal name. */
function drawBack(ctx: CanvasRenderingContext2D, t: Tokens): void {
  const r = uvRect(BACK_UV);
  const padX = r.w * 0.115;
  const left = r.x + padX;
  const contentW = r.w - padX * 2;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  ctx.fillStyle = t.border;
  ctx.fillRect(left, r.y + r.h * 0.852, contentW, Math.max(1, r.h * 0.0014));

  const size = r.h * 0.029;
  const tracking = size * 0.13;
  ctx.font = `400 ${size}px ${t.mono}`;
  ctx.fillStyle = t.muted;
  drawTracked(ctx, "NASHIRUDDIN ALIF ALVAREEZI", left, r.y + r.h * 0.918, tracking);
}

function paintCard(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const t = readTokens();

  // Card stock fills the whole sheet so the model's edge slivers pick up the
  // same colour as the faces.
  ctx.clearRect(0, 0, TEXTURE_W, TEXTURE_H);
  ctx.fillStyle = t.surface;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

  drawFront(ctx, t);
  drawBack(ctx, t);
}

function paintBand(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const t = readTokens();

  // Plain ink webbing with two hairline stripes near the edges. Symmetric, so
  // it tiles seamlessly along the strap at any repeat.
  ctx.clearRect(0, 0, BAND_W, BAND_H);
  ctx.fillStyle = t.ink;
  ctx.fillRect(0, 0, BAND_W, BAND_H);

  ctx.globalAlpha = 0.42;
  ctx.fillStyle = t.border;
  const stripe = Math.max(1, BAND_H * 0.02);
  ctx.fillRect(0, BAND_H * 0.26, BAND_W, stripe);
  ctx.fillRect(0, BAND_H * 0.74 - stripe, BAND_W, stripe);
  ctx.globalAlpha = 1;
}

/* --- texture factories ---------------------------------------------------- */

export interface DrawnTexture {
  texture: THREE.CanvasTexture;
  /** Re-runs the 2D drawing (used once the webfonts have loaded). */
  repaint: () => void;
}

function createDrawnTexture(
  width: number,
  height: number,
  paint: (canvas: HTMLCanvasElement) => void,
  flipY: boolean,
): DrawnTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  paint(canvas);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = flipY;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;

  return {
    texture,
    repaint: () => {
      paint(canvas);
      texture.needsUpdate = true;
    },
  };
}

/** Base-colour texture for the card mesh, matched to card.glb's UV islands. */
export function createCardTexture(): DrawnTexture {
  return createDrawnTexture(TEXTURE_W, TEXTURE_H, paintCard, false);
}

/** Strap texture for the meshline band. */
export function createBandTexture(): DrawnTexture {
  return createDrawnTexture(BAND_W, BAND_H, paintBand, true);
}
