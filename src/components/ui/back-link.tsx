import type { ReactNode } from "react";
import Link from "next/link";
import { colorTransition, monoCaps } from "@/components/ui/styles";

/**
 * Return path out of a detail page, set above its title.
 *
 * The mirror of `ActionLink`: the same ruled label and the same 44px target,
 * but the arrow leads rather than trails and steps backwards on hover, so the
 * two read as opposite directions rather than as one link drawn twice. Set in
 * `monoCaps` — it is a position marker, not a call to action, and giving it
 * the body weight of `ActionLink` would make leaving the page compete with
 * the page.
 *
 * Always a real link to the index, never `router.back()`: someone arriving
 * from a search result has no history to go back to, and a browser already
 * owns the back gesture.
 */
export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-2 ${monoCaps} text-muted hover:text-accent ${colorTransition}`}
    >
      <span
        aria-hidden="true"
        className="shrink-0 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:-translate-x-1"
      >
        ←
      </span>
      <span
        className={`border-b border-transparent pb-0.5 group-hover:border-[var(--color-accent)] ${colorTransition}`}
      >
        {children}
      </span>
    </Link>
  );
}
