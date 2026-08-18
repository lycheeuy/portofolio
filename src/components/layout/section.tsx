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
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
  /** Optional accessible label when the section has no visible heading yet. */
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("py-[var(--spacing-section)]", className)}
    >
      <PageContainer>{children}</PageContainer>
    </section>
  );
}