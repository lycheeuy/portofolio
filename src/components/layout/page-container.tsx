import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centers content within the editorial max width and applies the
 * consistent horizontal page margin. Used by the header and every section
 * so vertical alignment stays consistent down the whole page.
 */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)]",
        className,
      )}
    >
      {children}
    </div>
  );
}