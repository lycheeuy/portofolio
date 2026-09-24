import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { ActionLink } from "@/components/ui/action-link";
import {
  accentDot,
  bodyText,
  colorTransition,
  leadText,
  metaLabel,
  monoMeta,
  smallText,
  tag,
} from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { research } from "@/data/research";
import { site } from "@/data/site";

/**
 * About: the `/about` page.
 *
 * Six numbered blocks, in the order a reader would ask the questions: who,
 * where from, what with, what on, where to, and how to reach them. Each
 * block is a `<h2>` under the page's `<h1>`, with an index rail on the left
 * and the content on the right, the same split the Capabilities row used
 * before Phase 6F, now applied to the whole page.
 *
 * **On the prose.** Since Phase 6F the personal copy is the owner's own:
 * `profile.about` holds the six answers from `Docs/Detail.txt`, rendered
 * into English and kept in first person because the original is. The only
 * sentence written here is the opening line of Profile, and every clause in
 * it is a data field (see the annotation at the point of use). Each
 * `profile.about` section renders only if it has paragraphs, so a section
 * the owner has not answered leaves no gap on the page.
 *
 * **On overlap with the Hero.** The Hero already carries location, education,
 * focus, trajectory, and availability. About repeats all five because a
 * reader arriving on `/about` should not have to go back to the homepage for
 * them, and adds what the Hero does not show: the institution, the three
 * roles, the capability groups, the work and the papers by name, and the
 * owner's own account of all of it. (Focus was the one of the five missing
 * until Phase 6G; it is now a Background row.)
 *
 * **Two places, not one.** The owner studied at `education.institution`
 * (Telkom University Purwokerto) and lives in `location` (Cirebon). Both
 * are rendered, in separate rows, under separate terms.
 *
 * **Experience.** The owner is a fresh graduate with no formal employment to
 * document (confirmed 2026-09-21). `profile.experience` carries the agreed
 * label, "Independent projects", as a Background row, and block 04 lists
 * the projects themselves as the evidence. No employer, title, or period is
 * implied anywhere on the page.
 */

const ABOUT = site.sections.find((section) => section.href === "/about");
const ABOUT_INDEX = ABOUT?.index ?? "03";
const ABOUT_LABEL = ABOUT?.label ?? "About";

const WORK_HREF = site.sections.find((s) => s.href === "/projects")?.href ?? "/projects";
const RESEARCH_HREF = site.sections.find((s) => s.href === "/research")?.href ?? "/research";

/**
 * The headline contact is whichever primary channel is an email, found by
 * URI scheme, the same rule `contact.tsx` uses, so the two pages cannot
 * name different addresses.
 */
const EMAIL = profile.contact.find(
  (channel) => channel.primary && channel.href.startsWith("mailto:"),
);

/**
 * Model, Build, and Deploy. The `Research` group is deliberately excluded:
 * `/research` prints it as its Method block, and printing it twice would make
 * the two sections disagree the moment one is edited. A pointer to that
 * section stands in its place below.
 */
const RESEARCH_GROUP_LABEL = "Research";

const CAPABILITY_GROUPS = profile.capabilities.filter(
  (group) => group.label !== RESEARCH_GROUP_LABEL,
);

const HAS_RESEARCH_GROUP = profile.capabilities.some(
  (group) => group.label === RESEARCH_GROUP_LABEL,
);

/**
 * Education, institution, roles, experience, focus, and location. Everything
 * here is a literal field. Institution is its own row rather than a suffix on
 * Education so the place of study and the place of residence never sit in
 * one string. `degree` already names the field, so it stands alone, with the
 * status and graduation year as its note. Focus is the same `focusAreas`
 * join the Hero colophon prints, so the two pages cannot name different
 * areas.
 */
const BACKGROUND = [
  {
    term: "Education",
    value: profile.education.degree,
    note: [profile.education.status, profile.education.graduationYear]
      .filter(Boolean)
      .join(" · "),
  },
  ...(profile.education.institution
    ? [{ term: "Studied at", value: profile.education.institution, note: null }]
    : []),
  { term: "Roles", value: profile.roles.join(" · "), note: null },
  ...(profile.experience
    ? [{ term: "Experience", value: profile.experience, note: null }]
    : []),
  { term: "Focus", value: profile.focusAreas.join(" · "), note: null },
  { term: "Based in", value: profile.location, note: null },
];

/* ------------------------------------------------------------------ */
/* Local class strings                                                 */
/* ------------------------------------------------------------------ */

/**
 * The opening statement measure. 52ch matches the Research standfirst; both
 * are section-opening statements, so they hold the same measure.
 */
const statement = `max-w-[52ch] ${leadText}`;

/** Running first-person copy. 58ch is the case-study body measure. */
const prose = `max-w-[58ch] ${bodyText}`;

const inlineLink = `text-ink underline decoration-[var(--color-border)] underline-offset-4 hover:text-accent hover:decoration-[var(--color-accent)] ${colorTransition}`;

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

/**
 * One numbered block: index and `<h2>` in the left rail, content on the
 * right. The heading is set as a label rather than a subheading: these are
 * the same eleven-pixel tracked-out terms the page's `dt`s use, and the reason
 * they are `<h2>` is the outline, not the type.
 *
 * `aside` is optional and sits under the label in the rail; the margin
 * column, empty for every other block, is where the portrait goes.
 *
 * The rail is four columns of twelve against the body's eight, which together
 * are the whole grid: before the portrait it was three, and the twelfth column
 * was slack at the right. The body column is the same eight columns either
 * way, so no measure changed; the rail simply took the slack, and with it the
 * width the portrait needed to stop reading as a thumbnail.
 */
function AboutBlock({
  index,
  heading,
  id,
  aside,
  children,
}: {
  index: string;
  heading: string;
  id: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[var(--color-border)] pt-8 lg:grid-cols-12"
    >
      <div className="lg:col-span-4 lg:pt-1.5">
        <div className="flex items-baseline gap-4">
          <span aria-hidden="true" className={`${monoMeta} text-muted`}>
            {index}
          </span>
          <h2 id={id} className={metaLabel}>
            {heading}
          </h2>
        </div>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </section>
  );
}

/**
 * The owner's portrait, in the Profile block's margin.
 *
 * Framed rather than cropped hard: a 4:5 window over a 3:4 photograph trims a
 * few percent of height and nothing else, so the figure stays whole, and
 * `object-position` biases what is trimmed towards the feet rather than the
 * head. The hairline and 2px radius are the tokens the design system reserves
 * for images; nothing else is added: no shadow, no filter, no overlay.
 *
 * Width is capped below `lg`, where the rail is a full-width row and an
 * uncapped portrait would open the page on a picture instead of the writing.
 * At `lg` it takes the rail's own width (~352px at the container maximum),
 * which is what `sizes` describes to the browser.
 */
function Portrait() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[14rem] overflow-hidden rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-surface)] sm:max-w-[17rem] lg:max-w-[18rem]">
      <Image
        src="/images/profile/alif-portrait.jpg"
        alt={`${profile.displayName}, standing outdoors in sunlight, taking a phone call.`}
        fill
        sizes="(min-width: 1024px) 288px, (min-width: 640px) 272px, 224px"
        className="object-cover object-[50%_28%]"
      />
    </div>
  );
}

/** A run of owner paragraphs. Renders nothing for an empty list. */
function Prose({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  if (paragraphs.length === 0) return null;
  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={prose}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function About() {
  const { about } = profile;

  return (
    <Section id="about" labelledBy="about-heading">
      <SectionHeader
        index={ABOUT_INDEX}
        meta={profile.status}
        heading={ABOUT_LABEL}
        headingId="about-heading"
        level={1}
      />

      <div className="space-y-16 lg:space-y-20">
        {/* 01 · Profile */}
        <AboutBlock
          index="01"
          heading="Profile"
          id="about-profile"
          aside={<Portrait />}
        >
          {/* Clause by clause: `displayName`, `fullName`, `roles[0]`,
              `status` (lower-cased), `education.field`, `education.institution`
              when present, and `location`. Nothing else is asserted. */}
          <p className={`${statement} text-ink`}>
            {profile.displayName}, {profile.fullName}, is an{" "}
            {profile.roles[0]} and a {profile.status.toLowerCase()} in{" "}
            {profile.education.field}
            {profile.education.institution
              ? ` from ${profile.education.institution}`
              : ""}
            , now based in {profile.location}.
          </p>

          <Prose paragraphs={about.interests} className="mt-8" />
        </AboutBlock>

        {/* 02 · Background */}
        <AboutBlock index="02" heading="Background" id="about-background">
          <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {BACKGROUND.map((item) => (
              <div
                key={item.term}
                className="border-t border-[var(--color-border)] py-4"
              >
                <dt className={metaLabel}>{item.term}</dt>
                <dd className={`mt-2 ${smallText} text-ink`}>
                  {item.value}
                  {item.note ? (
                    <span className={`mt-1 block ${metaLabel}`}>
                      {item.note}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <Prose paragraphs={about.background} className="mt-8" />
        </AboutBlock>

        {/* 03 · Capabilities */}
        <AboutBlock index="03" heading="Capabilities" id="about-capabilities">
          <dl>
            {CAPABILITY_GROUPS.map((group) => (
              <div
                key={group.label}
                className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 first:pt-0 sm:flex-row sm:gap-6"
              >
                <dt className={`${metaLabel} sm:w-24 sm:shrink-0 sm:pt-1.5`}>
                  {group.label}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className={tag}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          {/* The Research group lives on `/research`. Pointing at it keeps
              one source on the page instead of two that can drift. */}
          {HAS_RESEARCH_GROUP ? (
            <p className={`mt-6 ${prose}`}>
              Evaluation and documentation methods are listed with the venues,
              under{" "}
              <Link href={RESEARCH_HREF} className={inlineLink}>
                Research log
              </Link>
              .
            </p>
          ) : null}

          {about.learning.length > 0 ? (
            <div className="mt-10">
              <h3 className={metaLabel}>Learning now</h3>
              <Prose paragraphs={about.learning} className="mt-3" />
            </div>
          ) : null}
        </AboutBlock>

        {/* 04 · Research / Building */}
        <AboutBlock
          index="04"
          heading="Research / Building"
          id="about-building"
        >
          <Prose paragraphs={about.building} />

          {/* The work and the papers, by name, from the data. One line each:
              the case studies and the entries live on their own pages. */}
          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className={metaLabel}>Selected work</dt>
              <dd className="mt-3">
                <ul className="space-y-3">
                  {projects.map((project) => (
                    <li key={project.slug} className="min-w-0">
                      <Link
                        href={`${WORK_HREF}/${project.slug}`}
                        className={`inline-flex min-h-11 items-center font-sans text-[length:var(--text-body)] font-medium text-ink hover:text-accent ${colorTransition}`}
                      >
                        {project.title}
                      </Link>
                      <span className={`block ${monoMeta} text-muted`}>
                        {project.discipline}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={metaLabel}>Research log</dt>
              <dd className="mt-3">
                <ul className="space-y-3">
                  {research.map((entry) => (
                    <li key={entry.slug} className="min-w-0">
                      <Link
                        href={`${RESEARCH_HREF}/${entry.slug}`}
                        className={`inline-flex min-h-11 items-center font-sans text-[length:var(--text-body)] font-medium text-ink hover:text-accent ${colorTransition}`}
                      >
                        {entry.title ?? entry.conference.acronym}
                      </Link>
                      <span className={`block ${monoMeta} text-muted`}>
                        {entry.conference.acronym} {entry.conference.year}
                        {entry.contribution ? ` · ${entry.contribution}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {about.approach.length > 0 ? (
            <div className="mt-10">
              <h3 className={metaLabel}>How the work gets done</h3>
              <Prose paragraphs={about.approach} className="mt-3" />
            </div>
          ) : null}
        </AboutBlock>

        {/* 05 · Direction */}
        <AboutBlock index="05" heading="Direction" id="about-direction">
          {/* The same ordered list the Hero renders: the sequence is the
              content, the arrows are decoration over that order. */}
          <ol
            aria-label="Career direction"
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {profile.trajectory.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                ) : null}
                <span className={`${monoMeta} text-ink`}>{step}</span>
              </li>
            ))}
          </ol>

          <Prose paragraphs={about.direction} className="mt-8" />
        </AboutBlock>

        {/* 06 · Availability / Contact */}
        <AboutBlock
          index="06"
          heading="Availability / Contact"
          id="about-contact"
        >
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className={accentDot} />
            <span className={metaLabel}>{profile.availability}</span>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            {EMAIL ? (
              <a
                href={EMAIL.href}
                className={`inline-flex min-h-11 items-center break-all border-b border-[var(--color-border)] pb-0.5 font-sans text-[length:var(--text-body)] text-ink hover:border-[var(--color-accent)] hover:text-accent ${colorTransition}`}
              >
                {EMAIL.value}
              </a>
            ) : null}
            <ActionLink href="/contact">Get in touch</ActionLink>
          </div>
        </AboutBlock>
      </div>
    </Section>
  );
}
