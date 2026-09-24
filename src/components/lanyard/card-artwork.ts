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

   The owner's portrait photograph is the one raster asset the card draws. It
   is loaded once, printed across the top of the front face, and the card
   repaints when it arrives, the same mechanism the webfonts already use. If
   it never arrives the window stays an empty print slot.
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
    border: read("--color-border", FALLBACK_TOKENS.border),
    accent: read("--color-accent", FALLBACK_TOKENS.accent),
    display: read("--font-display", FALLBACK_TOKENS.display),
    sans: read("--font-sans", FALLBACK_TOKENS.sans),
    mono: read("--font-mono", FALLBACK_TOKENS.mono),
  };
}

/* --- portrait -------------------------------------------------------------
   The owner's portrait photograph, the same file `/about` shows. It is drawn
   as a rectangular print across the top of the card: scaled to cover the
   window, never stretched, so the window crops and the ratio stays the file's. */

const PHOTO_SRC = "/images/profile/alif-portrait.jpg";

let photo: HTMLImageElement | null = null;
let photoLoad: Promise<void> | null = null;

/**
 * Resolves when the portrait is decoded, or immediately when it cannot be:
 * a missing or failed image is not an error the card should surface, so the
 * promise always resolves and `photo` simply stays null.
 */
export function loadCardPhoto(): Promise<void> {
  if (photoLoad) return photoLoad;
  photoLoad = new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      photo = image;
      resolve();
    };
    image.onerror = () => resolve();
    image.src = PHOTO_SRC;
  });
  return photoLoad;
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

/**
 * Breaks each term onto as few lines as fit `maxWidth`, at the current font.
 * A term short enough for the column is never touched, so the two-line focus
 * block the card had before the portrait is exactly what a wide column still
 * produces.
 */
function wrapTracked(
  ctx: CanvasRenderingContext2D,
  terms: readonly string[],
  tracking: number,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const term of terms) {
    if (trackedWidth(ctx, term, tracking) <= maxWidth) {
      lines.push(term);
      continue;
    }
    let line = "";
    for (const word of term.split(" ")) {
      const next = line.length > 0 ? `${line} ${word}` : word;
      if (line.length > 0 && trackedWidth(ctx, next, tracking) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line.length > 0) lines.push(line);
  }
  return lines;
}

/**
 * One line when it fits; otherwise the two-line break with the most even
 * lines, never leaving a separator at the end or start of a line. Falls back
 * to greedy wrapping when no two-line break fits.
 */
function balanceTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number,
  maxWidth: number,
): string[] {
  if (trackedWidth(ctx, text, tracking) <= maxWidth) return [text];
  const words = text.split(" ");
  let best: string[] | null = null;
  let bestWidth = Infinity;
  for (let i = 1; i < words.length; i += 1) {
    if (words[i - 1] === FOCUS_SEPARATOR.trim() || words[i] === FOCUS_SEPARATOR.trim()) continue;
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const width = Math.max(...lines.map((line) => trackedWidth(ctx, line, tracking)));
    if (width <= maxWidth && width < bestWidth) {
      best = lines;
      bestWidth = width;
    }
  }
  return best ?? wrapTracked(ctx, [text], tracking, maxWidth);
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

/** Focus terms, joined with the badge's bullet and wrapped, never reworded. */
const FOCUS_TERMS = ["COMPUTER VISION", "MACHINE LEARNING", "RESEARCH"] as const;
const FOCUS_SEPARATOR = " • ";

/**
 * Front-face composition: a printed ID badge. The photograph is a rectangular
 * print across the top two thirds of the card; the cream information panel
 * under it carries the type in one column.
 *
 * Every value is a fraction of the front face's height (horizontal measures
 * of its width), so the whole face scales with the texture. The type block
 * flows down from the top of the panel, so a role or focus line that has to
 * wrap pushes what follows down rather than colliding with it; the status row
 * is pinned to the bottom edge, where a badge prints it.
 */
const FRONT = {
  /** Side margin of the photograph, as a fraction of face width. */
  photoInset: 0.045,
  /** Photograph window, top and bottom edge. The top clears the clamp's jaw. */
  photoTop: 0.035,
  photoBottom: 0.69,
  /** Left and right margin of the panel type, as a fraction of face width. */
  padX: 0.085,
  nameSize: 0.056,
  nameGap: 0.066,
  fullNameSize: 0.019,
  fullNameGap: 0.03,
  ruleGap: 0.02,
  roleSize: 0.025,
  roleGap: 0.035,
  roleLeading: 0.03,
  focusSize: 0.019,
  focusGap: 0.03,
  focusLeading: 0.024,
  footerRule: 0.925,
  footerSize: 0.019,
  footerBaseline: 0.958,
} as const;

/**
 * Where the face sits in the photograph file (fractions of its width and
 * height), where it should land in the window, and how far past a plain
 * cover fit the print is enlarged. The window only ever crops: the scale is
 * uniform and the print always covers the window edge to edge.
 */
const FACE_X = 0.49;
const FACE_Y = 0.42;
const FACE_TARGET_Y = 0.4;
const PHOTO_ZOOM = 1.6;

function drawHairlineBox(ctx: CanvasRenderingContext2D, t: Tokens, box: Rect): void {
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = t.secondary;
  ctx.lineWidth = Math.max(1, box.h * 0.004);
  ctx.strokeRect(box.x, box.y, box.w, box.h);
  ctx.restore();
}

/** The photograph, cover-fitted and clipped to its window, with a hairline. */
function drawPortrait(
  ctx: CanvasRenderingContext2D,
  t: Tokens,
  window: Rect,
  image: HTMLImageElement,
): void {
  const scale =
    Math.max(window.w / image.naturalWidth, window.h / image.naturalHeight) * PHOTO_ZOOM;
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const x = clamp(
    window.x + window.w / 2 - FACE_X * drawW,
    window.x + window.w - drawW,
    window.x,
  );
  const y = clamp(
    window.y + window.h * FACE_TARGET_Y - FACE_Y * drawH,
    window.y + window.h - drawH,
    window.y,
  );

  ctx.save();
  ctx.beginPath();
  ctx.rect(window.x, window.y, window.w, window.h);
  ctx.clip();
  ctx.drawImage(image, x, y, drawW, drawH);
  ctx.restore();

  drawHairlineBox(ctx, t, window);
}

/**
 * Front of the credential, top to bottom: the photograph, then on the cream
 * panel the name in the display face, the full name, a hairline, the role,
 * the focus line, and the status row under a second hairline.
 *
 * Everything is set in `--color-ink` or `--color-secondary`. `--color-muted`
 * is deliberately not used here: it measures 4.28:1 on `--color-surface`,
 * under the 4.5:1 AA floor (see the design-system note in the log), and the
 * card is rendered small enough that anything borderline reads as blank.
 */
function drawFront(ctx: CanvasRenderingContext2D, t: Tokens): void {
  const r = uvRect(FRONT_UV);
  const u = r.h;
  const left = r.x + r.w * FRONT.padX;
  const right = r.x + r.w - r.w * FRONT.padX;
  const contentW = right - left;
  const hairline = Math.max(1, u * 0.0018);

  // The printed face is cream; the stock shows only on the model's edges.
  ctx.fillStyle = t.bg;
  ctx.fillRect(r.x, r.y, r.w, r.h);

  const inset = r.w * FRONT.photoInset;
  const window: Rect = {
    x: r.x + inset,
    y: r.y + u * FRONT.photoTop,
    w: r.w - inset * 2,
    h: u * (FRONT.photoBottom - FRONT.photoTop),
  };
  const portrait =
    photo && photo.naturalWidth > 0 && photo.naturalHeight > 0 ? photo : null;
  if (portrait) {
    drawPortrait(ctx, t, window, portrait);
  } else {
    // No photograph: the window stays an empty print slot in card stock.
    ctx.fillStyle = t.surface;
    ctx.fillRect(window.x, window.y, window.w, window.h);
    drawHairlineBox(ctx, t, window);
  }

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  let y = r.y + u * (FRONT.photoBottom + FRONT.nameGap);

  // Name: the display face at its natural setting, the primary line.
  const nameSize = fitSize(ctx, "Alif Reezi", t.display, "500", u * FRONT.nameSize, 0, contentW);
  ctx.font = `500 ${nameSize}px ${t.display}`;
  ctx.fillStyle = t.ink;
  ctx.fillText("Alif Reezi", left, y);

  // Full name: small, uppercase, tracked open.
  y += u * FRONT.fullNameGap;
  const fullName = "NASHIRUDDIN ALIF ALVAREEZI";
  const fullNameSize = fitSize(ctx, fullName, t.sans, "500", u * FRONT.fullNameSize, 0.16, contentW);
  ctx.font = `500 ${fullNameSize}px ${t.sans}`;
  ctx.fillStyle = t.secondary;
  drawTracked(ctx, fullName, left, y, fullNameSize * 0.16);

  y += u * FRONT.ruleGap;
  ctx.fillStyle = t.secondary;
  ctx.fillRect(left, y, contentW, hairline);

  // Role: ink, one line when it fits, wrapped at a word when it does not.
  y += u * FRONT.roleGap;
  const roleSize = u * FRONT.roleSize;
  const roleTracking = roleSize * 0.08;
  ctx.font = `500 ${roleSize}px ${t.sans}`;
  ctx.fillStyle = t.ink;
  const roleLines = wrapTracked(ctx, ["AI / MACHINE LEARNING ENGINEER"], roleTracking, contentW);
  roleLines.forEach((line, index) => {
    drawTracked(ctx, line, left, y + index * u * FRONT.roleLeading, roleTracking);
  });
  y += (roleLines.length - 1) * u * FRONT.roleLeading;

  // Focus: mono metadata, wrapped at a word like a printed line.
  y += u * FRONT.focusGap;
  const focusSize = u * FRONT.focusSize;
  const focusTracking = focusSize * 0.12;
  ctx.font = `400 ${focusSize}px ${t.mono}`;
  ctx.fillStyle = t.ink;
  const focusLines = balanceTracked(
    ctx,
    FOCUS_TERMS.join(FOCUS_SEPARATOR),
    focusTracking,
    contentW,
  );
  focusLines.forEach((line, index) => {
    drawTracked(ctx, line, left, y + index * u * FRONT.focusLeading, focusTracking);
  });

  // Status row, pinned to the bottom of the badge.
  ctx.fillStyle = t.secondary;
  ctx.fillRect(left, r.y + u * FRONT.footerRule, contentW, hairline);

  const footSize = u * FRONT.footerSize;
  const footTracking = footSize * 0.13;
  ctx.font = `400 ${footSize}px ${t.mono}`;
  ctx.fillStyle = t.secondary;
  drawTracked(ctx, "FRESH GRADUATE", left, r.y + u * FRONT.footerBaseline, footTracking);
  drawTracked(ctx, "2026", right, r.y + u * FRONT.footerBaseline, footTracking, "right");
}

/** Back of the credential: card stock, one hairline, the full legal name. */
function drawBack(ctx: CanvasRenderingContext2D, t: Tokens): void {
  const r = uvRect(BACK_UV);
  const padX = r.w * 0.115;
  const left = r.x + padX;
  const contentW = r.w - padX * 2;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  ctx.fillStyle = t.secondary;
  ctx.fillRect(left, r.y + r.h * 0.852, contentW, Math.max(1, r.h * 0.0018));

  const size = r.h * 0.031;
  const tracking = size * 0.13;
  ctx.font = `400 ${size}px ${t.mono}`;
  ctx.fillStyle = t.secondary;
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

  // Plain webbing with two hairline stripes near the edges. Symmetric, so it
  // tiles seamlessly along the strap at any repeat. Secondary rather than ink:
  // the strap is a thin shape, but at full ink weight it read darker than the
  // card it carries, which put the emphasis in the wrong place.
  ctx.clearRect(0, 0, BAND_W, BAND_H);
  ctx.fillStyle = t.secondary;
  ctx.fillRect(0, 0, BAND_W, BAND_H);

  ctx.globalAlpha = 0.32;
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
