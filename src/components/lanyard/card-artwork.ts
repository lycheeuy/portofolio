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

   The owner's cut-out portrait is the one raster asset the card draws. It is
   loaded once, drawn into the reserved column on the front face, and the card
   repaints when it arrives, the same mechanism the webfonts already use. If
   it never arrives the card paints exactly as it did before it existed.
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
   The asset is a background-removed cut-out, already trimmed to the figure, so
   what is drawn is the person and nothing else: the transparency around him
   becomes the ground of the portrait window on the card. He is scaled from the
   window's width alone, so the ratio is always the file's: the window crops,
   it never squeezes.                                                          */

const PHOTO_SRC = "/images/profile/alif-lanyard.png";

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

/** Focus terms, in the order the hero lists them. Wrapped, never reworded. */
const FOCUS_TERMS = ["COMPUTER VISION", "RESEARCH"] as const;

/** Separator when the focus terms fit on one line, as the hero sets them. */
const FOCUS_SEPARATOR = " · ";

/**
 * Front-face composition.
 *
 * Every value is a fraction of the front face's height, and every horizontal
 * measure a fraction of its content width, so the whole face scales with the
 * texture. Two layouts, chosen by whether the portrait decoded:
 *
 * `WITH_PHOTO` is the card as it is meant to be read: the portrait takes the
 * top half, and the type is a caption block under it: name, accent rule, role,
 * one line of focus, then the status row. `TEXT_ONLY` is the fallback, and its
 * numbers are the ones the card used before it had a photograph at all, so a
 * failed image leaves a composition that was designed rather than a gap.
 *
 * `focusCentre` is the middle of the focus block rather than its first
 * baseline: the terms set on one line when they fit and stack when they do
 * not, and centring keeps the block in the same place either way.
 */
interface FrontLayout {
  /** Portrait window, or null for the text-only fallback. */
  photo: { top: number; height: number } | null;
  /** Hairline above the name. */
  rule: number;
  nameSize: number;
  nameBaseline: number;
  accentBaseline: number;
  roleSize: number;
  roleBaselines: readonly [number, number];
  focusSize: number;
  focusCentre: number;
  focusLeading: number;
  footerRule: number;
  footerSize: number;
  footerBaseline: number;
}

const WITH_PHOTO: FrontLayout = {
  photo: { top: 0.16, height: 0.45 },
  rule: 0.652,
  nameSize: 0.068,
  nameBaseline: 0.722,
  accentBaseline: 0.752,
  roleSize: 0.038,
  roleBaselines: [0.806, 0.851],
  focusSize: 0.029,
  focusCentre: 0.907,
  focusLeading: 0.04,
  footerRule: 0.936,
  footerSize: 0.028,
  footerBaseline: 0.97,
};

const TEXT_ONLY: FrontLayout = {
  photo: null,
  rule: 0.168,
  nameSize: 0.105,
  nameBaseline: 0.278,
  accentBaseline: 0.321,
  roleSize: 0.052,
  roleBaselines: [0.437, 0.503],
  focusSize: 0.045,
  focusCentre: 0.6695,
  focusLeading: 0.063,
  footerRule: 0.852,
  footerSize: 0.031,
  footerBaseline: 0.918,
};

/**
 * How wide the figure is drawn inside the portrait window, as a fraction of
 * it, and how far its head sits below the window's top edge.
 *
 * The asset is a standing figure trimmed to its own outline: drawn whole it
 * would be a thumbnail on a card this shape, and stretched to fill the window
 * it would not be him any more. So it is enlarged past the window instead and
 * the window clips it (the head-and-shoulders crop an ID photograph has),
 * with the scale taken from the width, so the ratio is the file's throughout.
 */
const FIGURE_WIDTH = 0.84;
const FIGURE_TOP = 0.04;

/**
 * The portrait window: a plate of page cream on the card stock, the figure
 * enlarged inside it and clipped to its edges, and a hairline round it.
 *
 * The plate is what makes the cut-out read as a photograph printed on the
 * card rather than a sticker on it; the transparency around the figure
 * becomes the photograph's own ground, one step lighter than the stock.
 */
function drawPortrait(
  ctx: CanvasRenderingContext2D,
  t: Tokens,
  window: Rect,
  image: HTMLImageElement,
): void {
  ctx.fillStyle = t.bg;
  ctx.fillRect(window.x, window.y, window.w, window.h);

  const scale = (window.w * FIGURE_WIDTH) / image.naturalWidth;
  const figureW = image.naturalWidth * scale;
  const figureH = image.naturalHeight * scale;

  ctx.save();
  ctx.beginPath();
  ctx.rect(window.x, window.y, window.w, window.h);
  ctx.clip();
  ctx.drawImage(
    image,
    window.x + (window.w - figureW) / 2,
    window.y + window.h * FIGURE_TOP,
    figureW,
    figureH,
  );
  ctx.restore();

  // Hairline, at the weight the rules use and a third of their tone: enough to
  // close the plate, not enough to read as a box drawn round a face.
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = t.secondary;
  ctx.lineWidth = Math.max(1, window.h * 0.004);
  ctx.strokeRect(window.x, window.y, window.w, window.h);
  ctx.restore();
}

/**
 * Front of the credential: the portrait, then the type as its caption:
 * a hairline, the name, a short terracotta rule, the role, one line of focus,
 * and the status row under a second hairline. Everything is anchored on a
 * single left margin, and reads top to bottom in that order.
 *
 * The photograph carries the card and the type is set to be read under it, at
 * roughly half the size it took when it was the whole composition. The top
 * ~14% stays clear because the model's metal clamp sits over it, so the
 * portrait starts just below that line.
 *
 * Everything is set in `--color-ink` or `--color-secondary`. `--color-muted`
 * is deliberately not used here: it measures 4.28:1 on `--color-surface`,
 * under the 4.5:1 AA floor (see the design-system note in the log), and the
 * card is rendered small enough that anything borderline reads as blank.
 */
function drawFront(ctx: CanvasRenderingContext2D, t: Tokens): void {
  const r = uvRect(FRONT_UV);
  const padX = r.w * 0.1;
  const left = r.x + padX;
  const right = r.x + r.w - padX;
  const contentW = right - left;

  const portrait =
    photo && photo.naturalWidth > 0 && photo.naturalHeight > 0 ? photo : null;
  const layout = portrait ? WITH_PHOTO : TEXT_ONLY;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (portrait && layout.photo) {
    drawPortrait(
      ctx,
      t,
      {
        x: left,
        y: r.y + r.h * layout.photo.top,
        w: contentW,
        h: r.h * layout.photo.height,
      },
      portrait,
    );
  }

  // Hairline over the type, paired with the footer rule below it to frame the
  // block. Both are secondary, not border: the card renders at roughly four
  // fifths of its albedo, and a page-weight hairline measured at that exposure
  // is simply not there.
  ctx.fillStyle = t.secondary;
  ctx.fillRect(left, r.y + r.h * layout.rule, contentW, Math.max(1, r.h * 0.0018));

  // Name: display face, tracked slightly open so it reads as a credential
  // rather than a repeat of the hero headline.
  const nameTracking = 0.015;
  const nameSize = fitSize(
    ctx,
    "ALIF REEZI",
    t.display,
    "600",
    r.h * layout.nameSize,
    nameTracking,
    contentW,
  );
  ctx.font = `600 ${nameSize}px ${t.display}`;
  ctx.fillStyle = t.ink;
  drawTracked(ctx, "ALIF REEZI", left, r.y + r.h * layout.nameBaseline, nameSize * nameTracking);

  // The one accent mark on the card: the same short rule the hero uses.
  ctx.fillStyle = t.accent;
  ctx.fillRect(
    left,
    r.y + r.h * layout.accentBaseline,
    contentW * 0.19,
    Math.max(2, r.h * 0.006),
  );

  // Role: ink, not secondary. At the size the card renders on screen this is
  // the line most likely to disappear, so it takes the full-contrast tone and
  // is fitted so the long first line can never run past the margin.
  const roleSize = fitSize(
    ctx,
    "AI / MACHINE LEARNING",
    t.sans,
    "500",
    r.h * layout.roleSize,
    0.09,
    contentW,
  );
  const roleTracking = roleSize * 0.09;
  ctx.font = `500 ${roleSize}px ${t.sans}`;
  ctx.fillStyle = t.ink;
  drawTracked(ctx, "AI / MACHINE LEARNING", left, r.y + r.h * layout.roleBaselines[0], roleTracking);
  drawTracked(ctx, "ENGINEER", left, r.y + r.h * layout.roleBaselines[1], roleTracking);

  // Focus: mono metadata, the same register as the hero's focus list. It
  // stays a step under the role through size and family, not tone: this is the
  // smallest type that still has to be read, and at the size the card occupies
  // on screen a lighter grey is the difference between metadata and smudge.
  //
  // One line with the hero's separator when the terms fit, stacked when they
  // do not. The block is centred rather than hung from its first baseline, so
  // either shape sits in the same place.
  const focusSize = r.h * layout.focusSize;
  const focusTracking = focusSize * 0.13;
  ctx.font = `400 ${focusSize}px ${t.mono}`;
  ctx.fillStyle = t.ink;

  const joined = FOCUS_TERMS.join(FOCUS_SEPARATOR);
  const focusLines =
    trackedWidth(ctx, joined, focusTracking) <= contentW
      ? [joined]
      : wrapTracked(ctx, FOCUS_TERMS, focusTracking, contentW);
  const focusTop =
    layout.focusCentre - ((focusLines.length - 1) * layout.focusLeading) / 2;
  focusLines.forEach((line, index) => {
    drawTracked(
      ctx,
      line,
      left,
      r.y + r.h * (focusTop + index * layout.focusLeading),
      focusTracking,
    );
  });

  // Footer
  ctx.fillStyle = t.secondary;
  ctx.fillRect(left, r.y + r.h * layout.footerRule, contentW, Math.max(1, r.h * 0.0018));

  const footSize = r.h * layout.footerSize;
  const footTracking = footSize * 0.13;
  ctx.font = `400 ${footSize}px ${t.mono}`;
  ctx.fillStyle = t.secondary;
  drawTracked(ctx, "FRESH GRADUATE", left, r.y + r.h * layout.footerBaseline, footTracking);
  drawTracked(ctx, "2026", right, r.y + r.h * layout.footerBaseline, footTracking, "right");
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
