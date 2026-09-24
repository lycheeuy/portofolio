/**
 * Shared class strings for the editorial design system.
 *
 * Every string here was duplicated verbatim in three or more section
 * components before Phase 6C. Nothing is invented: each is the exact string
 * that was already in use, lifted so the sections cannot drift apart when one
 * of them is edited.
 *
 * Colour is deliberately *not* baked into the type scales (`monoMeta`,
 * `leadText`, `smallText`). The same size and rhythm carries `text-ink`,
 * `text-secondary`, or `text-muted` depending on where it sits, so the caller
 * appends the token. `metaLabel` is the exception: it is always muted, in
 * every section, and that is what makes it read as one label system.
 */

/** 11px tracked-out uppercase mono. Section labels, dt terms, table heads. */
export const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

/**
 * 12px mono set in caps on the label tracking. The Hero's full-name line, the
 * mobile menu toggle, and the mobile menu's contact row: three call sites for
 * one treatment. Append a colour token.
 */
export const monoCaps =
  "font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-label)]";

/** 12px mono metadata. Append a colour token. */
export const monoMeta =
  "font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)]";

/** 18px opened-up lead paragraph. Section standfirsts. Append a colour token. */
export const leadText =
  "font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)]";

/** 16px running body copy. */
export const bodyText =
  "font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-secondary";

/** 14px secondary copy: colophon values, definition values, notes. */
export const smallText =
  "font-sans text-[length:var(--text-small)] leading-[var(--leading-body)]";

/** The section opener, 40 -> 72px Fraunces. Used by every `<h2>` on the page. */
export const sectionHeading =
  "font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink";

/**
 * Square hairline tag. Radius stays at 2px so it reads as a spec sheet, not a
 * pill. Used by the Stack rows in `#work`, the Method row in `#research`, and
 * the Capabilities rows in `#about`: three call sites that each held their own
 * copy of this string until Phase 6C.
 *
 * Do not add `inline-block`. This design system defines `--spacing-block` in
 * `@theme`, and Tailwind 4 therefore reads `inline-block` as the `inline-*`
 * sizing utility with the `block` spacing key: it emits a second
 * `.inline-block { inline-size: var(--spacing-block) }` rule that wins on
 * source order, pinning every tag to that clamp (48px at 1440) regardless of
 * its text. See §11 of the development log. The element is a flex child and is
 * blockified anyway, so the class buys nothing to begin with.
 *
 * `shrink-0` keeps a tag at its content width so the row wraps instead of
 * squeezing; `max-w-full` is the safety valve for a tag longer than its column.
 */
export const tag =
  "max-w-full shrink-0 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 py-1 font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-secondary";

/** The one accent marker: availability and settled-status dots. */
export const accentDot =
  "h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]";

/** Wordmark link. Shared by the header, the mobile overlay, and the footer. */
export const wordmark =
  "inline-flex min-h-11 items-center font-display text-[length:var(--text-h3)] font-semibold text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

/**
 * Colour transition on interactive text. 150ms everywhere on the page; the
 * 250ms `--duration-normal` is reserved for the arrow translate, so movement
 * always trails its own colour change rather than racing it.
 */
export const colorTransition =
  "transition-colors duration-[var(--duration-fast)]";

/**
 * The arrow's forward step. 250ms against the 150ms colour change, so the
 * movement trails the colour rather than racing it. Shared by `ActionLink`,
 * the Hero's filled CTA, and the outbound links in `#contact`.
 */
export const arrowStep =
  "shrink-0 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:translate-x-1";

/** Ruled underline that fills in with accent on hover. */
export const ruledLabel =
  "border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]";
