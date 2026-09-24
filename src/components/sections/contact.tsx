import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  arrowStep,
  colorTransition,
  leadText,
  metaLabel,
  monoMeta,
  ruledLabel,
} from "@/components/ui/styles";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

/**
 * Contact: the `/contact` page, and the site's closing statement.
 *
 * Every address comes from `profile.contact`. No URL, handle, or number is
 * written here.
 *
 * **Only `primary` channels are rendered.** The flag was introduced in Phase
 * 5E so the contact section could publish email, LinkedIn, and GitHub while
 * keeping anything else out of default page content. The phone number that
 * once sat behind it was removed from the repository in Phase 6H (it was
 * never rendered); the filter stays so a future non-public channel is handled
 * the same way.
 */

const CONTACT = site.sections.find((section) => section.href === "/contact");
const CONTACT_INDEX = CONTACT?.index ?? "04";
const CONTACT_LABEL = CONTACT?.label ?? "Contact";

const PRIMARY = profile.contact.filter((channel) => channel.primary);

/**
 * The headline action is whichever primary channel is an email, found by URI
 * scheme rather than by matching the label string; the scheme is what makes
 * it an email, and it survives the label being renamed or translated. If none
 * exists the section simply lists every primary channel instead, with no
 * headline.
 */
const EMAIL = PRIMARY.find((channel) => channel.href.startsWith("mailto:"));

const OTHER_CHANNELS = PRIMARY.filter((channel) => channel !== EMAIL);

/** True for channels that leave the site, so they can be marked as such. */
const isExternal = (href: string) => /^https?:/.test(href);

/* ------------------------------------------------------------------ */

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <SectionHeader
        index={CONTACT_INDEX}
        meta={profile.availability}
        marker
        heading={CONTACT_LABEL}
        headingId="contact-heading"
        level={1}
        className="max-w-[46ch]"
      >
        {/* Deliberately not a call to action. The availability line above is
            the offer; this is just an open door. */}
        <p className={`mt-6 ${leadText} text-secondary`}>
          Questions about anything on this site are welcome too. An email is
          enough to start.
        </p>
      </SectionHeader>

      {EMAIL ? (
        <div className="mt-12 border-t border-[var(--color-ink)] pt-8 lg:mt-16">
          <h2 className={metaLabel}>{EMAIL.label}</h2>
          {/* break-all rather than break-words: an address is one long token
              with no spaces, so normal wrapping cannot break it and it would
              run past a 375px column. */}
          <a
            href={EMAIL.href}
            className={`group mt-3 inline-flex min-h-11 items-center font-mono text-[length:var(--text-h3)] leading-[var(--leading-heading)] tracking-[var(--tracking-mono)] break-all text-ink hover:text-accent ${colorTransition}`}
          >
            {/* `pb-1` rather than the shared `ruledLabel`'s `pb-0.5`: this
                is the one 20-26px link on the page, and a hairline set half a
                pixel under it reads as a strikethrough at that size. */}
            <span
              className={`border-b border-[var(--color-border)] pb-1 group-hover:border-[var(--color-accent)] ${colorTransition}`}
            >
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
                <h2 className={metaLabel}>{channel.label}</h2>
                <a
                  href={channel.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  /* `relative` so the sr-only note below resolves against
                     this link rather than the initial containing block;
                     see §11 of the development log. */
                  className={`group relative mt-2 inline-flex min-h-11 items-center gap-2 break-all ${monoMeta} text-ink hover:text-accent ${colorTransition}`}
                >
                  <span className={ruledLabel}>{channel.value}</span>
                  <span aria-hidden="true" className={arrowStep}>
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
