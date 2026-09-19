import { PageContainer } from "@/components/layout/page-container";
import { SectionEyebrow } from "@/components/layout/section-header";
import { ActionLink } from "@/components/ui/action-link";
import { BackLink } from "@/components/ui/back-link";
import { bodyText, metaLabel, monoMeta, smallText } from "@/components/ui/styles";
import { SETTLED, STATUS_LABEL } from "./status";
import { getProject } from "@/data/projects";
import { research } from "@/data/research";
import { getSection } from "@/data/site";
import type { ExternalLink, ResearchEntry } from "@/types";

/**
 * One research entry, as its own page.
 *
 * Every field renders conditionally. Written in Phase 6D when both entries
 * were venue-only — title, conference name, topic, contribution, project link,
 * and paper link all `null` — with a one-line note for that case instead of an
 * invented abstract. Phase 6E supplied the title, conference name, topic,
 * author position, repository link, and source project for both entries, and
 * the same markup renders them with no change here; the venue-only note stays
 * for any future entry that arrives as a venue alone. `status` is still
 * `pending-confirmation` on both, so the paper link block does not exist yet.
 */

const RESEARCH = getSection("/research");
const RESEARCH_HREF = RESEARCH?.href ?? "/research";
const RESEARCH_LABEL = RESEARCH?.label ?? "Research log";

const WORK_HREF = getSection("/projects")?.href ?? "/projects";

export function ResearchDetail({ entry }: { entry: ResearchEntry }) {
  const headingId = `research-${entry.slug}-title`;

  /**
   * With no title the venue is the entry, so the acronym alone becomes the
   * heading — the year is already set in the eyebrow beside it. When a title
   * lands it takes the heading and the venue demotes to the line below, where
   * the year is repeated deliberately because the pairing is then the citation.
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

  const settled = SETTLED.has(entry.status);

  /** Only links that actually resolve. A `null` href is a gap, not a target. */
  const resolvedLinks = entry.links.filter(
    (link): link is ExternalLink & { href: string } => link.href !== null,
  );

  /** The project this paper draws on, when the data records one. */
  const sourceProject = entry.projectSlug
    ? getProject(entry.projectSlug)
    : undefined;

  /**
   * True when the venue and the year are the whole entry. The note below is
   * connective copy, not content: it restates what `status` already says, for
   * a reader who arrived on a page with one heading and nothing under it.
   */
  const venueOnly =
    !entry.title &&
    !entry.topic &&
    !entry.contribution &&
    !entry.conference.name &&
    resolvedLinks.length === 0 &&
    !sourceProject;

  /** The next entry in the log, wrapping at the end. */
  const position = research.findIndex((item) => item.slug === entry.slug);
  const nextEntry =
    research.length > 1
      ? research[(position + 1) % research.length]
      : undefined;

  return (
    <article
      aria-labelledby={headingId}
      className="pb-[var(--spacing-section)]"
    >
      <PageContainer>
        <div className="pt-8">
          <BackLink href={RESEARCH_HREF}>{RESEARCH_LABEL}</BackLink>
        </div>

        <header className="mt-8 border-t border-[var(--color-ink)] pt-8 lg:mt-10 lg:pt-10">
          <SectionEyebrow index={entry.index}>{entry.year}</SectionEyebrow>

          {/* break-words so a long title or an unbroken token wraps inside the
              measure instead of widening the page. */}
          <h1
            id={headingId}
            className="mt-6 max-w-[26ch] font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] break-words text-ink"
          >
            {heading}
          </h1>

          {venueLine ? (
            <p className={`mt-6 max-w-[54ch] break-words ${monoMeta} text-secondary`}>
              {venueLine}
            </p>
          ) : null}

          <p className="mt-8 flex items-baseline gap-2">
            <span
              aria-hidden="true"
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                settled ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
              }`}
            />
            <span className={metaLabel}>{STATUS_LABEL[entry.status]}</span>
          </p>
        </header>

        {entry.topic || entry.contribution ? (
          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 lg:mt-20 lg:grid-cols-12">
            {entry.topic ? (
              <div className="min-w-0 lg:col-span-6">
                <h2 className={metaLabel}>Topic</h2>
                <p className={`mt-3 max-w-[54ch] ${bodyText}`}>{entry.topic}</p>
              </div>
            ) : null}

            {entry.contribution ? (
              <div className="min-w-0 lg:col-span-6">
                <h2 className={metaLabel}>Contribution</h2>
                <p className={`mt-3 max-w-[54ch] ${bodyText}`}>
                  {entry.contribution}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {sourceProject ? (
          <div className="mt-16 border-t border-[var(--color-border)] pt-8 lg:mt-20">
            <h2 className={metaLabel}>Based on</h2>
            <ul className="mt-3">
              <li>
                <ActionLink href={`${WORK_HREF}/${sourceProject.slug}`}>
                  {sourceProject.title}
                </ActionLink>
              </li>
            </ul>
          </div>
        ) : null}

        {resolvedLinks.length > 0 ? (
          <div className="mt-16 border-t border-[var(--color-border)] pt-8 lg:mt-20">
            <h2 className={metaLabel}>Links</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {resolvedLinks.map((link) => (
                <li key={link.label}>
                  <ActionLink href={link.href}>{link.label}</ActionLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {venueOnly ? (
          <p
            className={`mt-16 max-w-[52ch] border-t border-[var(--color-border)] pt-8 ${smallText} text-muted lg:mt-20`}
          >
            The venue and the year are all that is settled for this entry. The
            title, topic, contribution, and any paper link are published here
            once they are confirmed, not before.
          </p>
        ) : null}

        {nextEntry ? (
          <nav
            aria-label="Research navigation"
            className="mt-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-8 lg:mt-20"
          >
            <p className={metaLabel}>Next entry</p>
            <ActionLink href={`${RESEARCH_HREF}/${nextEntry.slug}`}>
              {nextEntry.title ??
                `${nextEntry.conference.acronym} ${nextEntry.year}`}
            </ActionLink>
          </nav>
        ) : null}
      </PageContainer>
    </article>
  );
}
