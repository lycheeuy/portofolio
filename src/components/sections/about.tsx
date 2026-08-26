import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * About — the `#about` section.
 *
 * **On the prose.** `profile.ts` has no `bio` field, and its `pending` list
 * records "Personal / 'now' copy" as owner-supplied content that has not
 * arrived. So the two statement paragraphs below are authored connective copy,
 * not data — but every *claim* in them traces to a documented field, and each
 * is annotated at the point of use. Nothing asserts employment, a client, a
 * duration, an achievement, a certification, or a skill that is not already in
 * `profile.ts` or `projects.ts`. Treat the wording as a placeholder the owner
 * should approve or replace; treat the facts as verified.
 *
 * **On pronouns.** The profile does not state any, so the copy is written
 * without them, the way the Hero is. It is not written in first person either,
 * which would put words in the owner's mouth on a page they have not yet
 * reviewed.
 *
 * **On overlap with the Hero.** The Hero already carries location, education,
 * focus areas, trajectory, and availability. About repeats education and
 * location because a reader arriving on the `#about` anchor should not have to
 * scroll up for them, and adds what the Hero does not show at all: the three
 * roles, the completion state of the degree, and the capability groups.
 */

const ABOUT = site.sections.find((section) => section.id === "about");
const ABOUT_INDEX = ABOUT?.index ?? "03";
const ABOUT_LABEL = ABOUT?.label ?? "About";

/**
 * Model, Build, and Deploy. The `Research` group is deliberately excluded —
 * `#research` prints it as its Method block, and printing it twice would make
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

/** Education, roles, and location. Everything here is a literal field. */
const BACKGROUND = [
  {
    term: "Education",
    value: `${profile.education.field} — ${profile.education.degree}`,
    note: profile.education.status,
  },
  { term: "Roles", value: profile.roles.join(" · "), note: null },
  { term: "Based in", value: profile.location, note: null },
];

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

/**
 * 52ch matches the Research standfirst — both are section-opening statements,
 * so they should hold the same measure. It only binds below `lg`, where the
 * two-column grid collapses and the paragraph would otherwise take the full
 * container: at 768 that was ~75 characters per line, the far edge of a
 * comfortable measure. Capped, it lands near 67.
 */
const statement =
  "max-w-[52ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)]";

/**
 * Square hairline tag. Third copy of this string — `selected-work.tsx` and
 * `research-log.tsx` hold the other two. It stays duplicated because lifting
 * it into a shared module would mean editing both of those files, which this
 * phase was told not to touch. That is the debt: one shared module, three
 * call sites, whenever a phase is free to change all three at once.
 *
 * Never add `inline-block` — see §11 of the development log. `--spacing-block`
 * in `@theme` makes Tailwind 4 emit a second `.inline-block` rule setting
 * `inline-size`, which pins every tag to that clamp regardless of its text.
 */
const tag =
  "max-w-full shrink-0 rounded-[var(--radius-xs)] border border-[var(--color-border)] px-2 py-1 font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-secondary";

const inlineLink =
  "group inline-flex min-h-11 items-center gap-2 font-sans text-[length:var(--text-body)] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

const inlineLinkLabel =
  "border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]";

const inlineLinkArrow =
  "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:translate-x-1";

/* ------------------------------------------------------------------ */

export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <header className="mb-12 lg:mb-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
            {ABOUT_INDEX}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-[var(--color-border)]"
          />
          <span className={metaLabel}>{profile.status}</span>
        </div>

        <h2
          id="about-heading"
          className="mt-6 font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink"
        >
          {ABOUT_LABEL}
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          {/* Claim by claim: "AI / Machine Learning Engineer" is roles[0] and
              the opening of `positioning`; "fresh graduate" is `status`;
              "Biomedical Engineering" is `education.field`; "computer vision,
              model experimentation, and research" is `positioning` verbatim;
              "medical imaging" and "edge hardware" are the two domains named
              in `site.description`. */}
          <p className={`${statement} text-ink`}>
            {profile.displayName} is an AI / Machine Learning Engineer and a
            fresh graduate in Biomedical Engineering. The work runs across
            computer vision, model experimentation, and research — so far on
            medical imaging, and on running trained models on edge hardware.
          </p>

          {/* The two endings are the two documented projects, not a
              generalisation: Melon Plant Detection's approach records a
              FastAPI service, PostgreSQL, Docker, and a Linux VPS, and
              Tuberculosis Detection records per-model evaluation figures with
              the context "Academic research and conference publication
              material". Both begin from a trained model. */}
          <p className={`mt-6 ${statement} text-secondary`}>
            The modelling and the engineering are not separate here. One of the
            two projects on this page ends at a deployed application — an API,
            a database, a container, a Linux VPS. The other ends at evaluation
            figures and material prepared for conference publication. Both
            started as a training run.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-4 lg:col-start-9">
          <h3 className={metaLabel}>Background</h3>
          <dl className="mt-4">
            {BACKGROUND.map((item) => (
              <div
                key={item.term}
                className="border-t border-[var(--color-border)] py-4 last:pb-0"
              >
                <dt className={metaLabel}>{item.term}</dt>
                <dd className="mt-2 font-sans text-[length:var(--text-small)] leading-[var(--leading-body)] text-ink">
                  {item.value}
                  {item.note ? (
                    <span className="mt-1 block font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted">
                      {item.note}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 border-t border-[var(--color-ink)] pt-8 lg:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
          <h3 className={`${metaLabel} lg:col-span-3 lg:pt-1.5`}>
            Capabilities
          </h3>

          <div className="min-w-0 lg:col-span-9">
            <dl>
              {CAPABILITY_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="flex flex-col gap-2 border-b border-[var(--color-border)] py-4 first:pt-0 sm:flex-row sm:gap-6"
                >
                  <dt className={`${metaLabel} sm:w-20 sm:shrink-0 sm:pt-1.5`}>
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

            {/* The Research group lives in `#research`. Pointing at it keeps
                one source on the page instead of two that can drift. */}
            {HAS_RESEARCH_GROUP ? (
              <p className="mt-6 font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-secondary">
                Evaluation and documentation methods are listed with the
                venues, under{" "}
                <a href="#research" className="text-ink underline decoration-[var(--color-border)] underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-accent hover:decoration-[var(--color-accent)]">
                  Research log
                </a>
                .
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Closing. `availability` verbatim from the data, made actionable —
          the Hero states the same line but offers nothing to do with it. */}
      <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--color-border)] pt-8 lg:mt-20">
        <p className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
          />
          <span className={metaLabel}>{profile.availability}</span>
        </p>

        <a href="#contact" className={inlineLink}>
          <span className={inlineLinkLabel}>Get in touch</span>
          <span aria-hidden="true" className={inlineLinkArrow}>
            →
          </span>
        </a>
      </div>
    </Section>
  );
}
