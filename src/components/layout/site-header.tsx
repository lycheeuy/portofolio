import Link from "next/link";
import { PageContainer } from "./page-container";
import { MobileNav } from "./mobile-nav";
import { PrimaryNav } from "./primary-nav";
import { wordmark } from "@/components/ui/styles";
import { site } from "@/data/site";

/**
 * Sticky editorial header. Rendered once by the root layout, so it is the same
 * element across every route and does not re-mount on navigation.
 *
 * The nav itself is `PrimaryNav`, a client component, because marking the
 * current page needs the current path. The header stays a Server Component so
 * only the link list ships JavaScript.
 */

/**
 * The skip link is invisible until focused, so it sets its own outline rather
 * than relying on the global `:focus-visible` rule: it has to paint a
 * background and a box at the same moment it becomes visible.
 *
 * `#top` is the `<main>` on every route, not a homepage section, so the link
 * stays a same-document anchor rather than a `next/link`.
 */
const skipLink =
  "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-bg)] focus:px-4 focus:py-2 focus:font-sans focus:text-[length:var(--text-small)] focus:text-ink focus:outline focus:outline-2 focus:outline-[var(--color-accent)]";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/92 backdrop-blur-sm">
      <a href="#top" className={skipLink}>
        Skip to content
      </a>

      <PageContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label={`${site.name}, home`} className={wordmark}>
            {site.shortName}
          </Link>

          <PrimaryNav />

          <MobileNav />
        </div>
      </PageContainer>
    </header>
  );
}
