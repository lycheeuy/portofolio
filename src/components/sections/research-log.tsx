import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { research } from "@/data/research";
import { site } from "@/data/site";
import type { ResearchEntry, ResearchStatus } from "@/types";

/**
 * Research log — the `#research` section.
 *
 * Both entries in `src/data/research.ts` are venue-only. Title, expanded
 * conference name, topic, contribution, co-authors, project link, and paper
 * link are all `null`, and `status` is `pending-confirmation` for both, which
 * means it is not known whether they are submitted, accepted, or presented.
 *
 * So this section is deliberately a **register, not a publication list**: a
 * ruled ledger of what is confirmed, with the venue as the heading because the
 * venue is the only thing there is. Every field below renders only when it is
 * non-null, so the same markup becomes a real entry — title as the heading,
 * venue demoted to metadata, topic and contribution as prose, a live paper
 * link — the moment the owner supplies any of it. Nothing is a placeholder for
 * a paper that does not exist.
 *
 * The Method block is the one thing here not drawn from `research.ts`. See the
 * note above `RESEARCH_PRACTICE`.
 */

const RESEARCH = site.sections.find((section) => section.id === "research");
const RESEARCH_INDEX = RESEARCH?.index ?? "02";
const RESEARCH_LABEL = RESEARCH?.label ?? "Research log";

/**
 * Reader-facing wording for every `ResearchStatus`, including the five this
 * data does not use yet, so a status change in the data layer never falls
 * through to a raw enum string on the page.
 *
 * `pending-confirmation` deliberately does not say "submitted" or "accepted" —
 * the venue is what is confirmed, nothing about the paper's fate is known.
 */
const STATUS_LABEL: Record<ResearchStatus, string> = {
  "pending-confirmation": "Venue confirmed · details to follow",
  "in-preparation": "In preparation",
  submitted: "Submitted",
  accepted: "Accepted",
  presented: "Presented",
  published: "Published",
};

/** Statuses where the paper's outcome is settled, so the marker earns colour. */
const SETTLED: ReadonlySet<ResearchStatus> = new Set([
  "accepted",
  "presented",
  "published",
]);

/**
 * The one capability group describing how the work is researched, evaluated,
 * and written up. It comes from `profile.ts` rather than `research.ts`.
 *
 * Reasoning: with both papers venue-only, the entries alone cannot show that
 * this work was evaluated and communicated, only that two venues exist. This
 * group — hyperparameter experimentation, model evaluation, ROC/AUC, confusion
 * matrix, Grad-CAM, scientific documentation — is documented data that does,
 * and "Research" is its own label in `profile.capabilities`, so the research
 * section is its natural home. If the About section later wants the same
 * group, one of the two should reference the other rather than both printing
 * it.
 */
const RESEARCH_PRACTICE = profile.capabilities.find(
  (group) => group.label === "Research",
);

/** Distinct years present in the log, for the standfirst. */
const YEARS = Array.from(new Set(research.map((entry) => entry.year))).sort(
  (a, b) => a - b,
);

const YEAR_RANGE =
  YEARS.length === 0
    ? null
    : YEARS.length === 1
      ? String(YEARS[0])
      : `${YEARS[0]}–${YEARS[YEARS.length - 1]}`;

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

const monoMeta =
  "font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-secondary";

const bodyText =
  "font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-secondary";

/**
 * Square hairline tag, matching the Stack tags in `selected-work.tsx`.
 *
 * Duplicated rather than shared because extracting it would mean editing
 * Selected Work, which is out of scope for this phase. If a third section
 * needs it, lift all three into one module then.
 *
 * Never add `inline-block` — see §11 of the development log. `--spacing-block`
 * in `@theme` makes Tailwind 4 emit a second `.inline-block` rule setting
 * `inline-size`, which pins every tag to that clamp regardless of its text.
 */
const tag =
  "max-w-full shrink-0 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 py-1 font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-secondary";

/* ------------------------------------------------------------------ */
/* One ledger entry                                                    */
/* ------------------------------------------------------------------ */

function ResearchRow({ entry }: { entry: ResearchEntry }) {
  const anchorId = `research-${entry.slug}`;
  const headingId = `${anchorId}-title`;

  /** Only links that actually resolve. A `null` href is a gap, not a target. */
  const resolvedLinks = entry.links.filter((link) => link.href !== null);

  const settled = SETTLED.has(entry.status);

  /**
   * With no title the venue is the entry, so the acronym alone becomes the
   * heading — the year is already set beside it in the rail, and repeating it
   * as "ICWT 2026" next to a 2026 makes the row read twice. When a title
   * lands it takes the heading and the venue demotes to the metadata line
   * below, where the year is repeated deliberately because the pairing is
   * then the citation.
   */
  const heading = entry.title ?? entry.conference.acronym;

  const venueLine = entry.title
    ? [
        entry.conference.acronym,
        entry.conference.name,
        String(entry.conference.year),
      ]
        .filter(Boolean)
        .join(" · ")
    : entry.conference.name;

  return (
    <li
      id={anchorId}
      className="scroll-mt-24 border-t border-[var(--color-border)] first:border-t-0"
    >
      <article
        aria-labelledby={headingId}
        className="grid grid-cols-1 gap-x-8 gap-y-4 py-8 sm:grid-cols-12 lg:py-10"
      >
        {/* Index and year rail. Mono so the ledger reads as a register. */}
        <div className="flex items-baseline gap-4 sm:col-span-3 sm:flex-col sm:gap-2 lg:col-span-2">
          <span
            aria-hidden="true"
            className="font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-[var(--color-border)]"
          >
            {entry.index}
          </span>
          <span className="font-mono text-[length:var(--text-h3)] leading-none tracking-[var(--tracking-mono)] text-ink tabular-nums">
            {entry.year}
          </span>
        </div>

        <div className="min-w-0 sm:col-span-9 lg:col-span-6">
          {/* break-words so a long title or an unbroken token wraps inside the
              column instead of widening the page. */}
          <h3
            id={headingId}
            className="max-w-[34ch] font-display text-[length:var(--text-h3)] font-semibold leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] break-words text-ink"
          >
            {heading}
          </h3>

          {venueLine ? (
            <p className={`mt-2 break-words ${monoMeta}`}>{venueLine}</p>
          ) : null}

          {entry.topic ? (
            <p className={`mt-4 max-w-[54ch] ${bodyText}`}>{entry.topic}</p>
          ) : null}

          {entry.contribution ? (
            <p className={`mt-3 max-w-[54ch] ${bodyText}`}>
              {entry.contribution}
            </p>
          ) : null}

          {resolvedLinks.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
              {resolvedLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href ?? undefined}
                    className="group inline-flex min-h-11 items-center gap-2 font-sans text-[length:var(--text-body)] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent"
                  >
                    <span className="border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Status. Left-aligned in the flow on narrow screens, pushed to the
            outer edge of the ledger from lg. Four columns rather than three:
            at 1440 the longest label is ~277px against a 260px three-column
            track, so it broke across "DETAILS TO / FOLLOW". */}
        <p className="flex items-baseline gap-2 sm:col-span-9 sm:col-start-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              settled ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
            }`}
          />
          <span className={`${metaLabel} lg:text-right`}>
            {STATUS_LABEL[entry.status]}
          </span>
        </p>
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */

export function ResearchLog() {
  return (
    <Section id="research" labelledBy="research-heading">
      <header className="mb-12 lg:mb-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
            {RESEARCH_INDEX}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-[var(--color-border)]"
          />
          <span className={metaLabel}>
            {research.length} {research.length === 1 ? "venue" : "venues"}
          </span>
        </div>

        <h2
          id="research-heading"
          className="mt-6 font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink"
        >
          {RESEARCH_LABEL}
        </h2>

        {/* Counts and years are read from the data. The second sentence states
            why the entries are thin, which is the honest thing to say when the
            alternative is a page of invented titles. */}
        <p className="mt-6 max-w-[52ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
          {research.length} conference{" "}
          {research.length === 1 ? "venue is" : "venues are"} confirmed
          {YEAR_RANGE ? ` for ${YEAR_RANGE}` : ""}. Paper titles, topics, and
          submission state are listed here once they are settled, not before.
        </p>
      </header>

      <ol className="border-b border-[var(--color-border)]">
        {research.map((entry) => (
          <ResearchRow key={entry.slug} entry={entry} />
        ))}
      </ol>

      {RESEARCH_PRACTICE ? (
        <div className="mt-16 border-t border-[var(--color-ink)] pt-8 lg:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-12">
            <h3 className={`${metaLabel} sm:col-span-3 sm:pt-1.5 lg:col-span-2`}>
              Method
            </h3>
            <div className="min-w-0 sm:col-span-9 lg:col-span-7">
              <p className={`max-w-[54ch] ${bodyText}`}>
                How the work behind these venues is run: experimented on,
                measured, and written up.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {RESEARCH_PRACTICE.items.map((item) => (
                  <li key={item} className={tag}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
