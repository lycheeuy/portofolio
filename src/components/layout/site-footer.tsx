import Link from "next/link";
import { PageContainer } from "./page-container";
import { NAV_LINKS } from "./nav-links";
import { colorTransition, monoMeta, wordmark } from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * Site footer.
 *
 * Identity, the same navigation the header uses, the social profiles that
 * exist in `profile.contact`, and a copyright line. No addresses or URLs are
 * written here, and there are no build badges.
 *
 * **On the year.** `new Date()` is evaluated when this Server Component
 * renders, and the homepage is statically prerendered, so the year is baked
 * at build time, not read from the visitor's clock. That is the intended
 * trade: a client component purely to keep a footer year live would be the
 * fourth client component on the site, and it would hydrate on every visit to
 * change one number. It goes stale only until the next deploy.
 */

const YEAR = new Date().getFullYear();

/**
 * Social profiles: the publishable channels that point somewhere on the web.
 * Filtering on the URI scheme is what separates a profile from a way of
 * contacting someone; `mailto:` belongs to `#contact`, not to a footer row
 * of social links. `primary` keeps any non-public channel out regardless, per
 * the Phase 5E decision.
 */
const SOCIAL = profile.contact.filter(
  (channel) => channel.primary && /^https?:/.test(channel.href),
);

const footerLink = `inline-flex min-h-11 items-center font-sans text-[length:var(--text-small)] text-secondary hover:text-ink ${colorTransition}`;

const footerMeta = `${monoMeta} text-muted`;

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <PageContainer>
        <div className="flex flex-col gap-10 pt-12 pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <Link
              href="/"
              aria-label={`${site.name}, home`}
              className={wordmark}
            >
              {site.shortName}
            </Link>
            <p className={`mt-1 ${footerMeta}`}>{profile.fullName}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {SOCIAL.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {SOCIAL.map((channel) => (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative ${footerLink}`}
                    >
                      {channel.label}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-[var(--color-border)] py-6">
          <p className={footerMeta}>
            © {YEAR} {site.name}
          </p>
          <p className={footerMeta}>{profile.location}</p>
        </div>
      </PageContainer>
    </footer>
  );
}
