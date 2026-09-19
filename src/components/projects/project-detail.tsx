import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionEyebrow } from "@/components/layout/section-header";
import { ActionLink } from "@/components/ui/action-link";
import { BackLink } from "@/components/ui/back-link";
import {
  bodyText,
  metaLabel,
  monoMeta,
  smallText,
  tag,
} from "@/components/ui/styles";
import { projects } from "@/data/projects";
import { getResearchForProject } from "@/data/research";
import { getSection } from "@/data/site";
import type {
  ClassMetrics,
  ExternalLink,
  ModelResult,
  Project,
} from "@/types";

/**
 * One project, as its own page.
 *
 * This is the case-study body that was inlined in the Selected Work section
 * before Phase 6D, moved here unchanged in substance: same fields, same
 * ordering, same "render it only if the data has it" rule. Every string,
 * figure, and link still comes from `src/data/projects.ts`. Nothing about
 * either project is written in this file, so a corrected metric or a supplied
 * URL changes the page without touching it.
 *
 * The two projects look different because their data is different, not
 * because they are styled differently. Tuberculosis Detection carries three
 * benchmarked models, so it gets the results tables. Melon Plant Detection
 * carries no evaluation figures but does carry a timeline and a deployment
 * chain ending on ESP32-CAM hardware, so its weight falls on approach and
 * stack. Neither shape is hardcoded per project.
 */

const WORK = getSection("/projects");
const WORK_HREF = WORK?.href ?? "/projects";
const WORK_LABEL = WORK?.label ?? "Selected work";

const RESEARCH_HREF = getSection("/research")?.href ?? "/research";

/* ------------------------------------------------------------------ */
/* Figure formatting                                                   */
/* ------------------------------------------------------------------ */

/**
 * Recorded precision is preserved rather than normalised. The source lists
 * ResNet50 at `0.57` and DenseNet121 at `0.5491`; padding the first to
 * `0.5700` would claim two digits of precision that were never measured.
 */
const asRatio = (value: number | null) =>
  value === null ? null : String(value);

const asPercent = (value: number | null) =>
  value === null ? null : `${(value * 100).toFixed(2)}%`;

/** Fixed locale so the server and client render the same separator. */
const asCount = (value: number) => value.toLocaleString("en-US");

/**
 * A figure the owner left blank. Shown as an em dash, but read out as words —
 * a screen reader announcing a bare dash in a metrics table tells the listener
 * nothing about why the cell is empty.
 */
function Figure({ value }: { value: string | null }) {
  if (value !== null) return <>{value}</>;
  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">Not recorded</span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Local class strings                                                 */
/* ------------------------------------------------------------------ */

const monoValue = `${monoMeta} text-ink`;

const cell = `whitespace-nowrap px-4 py-3 ${monoValue}`;

const headCell = `whitespace-nowrap px-4 py-3 text-left ${metaLabel}`;

/**
 * Block heading inside the case study. Sized as a label rather than a
 * subheading: these are the same eleven-pixel tracked-out terms the Stack and
 * Background lists use, and the reason they are `<h2>` is the outline, not the
 * type. On a page whose `<h1>` is the project title, "Problem" and "Approach"
 * are its real sections.
 */
const blockHeading = metaLabel;

/* ------------------------------------------------------------------ */
/* Results — rendered only for projects that have benchmarked models    */
/* ------------------------------------------------------------------ */

/**
 * Tables scroll inside their own container rather than widening the page, and
 * the container is focusable so a keyboard user can reach that scroll without
 * a pointer.
 *
 * `min-w-0` is load-bearing here and on every grid item between this and the
 * page root. A grid or flex item defaults to `min-width: auto`, which means it
 * refuses to shrink below its content — so a `min-w-[38rem]` table pushes the
 * whole column past the viewport and the page scrolls sideways instead of the
 * table. Overriding the minimum to 0 lets the column take the track width it
 * was given and hands the excess to this container's own scroll port.
 *
 * `relative` is load-bearing for the same reason, less obviously. Tailwind's
 * `sr-only` is `position: absolute`, and an absolutely positioned box is only
 * clipped by an ancestor's overflow if that ancestor is in its containing
 * block chain. Without a positioned ancestor the "Not recorded" labels inside
 * these cells resolve against the initial containing block, escape the scroll
 * port, and are laid out at their static position — which for the last column
 * of a 608px table sits well past a 375px viewport. See §11 of the log.
 */
function ScrollableTable({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative mt-4 min-w-0 overflow-x-auto"
    >
      {children}
    </div>
  );
}

function ModelComparison({
  models,
  projectTitle,
}: {
  models: ModelResult[];
  projectTitle: string;
}) {
  return (
    <ScrollableTable label={`${projectTitle} — model comparison, scrollable`}>
      <table className="w-full min-w-[34rem] border-collapse">
        <caption className={`${metaLabel} pb-3 text-left`}>
          Model comparison
        </caption>
        <thead>
          <tr className="border-y border-[var(--color-border)]">
            <th scope="col" className={headCell}>
              Model
            </th>
            <th scope="col" className={headCell}>
              Role
            </th>
            <th scope="col" className={headCell}>
              Accuracy
            </th>
            <th scope="col" className={headCell}>
              ROC-AUC
            </th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr
              key={model.name}
              className="border-b border-[var(--color-border)]"
            >
              <th
                scope="row"
                className={`${cell} text-left font-medium ${
                  model.role === "primary" ? "text-accent" : ""
                }`}
              >
                {model.name}
              </th>
              <td className={`${cell} text-secondary`}>{model.role}</td>
              <td className={cell}>
                <Figure value={asPercent(model.accuracy)} />
              </td>
              <td className={cell}>
                <Figure value={asRatio(model.rocAuc)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollableTable>
  );
}

function PerClassMetrics({
  models,
  projectTitle,
}: {
  models: ModelResult[];
  projectTitle: string;
}) {
  const rows: Array<{ model: ModelResult; metrics: ClassMetrics }> =
    models.flatMap((model) =>
      model.perClass.map((metrics) => ({ model, metrics })),
    );

  return (
    <ScrollableTable label={`${projectTitle} — per-class metrics, scrollable`}>
      <table className="w-full min-w-[38rem] border-collapse">
        <caption className={`${metaLabel} pb-3 text-left`}>
          Per-class metrics
        </caption>
        <thead>
          <tr className="border-y border-[var(--color-border)]">
            <th scope="col" className={headCell}>
              Model
            </th>
            <th scope="col" className={headCell}>
              Class
            </th>
            <th scope="col" className={headCell}>
              Precision
            </th>
            <th scope="col" className={headCell}>
              Recall
            </th>
            <th scope="col" className={headCell}>
              F1
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ model, metrics }) => (
            <tr
              key={`${model.name}-${metrics.label}`}
              className="border-b border-[var(--color-border)]"
            >
              <th
                scope="row"
                className={`${cell} text-left font-medium ${
                  model.role === "primary" ? "text-accent" : ""
                }`}
              >
                {model.name}
              </th>
              <td className={`${cell} text-secondary`}>{metrics.label}</td>
              <td className={cell}>
                <Figure value={asRatio(metrics.precision)} />
              </td>
              <td className={cell}>
                <Figure value={asRatio(metrics.recall)} />
              </td>
              <td className={cell}>
                <Figure value={asRatio(metrics.f1)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollableTable>
  );
}

/* ------------------------------------------------------------------ */

export function ProjectDetail({ project }: { project: Project }) {
  const headingId = `project-${project.slug}-title`;

  /**
   * Only links that actually resolve. A `null` href is a gap, not a target.
   * The predicate narrows the type as well as filtering, so `ActionLink` gets
   * a `string` and the "no URL supplied yet" case cannot reach the DOM.
   */
  const resolvedLinks = project.links.filter(
    (link): link is ExternalLink & { href: string } => link.href !== null,
  );

  /**
   * Facts that qualify the project rather than describe it. Year and timeline
   * are absent on one project and partly present on the other, so the strip is
   * built from what exists instead of reserving a slot for each.
   */
  const facts = [
    { term: "Discipline", value: project.discipline },
    { term: "Context", value: project.context },
    ...(project.timeline
      ? [{ term: "Timeline", value: project.timeline }]
      : []),
    ...(project.year ? [{ term: "Year", value: String(project.year) }] : []),
  ];

  /** Papers that record this project as their source. Currently none do. */
  const relatedResearch = getResearchForProject(project.slug);

  /**
   * The next project in the index, wrapping at the end. Two projects means
   * this is always the other one; the wrap is written for the third.
   */
  const position = projects.findIndex((item) => item.slug === project.slug);
  const nextProject =
    projects.length > 1
      ? projects[(position + 1) % projects.length]
      : undefined;

  return (
    <article
      aria-labelledby={headingId}
      className="pb-[var(--spacing-section)]"
    >
      <PageContainer>
        <div className="pt-8">
          <BackLink href={WORK_HREF}>{WORK_LABEL}</BackLink>
        </div>

        <header className="mt-8 border-t border-[var(--color-ink)] pt-8 lg:mt-10 lg:pt-10">
          <SectionEyebrow index={project.index}>
            {project.discipline}
          </SectionEyebrow>

          <h1
            id={headingId}
            className="mt-6 font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink"
          >
            {project.title}
          </h1>

          <p className="mt-6 max-w-[62ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
            {project.summary}
          </p>

          {/* Colophon strip, the same device the Hero uses for its metadata:
              short factual pairs set below the title so they do not crowd the
              statement above them. */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-border)] pt-8 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.term} className="min-w-0">
                <dt className={metaLabel}>{fact.term}</dt>
                <dd className={`mt-2 ${smallText} text-ink`}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 lg:mt-20 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className={blockHeading}>Problem</h2>
            <p className={`mt-3 max-w-[58ch] ${bodyText}`}>{project.problem}</p>

            <h2 className={`${blockHeading} mt-10`}>Approach</h2>
            <ol className="mt-3">
              {project.approach.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 border-b border-[var(--color-border)] py-3 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-[var(--color-border)] tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={bodyText}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="min-w-0">
            {project.dataset ? (
              <>
                <h2 className={blockHeading}>Dataset</h2>
                <p className={`mt-3 ${monoValue}`}>
                  {asCount(project.dataset.imageCount)} images ·{" "}
                  {project.dataset.label}
                </p>
                {project.dataset.classes ? (
                  <p className={`mt-2 ${monoMeta} text-secondary`}>
                    {project.dataset.classes.join(" / ")}
                  </p>
                ) : null}
                {project.dataset.note ? (
                  <p className={`mt-2 max-w-[46ch] ${smallText} text-muted`}>
                    {project.dataset.note}
                  </p>
                ) : null}
              </>
            ) : null}

            <h2 className={`${blockHeading} ${project.dataset ? "mt-10" : ""}`}>
              Stack
            </h2>
            <dl className="mt-3">
              {project.stack.map((group) => (
                <div
                  key={group.label}
                  className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 last:border-b-0 sm:flex-row sm:gap-6"
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

            {resolvedLinks.length > 0 ? (
              <>
                <h2 className={`${blockHeading} mt-10`}>Links</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {resolvedLinks.map((link) => (
                    <li key={link.label}>
                      <ActionLink href={link.href}>{link.label}</ActionLink>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>

        {project.models.length > 0 ? (
          <div className="mt-16 min-w-0 border-t border-[var(--color-ink)] pt-8 lg:mt-20">
            <h2 className={blockHeading}>Results</h2>
            <ModelComparison
              models={project.models}
              projectTitle={project.title}
            />
            <PerClassMetrics
              models={project.models}
              projectTitle={project.title}
            />
          </div>
        ) : null}

        {relatedResearch.length > 0 ? (
          <div className="mt-16 border-t border-[var(--color-border)] pt-8 lg:mt-20">
            <h2 className={blockHeading}>Related research</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {relatedResearch.map((entry) => (
                <li key={entry.slug}>
                  <ActionLink href={`${RESEARCH_HREF}/${entry.slug}`}>
                    {entry.title ?? `${entry.conference.acronym} ${entry.year}`}
                  </ActionLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {nextProject ? (
          <nav
            aria-label="Project navigation"
            className="mt-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-[var(--color-border)] pt-8 lg:mt-20"
          >
            <p className={metaLabel}>Next project</p>
            <ActionLink href={`${WORK_HREF}/${nextProject.slug}`}>
              {nextProject.title}
            </ActionLink>
          </nav>
        ) : null}
      </PageContainer>
    </article>
  );
}
