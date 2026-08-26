import { PageContainer } from "./page-container";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";
import { site } from "@/data/site";

/**
 * Sticky editorial header.
 *
 * Labels come from `site.navigation`; the small mono index beside each label
 * is looked up from `site.sections`, so the archive numbering used in the hero
 * carries into the navigation from one source. Indices are desktop-only —
 * below `lg` there is not enough room for them to read as structure rather
 * than noise.
 */
const SECTION_INDEX = new Map(
  site.sections.map((section) => [`#${section.id}`, section.index]),
);

const skipLink =
  "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-bg)] focus:px-4 focus:py-2 focus:font-sans focus:text-[length:var(--text-small)] focus:text-ink focus:outline focus:outline-2 focus:outline-[var(--color-accent)]";

const wordmark =
  "inline-flex min-h-11 items-center font-display text-[length:var(--text-h3)] font-semibold text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

const navLink =
  "group flex items-baseline gap-2 py-3 font-sans text-[length:var(--text-small)] text-secondary transition-colors duration-[var(--duration-fast)] hover:text-ink";

const navIndex =
  "hidden font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-[var(--color-border)] transition-colors duration-[var(--duration-fast)] group-hover:text-accent lg:inline";

const navLabel =
  "border-b border-transparent pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/92 backdrop-blur-sm">
      <a href="#top" className={skipLink}>
        Skip to content
      </a>

      <PageContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            aria-label={`${site.name}, back to top`}
            className={wordmark}
          >
            {site.shortName}
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7 lg:gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={navLink}>
                    <span aria-hidden="true" className={navIndex}>
                      {SECTION_INDEX.get(link.href)}
                    </span>
                    <span className={navLabel}>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <MobileNav />
        </div>
      </PageContainer>
    </header>
  );
}
