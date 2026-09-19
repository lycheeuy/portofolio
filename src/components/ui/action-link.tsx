import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { arrowStep, colorTransition, ruledLabel } from "./styles";

/**
 * The page's standard text action: a ruled label that fills in with accent on
 * hover, followed by an arrow that steps forward.
 *
 * Before Phase 6C this markup was written out four times — the Hero's
 * secondary CTA, the About closing CTA, the project links in Selected Work,
 * and the entry links in the Research log — and the four had drifted on one
 * point that matters: only Contact and the footer marked an outbound link as
 * outbound. A project repository URL rendered from `projects.ts` would have
 * swapped the tab out with no warning and no `rel`. That is settled here
 * rather than at each call site: the URI scheme decides.
 *
 * - internal (`/projects`, `#top`) — `→`, `next/link`, no announcement
 * - outbound (`https:`, `mailto:`) — `↗`, new tab, `rel="noopener noreferrer"`,
 *   and an `sr-only` note, because the arrow only tells sighted users
 *
 * Phase 6D added the `next/link` branch. Once these targets became routes
 * rather than anchors, a bare `<a>` meant a full document request — and a
 * full teardown of the Lanyard's WebGL context — for every in-site move.
 * Outbound links stay plain `<a>`: `Link` has nothing to prefetch there.
 *
 * `relative` is load-bearing: Tailwind's `sr-only` is `position: absolute`, so
 * without a positioned ancestor that note resolves against the initial
 * containing block and escapes any `overflow` container it sits inside,
 * silently widening the document. See §11 of the development log.
 *
 * `min-h-11` holds the 44px touch target — the label itself is only ~26px tall.
 */
export function ActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const external = /^https?:/.test(href);

  const classes = cn(
    "group relative inline-flex min-h-11 items-center gap-2 font-sans text-[length:var(--text-body)] font-medium text-ink hover:text-accent",
    colorTransition,
    className,
  );

  const content = (
    <>
      <span className={ruledLabel}>{children}</span>
      <span aria-hidden="true" className={arrowStep}>
        {external ? "↗" : "→"}
      </span>
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
