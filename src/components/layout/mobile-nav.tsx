"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NAV_LINKS } from "./nav-links";
import { site } from "@/data/site";
import { profile } from "@/data/profile";

const SECTION_INDEX = new Map(
  site.sections.map((section) => [`#${section.id}`, section.index]),
);

/** Contacts the owner marked as publishable. */
const PRIMARY_CONTACT = profile.contact.filter((channel) => channel.primary);

const FOCUSABLE = "a[href], button:not([disabled])";

const toggleBtn =
  "flex h-11 min-w-11 items-center justify-center font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-label)] text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

const menuLink =
  "flex items-baseline gap-4 py-3 font-display text-[length:var(--text-h1)] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent";

const menuIndex =
  "font-mono text-[length:var(--text-label)] tracking-[var(--tracking-mono)] text-muted";

// min-h-11 keeps these at a 44px touch target; at mono metadata size the
// text alone is only ~16px tall.
const contactLink =
  "inline-flex min-h-11 items-center font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-label)] text-secondary transition-colors duration-[var(--duration-fast)] hover:text-accent";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

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
        onClick={() => setOpen((value) => !value)}
        className={toggleBtn}
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Portalled to <body>. The header sets `backdrop-blur-sm`, and a
          backdrop-filter makes that element the containing block for any
          `position: fixed` descendant — rendered in place, `inset-0` would
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
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-[var(--color-border)]">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={menuLink}
                  >
                    <span aria-hidden="true" className={menuIndex}>
                      {SECTION_INDEX.get(link.href)}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
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
