import { PageContainer } from "@/components/layout/page-container";
import { LanyardWrapper } from "@/components/lanyard/lanyard-wrapper";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * Hero — the portfolio's primary identity section.
 *
 * Every string comes from `src/data/profile.ts` or `src/data/site.ts`. The
 * composition is the asymmetric 12-column grid established in Phase 5D-1
 * (8 columns of type, 4 reserved for the Lanyard), with a colophon strip
 * beneath it carrying the factual metadata that would otherwise crowd the
 * main column.
 */

const HERO_INDEX =
  site.sections.find((section) => section.id === "top")?.index ?? "00";

const EMAIL = profile.contact.find((channel) => channel.label === "Email");

const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

/**
 * Two CTAs, deliberately unequal. The work link is the page's primary action
 * and takes the one solid block in the composition; contact stays a ruled
 * text link. Both are min-h-11 so the tap target reaches 44px even though the
 * label itself is only ~26px tall — the same rule the mobile menu applies to
 * its mono contact links.
 */
const ctaPrimary =
  "group inline-flex min-h-11 items-center gap-3 rounded-[var(--radius-xs)] bg-[var(--color-ink)] px-6 font-sans text-[length:var(--text-body)] font-medium text-[var(--color-bg)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-accent-hover)]";

const ctaSecondary =
  "group inline-flex min-h-11 items-center gap-2 font-sans text-[length:var(--text-body)] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

const ctaSecondaryLabel =
  "border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]";

const ctaArrow =
  "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:translate-x-1";

const trajectoryStep =
  "font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-secondary";

const colophonValue =
  "mt-2 font-sans text-[length:var(--text-small)] leading-[var(--leading-body)] text-ink";

/** Factual metadata rendered as a colophon strip below the composition. */
const COLOPHON = [
  { term: "Based in", value: profile.location },
  {
    term: "Education",
    value: `${profile.education.field} — ${profile.education.degree}`,
  },
  { term: "Focus", value: profile.focusAreas.join(" · ") },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="border-b border-[var(--color-border)]"
    >
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 pt-[var(--spacing-section)] lg:grid-cols-12 lg:gap-8">
          <div data-hero-zone="text" className="flex flex-col justify-center lg:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
                {HERO_INDEX}
              </span>
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[var(--color-border)]"
              />
              <span className={metaLabel}>{profile.status}</span>
            </div>

            <h1
              id="hero-name"
              className="font-display font-semibold leading-[var(--leading-hero)] tracking-[var(--tracking-tight)] text-ink text-[length:var(--text-hero)]"
            >
              {profile.displayName}
            </h1>

            <p className="mt-5 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-label)] text-secondary">
              {profile.fullName}
            </p>

            <p data-hero-lead="" className="mt-8 max-w-[38ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
              {profile.positioning}
            </p>

            {/* Stated career direction. An ordered list because the sequence
                is the content; the arrows are decoration over that order. */}
            <ol
              aria-label="Career direction"
              className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              {profile.trajectory.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                  ) : null}
                  <span className={trajectoryStep}>{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-10 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
              />
              <span className={metaLabel}>{profile.availability}</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#work" className={ctaPrimary}>
                View selected work
                <span aria-hidden="true" className={ctaArrow}>
                  →
                </span>
              </a>
              <a href="#contact" className={ctaSecondary}>
                <span className={ctaSecondaryLabel}>Get in touch</span>
                <span aria-hidden="true" className={ctaArrow}>
                  →
                </span>
              </a>
            </div>
          </div>

          <div data-hero-zone="lanyard" className="relative min-h-[420px] lg:col-span-4 lg:min-h-[560px]">
            {/* The canvas bleeds past the column so the strap has room to
                swing. The bleed is stepped by breakpoint: at lg the page
                margin is narrower than the bleed, and a fixed -right-16 would
                push the document into horizontal scroll. */}
            <div className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 lg:-inset-y-16 lg:-right-6 lg:left-0 xl:-right-12">
              <div className="pointer-events-auto h-full w-full">
                <LanyardWrapper />
              </div>
            </div>
          </div>
        </div>

        {/* Colophon. Sits below the grid so it never competes with the
            Lanyard column, and clears the canvas's vertical bleed. */}
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-border)] pt-8 pb-[var(--spacing-block)] mt-[var(--spacing-section)] lg:grid-cols-4">
          {COLOPHON.map((item) => (
            <div key={item.term}>
              <dt className={metaLabel}>{item.term}</dt>
              <dd className={colophonValue}>{item.value}</dd>
            </div>
          ))}

          {EMAIL ? (
            <div>
              <dt className={metaLabel}>Contact</dt>
              <dd className={colophonValue}>
                <a
                  href={EMAIL.href}
                  className="break-all border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-accent)] hover:text-accent"
                >
                  {EMAIL.value}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </PageContainer>
    </section>
  );
}
