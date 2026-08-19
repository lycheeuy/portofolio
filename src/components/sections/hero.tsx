import { PageContainer } from "@/components/layout/page-container";
import { LanyardWrapper } from "@/components/lanyard/lanyard-wrapper";

const ctaLink =
  "group inline-flex items-center gap-2 font-sans text-[length:var(--text-body)] font-medium text-ink transition-colors hover:text-accent";

const ctaArrow =
  "transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1";

const metaLabel =
  "font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-label)] text-muted";

const FOCUS_AREAS = ["AI / ML Engineering", "Computer Vision", "Research"];

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="border-b border-[var(--color-border)]">
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 py-[var(--spacing-section)] lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center lg:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
                00
              </span>
              <span className="h-px w-8 bg-[var(--color-border)]" aria-hidden="true" />
              <span className={metaLabel}>Fresh Graduate</span>
            </div>

            <h1
              id="hero-name"
              className="font-display font-semibold leading-[var(--leading-hero)] tracking-[var(--tracking-tight)] text-ink text-[length:var(--text-hero)]"
            >
              Alif Reezi
            </h1>

            <p className="mt-4 font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-secondary">
              Nashiruddin Alif Alvareezi
            </p>

            <p className="mt-8 max-w-[36ch] font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
              AI / Machine Learning Engineer working across computer vision, model experimentation, and research.
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="Focus areas">
              {FOCUS_AREAS.map((item) => (
                <li key={item} className={metaLabel}>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href="#work" className={ctaLink}>
                View work
                <span aria-hidden="true" className={ctaArrow}>→</span>
              </a>
              <a href="#research" className={ctaLink}>
                Read research
                <span aria-hidden="true" className={ctaArrow}>→</span>
              </a>
            </div>
          </div>
              <div className="relative min-h-[420px] lg:col-span-4 lg:min-h-[560px]">
            <div className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 lg:-inset-y-16 lg:-right-16 lg:left-0">
              <div className="pointer-events-auto h-full w-full">
                <LanyardWrapper />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}