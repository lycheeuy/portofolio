import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { accentDot, metaLabel, monoMeta, sectionHeading } from "@/components/ui/styles";

/**
 * The index strip that opens every section: archive number, a hairline rule,
 * an optional accent marker, and one tracked-out label.
 *
 * Five call sites (the Hero plus the four `<h2>` sections) each wrote this
 * out before Phase 6C, which is how the rule ended up as `h-px w-8` in all
 * five by luck rather than by construction. The Hero uses it on its own
 * because its heading is the page `<h1>` at hero scale, not a section opener.
 */
export function SectionEyebrow({
  index,
  marker = false,
  className,
  children,
}: {
  index: string;
  /** Accent dot before the label, reserved for availability. */
  marker?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className={`${monoMeta} text-muted`}>{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-[var(--color-border)]" />
      {marker ? <span aria-hidden="true" className={accentDot} /> : null}
      <span className={metaLabel}>{children}</span>
    </div>
  );
}

/** Standard gap between a section header and the section body. */
const SECTION_HEADER_GAP = "mb-12 lg:mb-16";

/**
 * Section opener: eyebrow, heading, and an optional standfirst passed as
 * children.
 *
 * `level` chooses the heading element. Phase 6D split the single page into
 * six routes, so the four openers that were `<h2>` under the Hero's `<h1>`
 * are now the first and only heading on their own page. Nothing else about
 * them changed (the eyebrow, the rule, the type, and the gap are the same),
 * so this is a prop rather than a second component: two components that must
 * stay identical below the heading tag would only drift.
 *
 * `headingId` is the id the section's `aria-labelledby` points at, so the
 * landmark is named by the heading a reader can actually see.
 *
 * The `mt-6` between eyebrow and heading is fixed here. The gap under the
 * header is the `className` default: `#work` previously used `mb-14 lg:mb-20`
 * against `mb-12 lg:mb-16` in `#research` and `#about`, and the three now share
 * one value. Sections still differ where the difference is the content (a
 * dense case study against a sparse ledger), not the gap under a heading.
 *
 * `className` *replaces* that default rather than adding to it, because
 * `cn` concatenates and Tailwind resolves a conflict by stylesheet order, not
 * by string order: appending `mb-0` to `mb-12` would lose. `#contact` is the
 * one caller that needs no gap (its first block carries its own `mt-12`) and a
 * measure instead, so it passes its own string.
 */
export function SectionHeader({
  index,
  meta,
  marker,
  heading,
  headingId,
  level = 2,
  className = SECTION_HEADER_GAP,
  children,
}: {
  index: string;
  /** Eyebrow label: a count, a status, an availability line. */
  meta: ReactNode;
  marker?: boolean;
  heading: ReactNode;
  headingId: string;
  /** `1` when this opener is the page's own title. Defaults to `2`. */
  level?: 1 | 2;
  /** Replaces the default gap under the header. */
  className?: string;
  children?: ReactNode;
}) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <header className={className}>
      <SectionEyebrow index={index} marker={marker}>
        {meta}
      </SectionEyebrow>

      <Heading id={headingId} className={`mt-6 ${sectionHeading}`}>
        {heading}
      </Heading>

      {children}
    </header>
  );
}
