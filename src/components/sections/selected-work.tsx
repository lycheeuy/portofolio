import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  arrowStep,
  colorTransition,
  leadText,
  metaLabel,
  monoMeta,
  tag,
} from "@/components/ui/styles";
import { projects } from "@/data/projects";
import { getSection } from "@/data/site";
import type { Project } from "@/types";

/**
 * Selected work: the `/projects` index.
 *
 * Before Phase 6D this component printed both case studies in full on the
 * homepage. The case study now lives at `/projects/[slug]`, rendered by
 * `ProjectDetail`, and this file is the selection screen in front of it: for
 * each project, what it is, what it was for, and what it is built from:
 * enough to choose between two, and nothing that the detail page then repeats
 * at length.
 *
 * Everything still comes from `src/data/projects.ts`. Which facts appear is
 * decided by which fields are populated, not by which project it is: the
 * timeline row shows on the one project that has one, and the dataset line on
 * the two that do.
 */

const WORK = getSection("/projects");
const WORK_HREF = WORK?.href ?? "/projects";
const WORK_LABEL = WORK?.label ?? "Selected work";
const WORK_INDEX = WORK?.index ?? "01";

/** Fixed locale so the server and client render the same separator. */
const asCount = (value: number) => value.toLocaleString("en-US");

/* ------------------------------------------------------------------ */

function ProjectRow({ project }: { project: Project }) {
  const headingId = `work-${project.slug}-title`;

  /**
   * Facts that qualify the entry rather than describe it. Timeline is absent
   * on one project and present on the other, so the rail is built from what
   * exists instead of reserving a slot for it.
   */
  const facts = [
    { term: "Discipline", value: project.discipline },
    { term: "Context", value: project.context },
    ...(project.timeline
      ? [{ term: "Timeline", value: project.timeline }]
      : []),
  ];

  /**
   * The stack flattened into one row of tags. Group labels (Model, Build,
   * Deploy) are the detail page's structure; on an index they would be three
   * headings over two or three tags each, which is scaffolding for a glance.
   */
  const stackItems = project.stack.flatMap((group) => group.items);

  return (
    <li>
      <article
        aria-labelledby={headingId}
        className="group grid grid-cols-1 gap-8 border-t border-[var(--color-ink)] pt-8 lg:grid-cols-12 lg:gap-8 lg:pt-10"
      >
        {/* Index rail. On its own row below lg, so the title keeps full
            measure on narrow viewports instead of being pushed into a
            two-word column. */}
        <div className="min-w-0 lg:col-span-3">
          <p
            aria-hidden="true"
            className="font-mono text-[length:var(--text-display)] leading-none tracking-[var(--tracking-tight)] text-[var(--color-border)]"
          >
            {project.index}
          </p>

          <dl className="mt-6 space-y-4">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className={metaLabel}>{fact.term}</dt>
                <dd className={`mt-1 ${monoMeta} text-ink`}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 lg:col-span-9">
          {/* The title is the only link in the row. A second "read case study"
              action under it would be two tab stops to one destination, and a
              whole-row click target would take the summary text with it. */}
          <h2 id={headingId}>
            <Link
              href={`${WORK_HREF}/${project.slug}`}
              className={`inline-flex flex-wrap items-baseline gap-x-3 font-display text-[length:var(--text-h2)] font-semibold leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] text-ink hover:text-accent ${colorTransition}`}
            >
              <span className="border-b border-transparent pb-1 group-hover:border-[var(--color-accent)]">
                {project.title}
              </span>
              <span aria-hidden="true" className={arrowStep}>
                →
              </span>
            </Link>
          </h2>

          <p className="mt-4 max-w-[62ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
            {project.summary}
          </p>

          {project.dataset ? (
            <p className={`mt-6 ${monoMeta} text-muted`}>
              {asCount(project.dataset.imageCount)} images ·{" "}
              {project.dataset.label}
            </p>
          ) : null}

          <ul className="mt-6 flex flex-wrap gap-2">
            {stackItems.map((item) => (
              <li key={item} className={tag}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */

export function SelectedWork() {
  return (
    <Section id="work" labelledBy="work-heading">
      {/* The count is read from the data rather than written down, so the
          eyebrow cannot drift out of step with what the section renders. */}
      <SectionHeader
        index={WORK_INDEX}
        meta={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        heading={WORK_LABEL}
        headingId="work-heading"
        level={1}
      >
        {/* Generic on purpose. The two entries below differ (one ends at
            evaluation figures, one at hardware in the field), but a standfirst
            that names both by shape would have to be rewritten the moment a
            third project lands. The claim here is true of every entry. */}
        <p className={`mt-6 max-w-[52ch] ${leadText} text-secondary`}>
          Work carried past the training run: to evaluation figures and
          conference material, or to a deployed application on hardware. Open
          an entry for the full case study.
        </p>
      </SectionHeader>

      <ol className="space-y-20 lg:space-y-28">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ol>
    </Section>
  );
}
