import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  arrowStep,
  colorTransition,
  metaLabel,
  monoMeta,
} from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { research } from "@/data/research";
import { SECTIONS } from "@/data/site";

/**
 * The homepage's directory — the four destinations the site now has, listed
 * as an archive contents page.
 *
 * It exists because Phase 6D moved every section onto its own route. Without
 * it the homepage ends at the Hero's colophon and the only way onward is the
 * header, which is four small labels at the top of a tall composition. This
 * is the same set of destinations said at full size, in the same numbering
 * (`01`–`04`) the header's mono indices use.
 *
 * The line under each label is a count or a status read from the data, never
 * a description written here: "2 projects", "2 papers", the education field,
 * the availability line. If the data changes, the directory changes; if a
 * fact is not in the data, the row simply carries no line.
 */

/** Home is the page this list is on, so it is not one of its destinations. */
const DESTINATIONS = SECTIONS.filter((section) => section.href !== "/");

/**
 * The one factual line per destination, keyed by route. `undefined` renders
 * nothing rather than a placeholder.
 */
const META: Record<string, string | undefined> = {
  "/projects": `${projects.length} ${projects.length === 1 ? "project" : "projects"}`,
  "/research": `${research.length} conference ${research.length === 1 ? "paper" : "papers"}`,
  "/about": `${profile.education.field} · ${profile.roles.length} roles`,
  "/contact": profile.availability,
};

export function SiteIndex() {
  return (
    <Section id="index" labelledBy="index-heading">
      <SectionHeader
        index="00"
        meta={`${DESTINATIONS.length} sections`}
        heading="Index"
        headingId="index-heading"
      />

      <ol className="border-t border-[var(--color-ink)]">
        {DESTINATIONS.map((destination) => (
          <li
            key={destination.href}
            className="group border-b border-[var(--color-border)]"
          >
            <Link
              href={destination.href}
              className={`flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 text-ink hover:text-accent lg:py-8 ${colorTransition}`}
            >
              <span
                aria-hidden="true"
                className={`${monoMeta} w-8 shrink-0 text-[var(--color-border)] group-hover:text-accent ${colorTransition}`}
              >
                {destination.index}
              </span>

              <span className="min-w-0 flex-1 font-display text-[length:var(--text-h2)] font-semibold leading-[var(--leading-heading)] tracking-[var(--tracking-tight)]">
                {destination.label}
              </span>

              {META[destination.href] ? (
                <span className={metaLabel}>{META[destination.href]}</span>
              ) : null}

              <span aria-hidden="true" className={arrowStep}>
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}
