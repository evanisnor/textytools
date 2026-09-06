import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Textytools data practices",
  description:
    "Privacy Policy describing how Textytools handles tool content, browser storage, analytics, feedback, and privacy requests.",
  keywords: [
    "privacy policy",
    "privacy",
    "textytools",
    "browser storage",
    "analytics",
    "feedback",
    "data protection",
    "GDPR",
    "CCPA",
  ],
  alternates: {
    canonical: "https://textytools.dev/privacy",
  },
};

const sectionClass = "space-y-3";
const headingClass = "text-xl font-semibold text-zinc-900 dark:text-zinc-50";
const paragraphClass = "text-zinc-600 dark:text-zinc-400 leading-relaxed";
const listClass = "text-zinc-600 dark:text-zinc-400 space-y-2";
const linkClass =
  "underline cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-50";

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

        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Effective date and last updated: September 6, 2026
          </p>
        </header>

        <main className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
            <section className={sectionClass}>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Introduction
              </h2>
              <p className={paragraphClass}>
                Tidalsoft (“Tidalsoft,” “we,” “us,” or “our”) owns and operates{" "}
                <strong>textytools.dev</strong> (the “Site”). This Privacy
                Policy describes how information is collected, used, disclosed,
                stored, and otherwise processed when a person visits or uses the
                Site.
              </p>
              <p className={paragraphClass}>
                This Privacy Policy applies only to the Site. It does not apply
                to third-party websites or services linked from the Site, which
                are governed by their own terms and privacy notices.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>1. Information We Process</h2>

              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                1.1 Tool Content
              </h3>
              <p className={paragraphClass}>
                The nine tools listed on the home page perform their text and
                data transformations in client-side browser code. Their current
                inputs and settings are written to same-origin{" "}
                <code>sessionStorage</code> so work can survive a reload in the
                same tab. Textytools does not automatically attach raw tool
                input or transformed output to application-authored analytics
                events or feedback submissions.
              </p>
              <p className={paragraphClass}>
                Browser-local processing is not the same as zero retention or
                zero network activity. Section 2 describes browser storage, and
                sections 3 and 4 describe information transmitted through
                hosting, analytics, and feedback services.
              </p>

              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                1.2 Information Submitted Through Feedback
              </h3>
              <p className={paragraphClass}>
                The feedback form collects the name, email address, and message
                a person chooses to submit. Tool content is not attached
                automatically, but it becomes part of the feedback submission if
                the person includes it in the message.
              </p>

              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                1.3 Automatically Collected Information
              </h3>
              <p className={paragraphClass}>
                When a person visits the Site, hosting and analytics services
                may process technical and usage information such as IP address,
                requested URL, date and time, referrer, browser and device
                information, approximate location, page views, interactions, and
                cookie or similar identifiers.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>2. Browser Storage</h2>
              <p className={paragraphClass}>
                The nine catalogued tools keep current content and settings in
                same-origin <code>sessionStorage</code>. This state is kept in
                the applicable tab for the browser session. Browser session
                restoration may extend that lifetime, so Textytools does not
                promise an exact automatic deletion time.
              </p>
              <p className={paragraphClass}>
                Supported cross-tool actions place content in a one-time
                session-storage transfer key. The destination tool removes that
                transfer key after reading it and may then keep the content as
                its own temporary tool state.
              </p>
              <p className={paragraphClass}>
                A tool&apos;s Clear control removes its current content but may
                retain tool preferences. Browser site-data controls can remove
                all stored content and settings for the Site.
              </p>
              <p className={paragraphClass}>
                A small number of directly reachable, non-catalogued
                experimental pages currently save documents in same-origin{" "}
                <code>localStorage</code>. Those records remain until they are
                deleted in the page where a delete control is available or
                removed through browser site-data controls. They are not account
                records and are not synchronized by Textytools.
              </p>
              <p className={paragraphClass}>
                Browser extensions, device backups, browser synchronization, and
                clipboard history are controlled by the applicable browser or
                device, not by Textytools.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                3. Hosting and Technical Operations
              </h2>
              <p className={paragraphClass}>
                Vercel hosts the Site. Loading a page or calling the feedback
                endpoint sends ordinary request information to Vercel, including
                technical information needed to deliver, operate, diagnose, and
                protect the Site. Provider-controlled logs and security systems
                may retain this information under Vercel&apos;s practices. For
                more information, see the{" "}
                <a
                  className={linkClass}
                  href="https://vercel.com/legal/privacy-notice"
                >
                  Vercel Privacy Notice
                </a>
                .
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>4. Analytics and Cookies</h2>
              <p className={paragraphClass}>
                The production Site uses Google Analytics to understand Site and
                tool usage. Google Analytics loads network resources, sends
                measurement requests, and may set or read analytics cookies such
                as <code>_ga</code>. Preview and staging deployments do not load
                the production analytics configuration by default.
              </p>
              <p className={paragraphClass}>
                Textytools application-authored events may include the page URL
                and path, tool name, interaction type, selected modes or
                options, source and destination tools, and some exact
                interaction counts. Google may process additional information
                through its automatic measurement and cookie behavior. Google
                describes that processing in its{" "}
                <a
                  className={linkClass}
                  href="https://policies.google.com/technologies/partner-sites"
                >
                  partner sites notice
                </a>{" "}
                and{" "}
                <a
                  className={linkClass}
                  href="https://policies.google.com/privacy"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p className={paragraphClass}>
                A person can restrict or remove cookies and other site data
                using browser settings or content-blocking controls. The Site
                does not currently display a separate cookie-consent manager.
                Where applicable law requires consent before non-essential
                analytics cookies are used, the analytics configuration remains
                subject to that requirement.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>5. Feedback Communications</h2>
              <p className={paragraphClass}>
                Submitting feedback sends the provided name, email address, and
                message to the Textytools feedback endpoint. The endpoint passes
                that information to Resend for email delivery and then to the
                configured Textytools mailbox. Resend and the receiving email
                provider also process delivery and operational metadata.
              </p>
              <p className={paragraphClass}>
                Tidalsoft may retain feedback to respond, operate the Site, and
                maintain a record of the communication. A person should not
                submit passwords, access tokens, confidential tool content, or
                other information they do not want included in that
                communication. For more information about the delivery provider,
                see the{" "}
                <a
                  className={linkClass}
                  href="https://resend.com/legal/privacy-policy"
                >
                  Resend Privacy Policy
                </a>
                .
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>6. Purposes of Processing</h2>
              <p className={paragraphClass}>
                Tidalsoft processes the information described in this Privacy
                Policy for the following purposes:
              </p>
              <ul className={listClass}>
                <li>to provide, maintain, and secure the Site;</li>
                <li>to complete actions a person requests;</li>
                <li>to diagnose errors, abuse, and operational problems;</li>
                <li>
                  to understand Site and tool usage and improve the product;
                </li>
                <li>to receive and respond to feedback; and</li>
                <li>to comply with applicable legal obligations.</li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>7. Disclosure of Information</h2>
              <p className={paragraphClass}>
                Tidalsoft discloses information to service providers as
                necessary for Site hosting and security, analytics, email
                delivery, and related operations. The current service-provider
                boundaries are Vercel, Google Analytics, Resend, and the
                configured receiving email provider.
              </p>
              <p className={paragraphClass}>
                Tidalsoft may also disclose information where reasonably
                necessary to comply with applicable law or legal process;
                protect the rights, safety, and security of Tidalsoft, the Site,
                or others; investigate fraud or abuse; or complete a corporate
                transaction subject to appropriate legal requirements.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>8. Advertising; Sale or Sharing</h2>
              <p className={paragraphClass}>
                The Site does not currently run an advertising-network
                integration or serve targeted advertising. The deployed
                application has no advertising or data-sale integration. Google
                Analytics nevertheless receives the information described in
                section 4, and the legal characterization of a disclosure may
                depend on applicable law and provider configuration.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>9. Retention and Deletion</h2>
              <p className={paragraphClass}>
                Browser-held tool content can be removed as described in section
                2. Analytics and infrastructure information follow the
                applicable account settings and provider retention practices.
                Feedback is not covered by a promised automatic deletion
                schedule and may be kept for the purposes stated in this Privacy
                Policy.
              </p>
              <p className={paragraphClass}>
                A person may request deletion of identifiable information that
                Tidalsoft controls by using the contact information in section
                15. Tidalsoft may retain information where necessary or
                permitted for legal obligations, security, fraud prevention,
                dispute resolution, or the establishment, exercise, or defence
                of legal claims.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>10. Information Security</h2>
              <p className={paragraphClass}>
                The Site limits disclosure of tool content by processing the
                catalogued tools in the browser and by not automatically
                attaching raw tool content to application-authored analytics
                events or feedback. Tidalsoft also relies on access controls,
                deployment practices, and provider safeguards. No method of
                transmission, browser storage, or electronic storage is
                completely secure, and Tidalsoft cannot guarantee absolute
                security.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>11. International Data Transfers</h2>
              <p className={paragraphClass}>
                Tidalsoft is a Canadian company. Its service providers may
                process information in Canada, the United States, and other
                countries where they or their subprocessors operate. Information
                processed outside a person&apos;s country may be subject to the
                laws and lawful access requirements of that jurisdiction. This
                Privacy Policy does not represent that a particular transfer
                mechanism applies unless it has been separately verified for the
                relevant processing.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>12. Canadian Privacy Rights</h2>
              <p className={paragraphClass}>
                Subject to applicable Canadian privacy law, a person may request
                access to personal information Tidalsoft holds about them,
                challenge its accuracy or completeness, request an appropriate
                correction, withdraw consent where processing depends on
                consent, or challenge Tidalsoft&apos;s compliance with
                applicable privacy obligations.
              </p>
              <p className={paragraphClass}>
                Requests may be submitted using section 15. A person may also
                have the right to complain to the{" "}
                <a
                  className={linkClass}
                  href="https://www.priv.gc.ca/en/report-a-concern/"
                >
                  Office of the Privacy Commissioner of Canada
                </a>{" "}
                or another applicable privacy regulator.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                13. European Economic Area and United Kingdom Rights
              </h2>
              <p className={paragraphClass}>
                Where the General Data Protection Regulation or United Kingdom
                data protection law applies, and subject to the conditions and
                exceptions in that law, a person may have the right to:
              </p>
              <ul className={listClass}>
                <li>request access to their personal data;</li>
                <li>request correction of inaccurate or incomplete data;</li>
                <li>request erasure or restriction of processing;</li>
                <li>receive qualifying data in a portable format;</li>
                <li>object to qualifying processing;</li>
                <li>
                  withdraw consent where processing relies on consent; and
                </li>
                <li>
                  lodge a complaint with an applicable supervisory authority.
                </li>
              </ul>
              <p className={paragraphClass}>
                These rights are not absolute. Requests may be submitted using
                section 15. The official text of the European Union regulation
                is available through{" "}
                <a
                  className={linkClass}
                  href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
                >
                  EUR-Lex
                </a>
                .
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>14. California Privacy Rights</h2>
              <p className={paragraphClass}>
                If the California Consumer Privacy Act, as amended, applies to
                Tidalsoft&apos;s processing of a California resident&apos;s
                personal information, and subject to the law&apos;s conditions
                and exceptions, the resident may have rights to know, access,
                delete, and correct personal information; opt out of a
                qualifying sale or sharing; limit qualifying uses of sensitive
                personal information; and not receive discriminatory treatment
                for exercising those rights.
              </p>
              <p className={paragraphClass}>
                Requests may be submitted using section 15. Further information
                is available from the{" "}
                <a className={linkClass} href="https://oag.ca.gov/privacy/ccpa">
                  California Attorney General
                </a>
                .
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>15. Contact and Privacy Requests</h2>
              <p className={paragraphClass}>
                Questions, complaints, and privacy requests may be submitted to:
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Tidalsoft</strong>
                </li>
                <li>
                  Email:{" "}
                  <a className={linkClass} href="mailto:contact@textytools.dev">
                    contact@textytools.dev
                  </a>
                </li>
                <li>
                  Website:{" "}
                  <a className={linkClass} href="https://textytools.dev">
                    https://textytools.dev
                  </a>
                </li>
              </ul>
              <p className={paragraphClass}>
                Tidalsoft may request information reasonably necessary to verify
                a requester&apos;s identity, authority, and the records to which
                the request relates.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>16. Children&apos;s Privacy</h2>
              <p className={paragraphClass}>
                The Site is not directed to children under 13. If a parent or
                guardian believes that a child submitted personal information
                through the feedback form, they may contact Tidalsoft using
                section 15 so the matter can be reviewed.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>
                17. Changes to This Privacy Policy
              </h2>
              <p className={paragraphClass}>
                Tidalsoft may update this Privacy Policy when the Site&apos;s
                data practices or applicable requirements change. The “last
                updated” date identifies the current version. Material changes
                will be presented as required by applicable law.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
