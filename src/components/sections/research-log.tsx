import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SETTLED, STATUS_LABEL } from "@/components/research/status";
import {
  arrowStep,
  colorTransition,
  leadText,
  metaLabel,
  monoMeta,
  tag,
} from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { research } from "@/data/research";
import { getSection } from "@/data/site";
import type { ResearchEntry } from "@/types";

/**
 * Research log — the `/research` index.
 *
 * Both entries in `src/data/research.ts` are venue-only. Title, expanded
 * conference name, topic, contribution, co-authors, project link, and paper
 * link are all `null`, and `status` is `pending-confirmation` for both, which
 * means it is not known whether they are submitted, accepted, or presented.
 *
 * So this remains a **register, not a publication list**: a ruled ledger of
 * what is confirmed, with the venue as the heading because the venue is the
 * only thing there is. Every field renders only when it is non-null, so the
 * same markup becomes a real entry — title as the heading, venue demoted to
 * metadata — the moment the owner supplies any of it. Nothing is a
 * placeholder for a paper that does not exist.
 *
 * Phase 6D turned each row's heading into a link to `/research/[slug]`, where
 * `ResearchDetail` renders the same fields at length. `STATUS_LABEL` and
 * `SETTLED` moved to `@/components/research/status` so the index and the
 * detail page cannot word a status differently.
 *
 * The Method block is the one thing here not drawn from `research.ts`. See the
 * note above `RESEARCH_PRACTICE`.
 */

const RESEARCH = getSection("/research");
const RESEARCH_HREF = RESEARCH?.href ?? "/research";
const RESEARCH_LABEL = RESEARCH?.label ?? "Research log";
const RESEARCH_INDEX = RESEARCH?.index ?? "02";

/**
 * The one capability group describing how the work is researched, evaluated,
 * and written up. It comes from `profile.ts` rather than `research.ts`.
 *
 * Reasoning: with both papers venue-only, the entries alone cannot show that
 * this work was evaluated and communicated, only that two venues exist. This
 * group — hyperparameter experimentation, model evaluation, ROC/AUC, confusion
 * matrix, Grad-CAM, scientific documentation — is documented data that does,
 * and "Research" is its own label in `profile.capabilities`, so the research
 * page is its natural home. `#about` points here rather than printing it
 * again.
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

const venueMeta = `${monoMeta} text-secondary`;

/* ------------------------------------------------------------------ */
/* One ledger entry                                                    */
/* ------------------------------------------------------------------ */

function ResearchRow({ entry }: { entry: ResearchEntry }) {
  const headingId = `research-${entry.slug}-title`;

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
    <li className="border-t border-[var(--color-border)] first:border-t-0">
      <article
        aria-labelledby={headingId}
        className="group grid grid-cols-1 gap-x-8 gap-y-4 py-8 sm:grid-cols-12 lg:py-10"
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
          <h2 id={headingId} className="max-w-[34ch]">
            <Link
              href={`${RESEARCH_HREF}/${entry.slug}`}
              className={`inline-flex flex-wrap items-baseline gap-x-3 font-display text-[length:var(--text-h3)] font-semibold leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] break-words text-ink hover:text-accent ${colorTransition}`}
            >
              <span className="border-b border-transparent pb-0.5 group-hover:border-[var(--color-accent)]">
                {heading}
              </span>
              <span aria-hidden="true" className={arrowStep}>
                →
              </span>
            </Link>
          </h2>

          {venueLine ? (
            <p className={`mt-2 break-words ${venueMeta}`}>{venueLine}</p>
          ) : null}

          {entry.topic ? (
            <p className={`mt-4 max-w-[54ch] ${venueMeta}`}>{entry.topic}</p>
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
      <SectionHeader
        index={RESEARCH_INDEX}
        meta={`${research.length} ${research.length === 1 ? "venue" : "venues"}`}
        heading={RESEARCH_LABEL}
        headingId="research-heading"
        level={1}
      >
        {/* Counts and years are read from the data. The second sentence states
            why the entries are thin, which is the honest thing to say when the
            alternative is a page of invented titles. */}
        <p className={`mt-6 max-w-[52ch] ${leadText} text-secondary`}>
          {research.length} conference{" "}
          {research.length === 1 ? "venue is" : "venues are"} confirmed
          {YEAR_RANGE ? ` for ${YEAR_RANGE}` : ""}. Paper titles, topics, and
          submission state are listed here once they are settled, not before.
        </p>
      </SectionHeader>

      <ol className="border-b border-[var(--color-border)]">
        {research.map((entry) => (
          <ResearchRow key={entry.slug} entry={entry} />
        ))}
      </ol>

      {RESEARCH_PRACTICE ? (
        <div className="mt-16 border-t border-[var(--color-ink)] pt-8 lg:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-12">
            <h2 className={`${metaLabel} sm:col-span-3 sm:pt-1.5 lg:col-span-2`}>
              Method
            </h2>
            <div className="min-w-0 sm:col-span-9 lg:col-span-7">
              <p className="max-w-[54ch] font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-secondary">
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
