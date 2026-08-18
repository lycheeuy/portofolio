"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "./nav-links";

const toggleBtn =
  "flex h-11 w-11 items-center justify-center font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-mono)] text-ink transition-colors hover:text-accent";

const menuLink =
  "block py-3 font-display text-[length:var(--text-h1)] font-medium text-ink transition-colors hover:text-accent";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className={toggleBtn}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div id="mobile-menu" className="fixed inset-0 z-50 bg-[var(--color-bg)]">
          <div className="flex items-center justify-between px-[var(--container-pad)] py-5">
            <span className="font-display text-[length:var(--text-h3)] font-semibold text-ink">
              Alif.
            </span>
            <button type="button" aria-label="Close menu" onClick={close} className={toggleBtn}>
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="px-[var(--container-pad)] pt-8">
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className={menuLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}