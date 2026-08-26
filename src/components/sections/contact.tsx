import { Section } from "@/components/layout/section";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * Contact — the `#contact` section, and the page's closing statement.
 *
 * Every address comes from `profile.contact`. No URL, handle, or number is
 * written here.
 *
 * **The phone number is deliberately not rendered.** It is in the data with
 * `primary: false`, and the Phase 5E decision that introduced that flag says
 * exactly why: the flag exists so the contact section can publish email,
 * LinkedIn, and GitHub "while treating the phone number as a deliberate opt-in
 * rather than default page content". Filtering on `primary` honours that
 * rather than re-deciding it here.
 */

const CONTACT = site.sections.find((section) => section.id === "contact");
const CONTACT_INDEX = CONTACT?.index ?? "04";
const CONTACT_LABEL = CONTACT?.label ?? "Contact";

const PRIMARY = profile.contact.filter((channel) => channel.primary);

/**
 * The headline action is whichever primary channel is an email, found by URI
 * scheme rather than by matching the label string — the scheme is what makes
 * it an email, and it survives the label being renamed or translated. If none
 * exists the section simply lists every primary channel instead, with no
 * headline.
 */
const EMAIL = PRIMARY.find((channel) => channel.href.startsWith("mailto:"));

const OTHER_CHANNELS = PRIMARY.filter((channel) => channel !== EMAIL);

/** True for channels that leave the site, so they can be marked as such. */
const isExternal = (href: string) => /^https?:/.test(href);

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const metaLabel =
  "font-mono text-[length:var(--text-label)] uppercase tracking-[var(--tracking-label)] text-muted";

/* ------------------------------------------------------------------ */

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <header className="max-w-[46ch]">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] text-muted">
            {CONTACT_INDEX}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-8 bg-[var(--color-border)]"
          />
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
          />
          <span className={metaLabel}>{profile.availability}</span>
        </div>

        <h2
          id="contact-heading"
          className="mt-6 font-display text-[length:var(--text-display)] font-semibold leading-[var(--leading-display)] tracking-[var(--tracking-tight)] text-ink"
        >
          {CONTACT_LABEL}
        </h2>

        {/* Deliberately not a call to action. The availability line above is
            the offer; this is just an open door. */}
        <p className="mt-6 font-sans text-[length:var(--text-body-lg)] leading-[var(--leading-relaxed)] text-secondary">
          Questions about anything on this page are welcome too. An email is
          enough to start.
        </p>
      </header>

      {EMAIL ? (
        <div className="mt-12 border-t border-[var(--color-ink)] pt-8 lg:mt-16">
          <h3 className={metaLabel}>{EMAIL.label}</h3>
          {/* break-all rather than break-words: an address is one long token
              with no spaces, so normal wrapping cannot break it and it would
              run past a 375px column. */}
          <a
            href={EMAIL.href}
            className="group mt-3 inline-flex min-h-11 items-center font-mono text-[length:var(--text-h3)] leading-[var(--leading-heading)] tracking-[var(--tracking-mono)] break-all text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent"
          >
            <span className="border-b border-[var(--color-border)] pb-1 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]">
              {EMAIL.value}
            </span>
          </a>
        </div>
      ) : null}

      {OTHER_CHANNELS.length > 0 ? (
        <ul className="mt-12 grid grid-cols-1 gap-x-8 border-t border-[var(--color-border)] sm:grid-cols-2">
          {OTHER_CHANNELS.map((channel) => {
            const external = isExternal(channel.href);
            return (
              <li
                key={channel.label}
                className="min-w-0 border-b border-[var(--color-border)] py-6"
              >
                <h3 className={metaLabel}>{channel.label}</h3>
                <a
                  href={channel.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  /* `relative` so the sr-only note below resolves against
                     this link rather than the initial containing block —
                     see §11 of the development log. */
                  className="group relative mt-2 inline-flex min-h-11 items-center gap-2 font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-mono)] break-all text-ink transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  <span className="border-b border-[var(--color-border)] pb-0.5 transition-colors duration-[var(--duration-fast)] group-hover:border-[var(--color-accent)]">
                    {channel.value}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-editorial)] group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                  {/* A link that swaps the tab out from under someone should
                      say so; the arrow only tells sighted users. */}
                  {external ? (
                    <span className="sr-only">(opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Section>
  );
}
