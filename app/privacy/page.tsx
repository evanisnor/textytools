import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Textytools data practices",
  description:
    "How Textytools processes tool content, browser storage, analytics, and feedback.",
  keywords: [
    "privacy policy",
    "privacy",
    "textytools",
    "browser storage",
    "analytics",
    "feedback",
    "data protection",
  ],
  alternates: {
    canonical: "https://textytools.dev/privacy",
  },
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold text-zinc-900 dark:text-zinc-50";
const paragraphClass = "text-zinc-600 dark:text-zinc-400 leading-relaxed";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          >
            ← back to textytools.dev
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: September 6, 2026
          </p>
        </div>

        <main className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
            <section className={sectionClass}>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                What this policy covers
              </h2>
              <p className={paragraphClass}>
                Tidalsoft operates <strong>textytools.dev</strong>. This policy
                explains the data handling built into the site as of the date
                above, including browser-based tools, site analytics, hosting,
                and the feedback form.
              </p>
              <p className={paragraphClass}>
                The catalogued tools process their inputs in your browser, but
                that does not mean the whole site operates without storage or
                network services. The specific boundaries are described below.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                1. Tool content and browser storage
              </h2>
              <p className={paragraphClass}>
                The nine tools listed on the home page perform their text and
                data transformations in client-side browser code. Their current
                inputs and settings are written to same-origin{" "}
                <code>sessionStorage</code> so work can survive a reload in the
                same tab.
              </p>
              <p className={paragraphClass}>
                This state is kept in that tab for the browser session. A
                browser&apos;s session-restore behavior may extend that
                lifetime, so Textytools does not promise an exact automatic
                deletion time. Supported cross-tool actions use a one-time
                session-storage key; the destination removes that transfer key
                after reading it and may then keep the content as its own
                temporary tool state.
              </p>
              <p className={paragraphClass}>
                Use a tool&apos;s Clear control where provided to remove its
                current content. Use your browser&apos;s site-data controls to
                remove all temporary tool content and settings. Browser
                extensions, device backups, synchronization, and clipboard
                history are controlled by your browser or device rather than by
                Textytools.
              </p>
              <p className={paragraphClass}>
                A small number of directly reachable, non-catalogued
                experimental pages currently save documents in same-origin{" "}
                <code>localStorage</code>. Those browser-local records remain
                until they are deleted in the page where a delete control is
                available or removed with browser site-data controls. They are
                not account data and are not synchronized by Textytools.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>2. Hosting and request data</h2>
              <p className={paragraphClass}>
                Vercel hosts the site. Loading a page or calling the feedback
                endpoint sends ordinary request information to that hosting
                service, such as an IP address, requested URL, time, browser or
                device information, and technical data needed to deliver and
                protect the service. Provider-controlled logs and security
                systems may retain that information under the provider&apos;s
                own practices.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>3. Google Analytics</h2>
              <p className={paragraphClass}>
                The production site uses Google Analytics to understand site and
                tool usage. Google Analytics can set or read analytics cookies
                and receive browser, device, approximate location, referral,
                page-view, and interaction information. Preview and staging
                deployments do not load production analytics by default.
              </p>
              <p className={paragraphClass}>
                Textytools application events may include the page URL and path,
                tool name, interaction type, selected modes or options, source
                and destination tools, and some exact interaction counts. The
                application does not intentionally attach raw editor input,
                transformed output, clipboard contents, or feedback fields to
                those events. Google may collect additional information through
                its own automatic measurement and cookies.
              </p>
              <p className={paragraphClass}>
                You can restrict or remove analytics cookies and site data using
                your browser settings or content-blocking controls. Textytools
                does not currently display a separate cookie-consent manager.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>4. Feedback</h2>
              <p className={paragraphClass}>
                Submitting the feedback form sends the name, email address, and
                message you enter to the Textytools feedback endpoint. The
                endpoint passes that information to Resend for email delivery
                and then to the configured Textytools mailbox. Tool content is
                not attached automatically, but it becomes part of the feedback
                if you put it in the message.
              </p>
              <p className={paragraphClass}>
                Resend and the receiving email service process delivery metadata
                and may retain the submission and related operational records.
                Tidalsoft may keep received feedback to respond, operate the
                service, and maintain a record of the conversation. Do not
                submit secrets or tool content you do not want included in that
                record.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                5. How information is used and shared
              </h2>
              <p className={paragraphClass}>
                Tidalsoft uses the information described above to deliver and
                secure the site, understand aggregate usage, improve the tools,
                and respond to feedback. Information is shared with service
                providers only as needed for hosting, analytics, email delivery,
                and related service operations.
              </p>
              <p className={paragraphClass}>
                Textytools does not currently run an advertising network or
                serve targeted advertising. The deployed application has no
                advertising or data-sale integration. Links to other sites are
                governed by those sites&apos; own practices.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                6. Retention, deletion, and choices
              </h2>
              <p className={paragraphClass}>
                Browser-held tool content can be removed as described in section
                1. Analytics and infrastructure data follow the settings and
                retention practices of the applicable provider. Feedback is not
                covered by a promised automatic deletion schedule.
              </p>
              <p className={paragraphClass}>
                Depending on where you live, you may have rights concerning
                personal information Tidalsoft controls. You may ask about,
                correct, or request deletion of feedback or other identifiable
                information by emailing{" "}
                <a
                  className="underline cursor-pointer"
                  href="mailto:contact@textytools.dev"
                >
                  contact@textytools.dev
                </a>
                . We may need enough information to locate the relevant record
                and may retain information where required or permitted for
                legal, security, or operational reasons.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>7. Children</h2>
              <p className={paragraphClass}>
                Textytools is not directed to children under 13. If you believe
                a child submitted personal information through the feedback
                form, contact us so we can review the request.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>8. Changes and contact</h2>
              <p className={paragraphClass}>
                We may update this policy when the site&apos;s data practices
                change. The date at the top identifies the current version.
                Questions or requests can be sent to{" "}
                <a
                  className="underline cursor-pointer"
                  href="mailto:contact@textytools.dev"
                >
                  contact@textytools.dev
                </a>
                .
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
