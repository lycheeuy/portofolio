import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { routeMetadata, siteUrl } from "@/lib/metadata";

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
 *
 * Share and crawl metadata (Phase 6G). `openGraph` and `twitter` are set
 * here so every route inherits `og:type`, `og:site_name`, and the card type;
 * Next fills `og:title` / `og:description` / `twitter:*` from each route's
 * own resolved title and description. No `og:image` is declared: the OG image
 * does not exist yet (`site.pending`), and a tag pointing at a missing file
 * is worse than none. `metadataBase`, canonical, and `og:url` follow
 * `site.url` (see `lib/metadata.ts`) and are absent while it is `null`.
 *
 * No `robots` field: index/follow is the crawler default, and an explicit
 * tag here would sit next to the `noindex` Next injects on the 404 route:
 * two robots tags on one page, one contradicting the other.
 */
const ORIGIN = siteUrl();

export const metadata: Metadata = {
  ...(ORIGIN ? { metadataBase: new URL(ORIGIN) } : {}),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  // Location comes from the data layer so metadata cannot drift from what
  // the footer and About page render.
  description: `${site.description} Based in ${profile.location}.`,
  authors: [{ name: profile.fullName }],
  creator: profile.fullName,
  twitter: { card: "summary" },
  ...routeMetadata("/"),
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