import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

const fraunces = localFont({
  src: [
    { path: "../../public/fonts/fraunces-variable-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/fraunces-variable-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = localFont({
  src: [
    { path: "../../public/fonts/dm-sans-variable-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/dm-sans-variable-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../../public/fonts/jetbrains-mono-variable-normal.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * `template` applies to every route that sets its own title; `default` is the
 * homepage's. Both come from `site.ts`, so the tab title and the wordmark
 * cannot disagree.
 */
export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  // Location comes from the data layer so metadata cannot drift from what
  // the footer and About page render.
  description: `${site.description} Based in ${profile.location}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      {/*
        Header and footer moved here in Phase 6D. They are identical on every
        route, so rendering them in the layout keeps one instance across a
        client-side navigation instead of unmounting and rebuilding them per
        page.

        `main` is the skip-link target on every route, so it carries
        tabIndex={-1} to be programmatically focusable without entering the
        tab order.
      */}
      <body>
        <SiteHeader />
        <main id="top" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}