"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveHref, NAV_LINKS } from "./nav-links";
import { colorTransition, monoCaps } from "@/components/ui/styles";
import { site } from "@/data/site";
import { profile } from "@/data/profile";

const SECTION_INDEX = new Map(
  site.sections.map((section) => [section.href, section.index]),
);

/** Contacts the owner marked as publishable. */
const PRIMARY_CONTACT = profile.contact.filter((channel) => channel.primary);

const FOCUSABLE = "a[href], button:not([disabled])";

/** The `md` breakpoint, matching the `md:hidden` this component is wrapped in. */
const DESKTOP = "(min-width: 48rem)";

const toggleBtn = `flex h-11 min-w-11 items-center justify-center ${monoCaps} text-ink hover:text-accent ${colorTransition}`;

const menuLink = `flex items-baseline gap-4 py-3 font-display text-[length:var(--text-h1)] font-medium ${colorTransition}`;

const menuIndex =
  "font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)]";

// min-h-11 keeps these at a 44px touch target; at mono metadata size the
// text alone is only ~16px tall.
const contactLink = `inline-flex min-h-11 items-center ${monoCaps} text-secondary hover:text-accent ${colorTransition}`;

export function MobileNav() {
  const pathname = usePathname();

  /**
   * The menu is open *for a path*, not open in the abstract.
   *
   * Phase 6D made the menu links routes, so a tap navigates instead of
   * scrolling and the overlay has to come down on the way out. Storing the
   * path it was opened on gets that for free: when the route changes,
   * `openForPath` no longer matches and the panel is closed on the very same
   * render. A `useEffect` that called `setOpen(false)` on `pathname` would do
   * the same thing one render later, and would open the menu for a frame on
   * a back gesture. It is also what `react-hooks/set-state-in-effect` is
   * warning about.
   *
   * This covers the paths the click handler cannot: browser back and forward,
   * and any future navigation that does not originate in this component.
   */
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const open = openForPath === pathname;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpenForPath(null);
    triggerRef.current?.focus();
  }, []);

  /**
   * The trigger is inside a `md:hidden` wrapper, but the panel is portalled to
   * `<body>` with no breakpoint of its own. Widening the window past `md` with
   * the menu open therefore left a full-screen overlay up, the trigger that
   * dismisses it gone, and `body` still scroll-locked. Closing on the
   * breakpoint is the fix; focus is not returned to the trigger because at
   * that width the trigger is display:none and cannot take it.
   *
   * Subscribing is enough; there is no need to test `matches` on mount. The
   * only thing that sets `open` is the trigger, and the trigger does not exist
   * at or above this width, so the menu can never open already-desktop.
   */
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(DESKTOP);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpenForPath(null);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Focus moves into the overlay on open and is kept there while it is up:
    // the trigger and the page behind stay in the DOM, so without a trap the
    // next Tab walks straight out of the menu and behind the overlay.
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenForPath(open ? null : pathname)}
        className={toggleBtn}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Portalled to <body>. The header sets `backdrop-blur-sm`, and a
          backdrop-filter makes that element the containing block for any
          `position: fixed` descendant. Rendered in place, `inset-0` would
          resolve to the 64px header strip instead of the viewport. */}
      {open
        ? createPortal(
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[var(--color-bg)]"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-[var(--container-pad)]">
            <span className="font-display text-[length:var(--text-h3)] font-semibold text-ink">
              {site.shortName}
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={close}
              className={toggleBtn}
            >
              Close
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex-1 px-[var(--container-pad)] pt-6"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActiveHref(pathname, link.href);

                return (
                  <li
                    key={link.href}
                    className="border-b border-[var(--color-border)]"
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpenForPath(null)}
                      className={`${menuLink} ${
                        active ? "text-accent" : "text-ink hover:text-accent"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${menuIndex} ${
                          active ? "text-accent" : "text-muted"
                        }`}
                      >
                        {SECTION_INDEX.get(link.href)}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 px-[var(--container-pad)] py-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {PRIMARY_CONTACT.map((channel) => (
                <li key={channel.label}>
                  <a href={channel.href} className={contactLink}>
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}
