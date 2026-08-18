import { PageContainer } from "./page-container";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";

const wordmark =
  "font-display text-[length:var(--text-h3)] font-semibold text-ink transition-colors hover:text-accent";

const navLink =
  "font-sans text-[length:var(--text-small)] text-secondary transition-colors hover:text-ink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/92 backdrop-blur-sm">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <a href="#top" aria-label="Alif Reezi, back to top" className={wordmark}>
            Alif Reezi.
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={navLink}>
                    {link.label}
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