"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveHref, NAV_LINKS } from "./nav-links";
import { colorTransition } from "@/components/ui/styles";
import { SECTIONS } from "@/data/site";

/**
 * Desktop primary navigation.
 *
 * The small mono index beside each label is looked up from `SECTIONS`, so the
 * archive numbering used on each page carries into the navigation from one
 * source. Indices are desktop-only: below `lg` there is not enough room for
 * them to read as structure rather than noise.
 *
 * A client component only because the current route decides which item is
 * marked. `aria-current="page"` is the announcement; the accent underline is
 * the sighted equivalent, and neither is inferred from the other.
 */
const SECTION_INDEX = new Map(
  SECTIONS.map((section) => [section.href, section.index]),
);

const navLink = `group flex items-baseline gap-2 py-3 font-sans text-[length:var(--text-small)] ${colorTransition}`;

const navIndex = `hidden font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] ${colorTransition} lg:inline`;

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-6 lg:gap-9">
        {NAV_LINKS.map((link) => {
          const active = isActiveHref(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`${navLink} ${
                  active ? "text-ink" : "text-secondary hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`${navIndex} ${
                    active
                      ? "text-accent"
                      : "text-[var(--color-border)] group-hover:text-accent"
                  }`}
                >
                  {SECTION_INDEX.get(link.href)}
                </span>
                {/* Transparent until hover, unlike the `ruledLabel` the pages
                    use: a visible hairline under all five nav items would draw
                    a second rule directly beneath the header's own. The
                    current page keeps its rule permanently; that is what
                    marks it. */}
                <span
                  className={`border-b pb-0.5 ${colorTransition} ${
                    active
                      ? "border-[var(--color-accent)]"
                      : "border-transparent group-hover:border-[var(--color-accent)]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
