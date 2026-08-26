import type { ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import type { ClassMetrics, ModelResult, Project } from "@/types";

/**
 * Selected Work — the `#work` section.
 *
 * Every string, figure, and link comes from `src/data/projects.ts`. Nothing
 * about either project is written here: the component only decides how a
 * `Project` is laid out, so a corrected metric or a supplied URL changes the
 * page without touching this file.
 *
 * The two entries look different because their data is different, not because
 * they are styled differently. Tuberculosis Detection carries three benchmarked
 * models, so it gets the results tables — the research emphasis. Melon Plant
 * Detection carries no evaluation figures but does carry a timeline and a
 * deployment chain that ends on ESP32-CAM hardware, so its weight falls on the
 * approach and stack blocks instead. Neither shape is hardcoded per project;
 * both are driven by whether the fields are populated.
 */

const WORK = site.sections.find((section) => section.id === "work");
const WORK_INDEX = WORK?.index ?? "01";
const WORK_LABEL = WORK?.label ?? "Selected work";

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
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

const blockHeading =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

const bodyText =
  "font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-secondary";

const monoValue =
  "font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-ink";

/**
 * Square hairline tag. Radius stays at 2px so it reads as a spec sheet, not a
 * pill.
 *
 * Do not add `inline-block` here. This design system defines `--spacing-block`
 * in `@theme`, and Tailwind 4 therefore reads `inline-block` as the `inline-*`
 * sizing utility with the `block` spacing key — it emits a second
 * `.inline-block { inline-size: var(--spacing-block) }` rule that wins on
 * source order. Every tag was being pinned to that clamp (48px at 1440px wide)
 * regardless of its text, so `DenseNet121` spilled out of its own border and
 * collided with the tag next to it. The span is a flex child and gets
 * blockified anyway, so the class bought nothing to begin with.
 *
 * `shrink-0` keeps a tag at its content width so the row wraps instead of
 * squeezing, and `max-w-full` is the safety valve: a tag longer than the
 * column clamps and wraps inside its border rather than widening the page.
 */
const tag =
  "max-w-full shrink-0 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 py-1 font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-secondary";

const cell =
  "whitespace-nowrap px-4 py-3 font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-ink";

const headCell =
  "whitespace-nowrap px-4 py-3 text-left font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

/* ------------------------------------------------------------------ */
/* Results — rendered only for projects that have benchmarked models    */
/* ------------------------------------------------------------------ */

/**
 * Tables scroll inside their own container rather than widening the page, and
 * the container is focusable so a keyboard user can reach that scroll without
 * a pointer.
 *
 * `min-w-0` is load-bearing here and on every grid item between this and the
 * section root. A grid or flex item defaults to `min-width: auto`, which means
 * it refuses to shrink below its content — so a `min-w-[38rem]` table pushes
 * the whole column past the viewport and the page scrolls sideways instead of
 * the table. Overriding the minimum to 0 lets the column take the track width
 * it was given and hands the excess to this container's own scroll port.
 *
 * `relative` is load-bearing for the same reason, less obviously. Tailwind's
 * `sr-only` is `position: absolute`, and an absolutely positioned box is only
 * clipped by an ancestor's overflow if that ancestor is in its containing
 * block chain. Without a positioned ancestor the "Not recorded" labels inside
 * these cells resolve against the initial containing block, escape the scroll
 * port, and are laid out at their static position — which for the last column
 * of a 608px table sits well past a 375px viewport. Measured: the document's
 * scrollWidth went 557 → 360 at 375px on adding this one class.
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
/* One project entry                                                   */
/* ------------------------------------------------------------------ */

function ProjectEntry({ project }: { project: Project }) {
  const anchorId = `work-${project.slug}`;
  const headingId = `${anchorId}-title`;

  /** Only links that actually resolve. A `null` href is a gap, not a target. */
  const resolvedLinks = project.links.filter((link) => link.href !== null);

  /**
   * Facts that qualify the entry rather than describe it. Timeline is absent
   * on one project and present on the other, so the row is built from what
   * exists instead of reserving a slot for it.
   */
  const facts = [
    { term: "Discipline", value: project.discipline },
    { term: "Context", value: project.context },
    ...(project.timeline
      ? [{ term: "Timeline", value: project.timeline }]
      : []),
  ];

  return (
    <li id={anchorId} className="scroll-mt-24">
      <article
        aria-labelledby={headingId}
        className="grid grid-cols-1 gap-8 border-t border-[var(--color-ink)] pt-8 lg:grid-cols-12 lg:gap-8 lg:pt-10"
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
                <dd className="mt-1 font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 lg:col-span-9">
          <h3
            id={headingId}
            className="font-display text-[length:var(--text-h2)] font-semibold leading-[var(--leading-heading)] tracking-[var(--tracking-tight)] text-ink"
          >
            {project.title}
          </h3>

          <p className="mt-4 max-w-[62ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
            {project.summary}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
            <div className="min-w-0">
              <h4 className={blockHeading}>Problem</h4>
              <p className={`mt-3 max-w-[58ch] ${bodyText}`}>
                {project.problem}
              </p>

              <h4 className={`${blockHeading} mt-8`}>Approach</h4>
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
                  <h4 className={blockHeading}>Dataset</h4>
                  <p className={`mt-3 ${monoValue}`}>
                    {asCount(project.dataset.imageCount)} images ·{" "}
                    {project.dataset.label}
                  </p>
                  {project.dataset.classes ? (
                    <p className={`mt-2 ${monoValue} text-secondary`}>
                      {project.dataset.classes.join(" / ")}
                    </p>
                  ) : null}
                  {project.dataset.note ? (
                    <p
                      className={`mt-2 max-w-[46ch] font-sans text-[length:var(--text-small)] leading-[var(--leading-body)] text-muted`}
                    >
                      {project.dataset.note}
                    </p>
                  ) : null}
                </>
              ) : null}

              <h4 className={`${blockHeading} ${project.dataset ? "mt-8" : ""}`}>
                Stack
              </h4>
              <dl className="mt-3">
                {project.stack.map((group) => (
                  <div
                    key={group.label}
                    className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 last:border-b-0 sm:flex-row sm:gap-6"
                  >
                    <dt
                      className={`${metaLabel} sm:w-24 sm:shrink-0 sm:pt-1.5`}
                    >
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
                  <h4 className={`${blockHeading} mt-8`}>Links</h4>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
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
                </>
              ) : null}
            </div>
          </div>

          {project.models.length > 0 ? (
            <div className="mt-12 min-w-0">
              <h4 className={blockHeading}>Results</h4>
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
        </div>
      </article>
    </li>
  );
}

/* ------------------------------------------------------------------ */

export function SelectedWork() {
  return (
    <Section id="work" labelledBy="work-heading">
      <header className="mb-14 lg:mb-20">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
            {WORK_INDEX}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-[var(--color-border)]"
          />
          {/* Counted from the data rather than written down, so the strip
              cannot drift out of step with what the section renders. */}
          <span className={metaLabel}>
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        <h2
          id="work-heading"
          className="mt-6 font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink"
        >
          {WORK_LABEL}
        </h2>
      </header>

      <ol className="space-y-20 lg:space-y-28">
        {projects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </ol>
    </Section>
  );
}
