import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageContainer } from "./page-container";

/**
 * Semantic section wrapper. Establishes consistent vertical rhythm between
 * sections and provides the anchor id for in-page navigation. Content is
 * centered within the shared page container so all sections align.
 */
export function Section({
  id,
  children,
  className,
  label,
  labelledBy,
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
  /** Optional accessible label when the section has no visible heading yet. */
  label?: string;
  /**
   * id of the section's visible heading. Preferred over `label` once a
   * section has one: it names the landmark from the heading the reader can
   * actually see, instead of duplicating that text in an invisible attribute.
   */
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      className={cn("py-[var(--spacing-section)]", className)}
    >
      <PageContainer>{children}</PageContainer>
    </section>
  );
}