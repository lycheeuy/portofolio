import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionEyebrow } from "@/components/layout/section-header";
import { LanyardWrapper } from "@/components/lanyard/lanyard-wrapper";
import { ActionLink } from "@/components/ui/action-link";
import {
  accentDot,
  arrowStep,
  colorTransition,
  metaLabel,
  monoCaps,
  monoMeta,
  smallText,
} from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * Hero: the portfolio's primary identity section.
 *
 * Every string comes from `src/data/profile.ts` or `src/data/site.ts`. The
 * composition is the asymmetric 12-column grid established in Phase 5D-1
 * (8 columns of type, 4 reserved for the Lanyard), with a colophon strip
 * beneath it carrying the factual metadata that would otherwise crowd the
 * main column.
 */

const HERO_INDEX =
  site.sections.find((section) => section.href === "/")?.index ?? "00";

const EMAIL = profile.contact.find((channel) => channel.label === "Email");

/**
 * Two CTAs, deliberately unequal. The work link is the page's primary action
 * and takes the one solid block in the composition; contact stays a ruled
 * text link: `ActionLink`, the same one the rest of the site uses. Both reach
 * a 44px tap target even though the label itself is only ~26px tall.
 *
 * Since Phase 6D both are routes rather than scroll targets, so both go
 * through `next/link`; a full document request here would tear down and
 * rebuild the Lanyard's WebGL context on the way out.
 *
 * This is the only filled button on the page, so it is the only place the
 * ink/accent-hover pairing appears; it is not lifted into the shared styles.
 */
const ctaPrimary = `group inline-flex min-h-11 items-center gap-3 rounded-[var(--radius-xs)] bg-[var(--color-ink)] px-6 font-sans text-[length:var(--text-body)] font-medium text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)] ${colorTransition}`;

const trajectoryStep = `${monoMeta} text-secondary`;

const colophonValue = `mt-2 ${smallText} text-ink`;

/**
 * The mission line: Fraunces italic between the positioning and the career
 * direction, the slot 5D-1 reserved for it. Same measure as the positioning
 * paragraph so the two read as one column of statement.
 */
const missionLine = `mt-6 max-w-[38ch] font-display text-[length:var(--text-body-lg)] italic leading-[var(--leading-relaxed)] text-ink`;

/**
 * Factual metadata rendered as a colophon strip below the composition.
 * `degree` already names the field ("Bachelor of Biomedical Engineering"),
 * so it stands alone with the graduation year when one is recorded.
 */
const COLOPHON = [
  { term: "Based in", value: profile.location },
  {
    term: "Education",
    value: profile.education.graduationYear
      ? `${profile.education.degree}, ${profile.education.graduationYear}`
      : profile.education.degree,
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
            <SectionEyebrow index={HERO_INDEX} className="mb-8">
              {profile.status}
            </SectionEyebrow>

            <h1
              id="hero-name"
              className="font-display font-semibold leading-[var(--leading-hero)] tracking-[var(--tracking-tight)] text-ink text-[length:var(--text-hero)]"
            >
              {profile.displayName}
            </h1>

            <p className={`mt-4 ${monoCaps} text-secondary`}>
              {profile.fullName}
            </p>

            <p data-hero-lead="" className="mt-8 max-w-[38ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
              {profile.positioning}
            </p>

            {/* Owner-approved mission statement (2026-09-21), in the line
                5D-1 reserved between positioning and direction. Rendered only
                when set, so the composition is unchanged if it is ever
                withdrawn. */}
            {profile.mission ? (
              <p data-hero-mission="" className={missionLine}>
                {profile.mission}
              </p>
            ) : null}

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
              <span aria-hidden="true" className={accentDot} />
              <span className={metaLabel}>{profile.availability}</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/projects" className={ctaPrimary}>
                View selected work
                <span aria-hidden="true" className={arrowStep}>
                  →
                </span>
              </Link>
              <ActionLink href="/contact">Get in touch</ActionLink>
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
        <dl className="mt-[var(--spacing-section)] grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-border)] pt-8 pb-[var(--spacing-block)] lg:grid-cols-4">
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
                {/* `inline-flex min-h-11` for the 44px target the rest of the
                    page's links hold. Measured at 1440 this was the one link
                    left at 21px tall, because a colophon value is not an
                    inline link inside a sentence. Never `inline-block` here:
                    `--spacing-block` in `@theme` makes Tailwind emit a second
                    `.inline-block` rule that sets `inline-size`. See §11. */}
                <a
                  href={EMAIL.href}
                  className={`inline-flex min-h-11 items-center break-all border-b border-[var(--color-border)] pb-0.5 hover:border-[var(--color-accent)] hover:text-accent ${colorTransition}`}
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
