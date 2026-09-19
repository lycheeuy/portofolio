/**
 * Primary navigation targets.
 *
 * The list itself lives in `src/data/site.ts` so the data layer owns the
 * labels; this module stays as the import path the header, the mobile
 * overlay, and the footer already use.
 */
export { NAVIGATION as NAV_LINKS } from "@/data/site";

/**
 * Whether a nav target is the page currently being viewed.
 *
 * A detail page marks its index as current — `/projects/melonvision-ai`
 * lights "Projects" — because the reader is inside that part of the site and
 * a nav bar with nothing marked reads as though they are nowhere. `/` is the
 * exception: every path starts with it, so it matches exactly or not at all.
 */
export function isActiveHref(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
