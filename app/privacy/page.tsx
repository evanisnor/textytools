import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - textytools.dev",
  description:
    "Privacy policy for textytools.dev. We do not collect, store, or share any user data.",
  keywords: [
    "privacy policy",
    "privacy",
    "textytools",
    "data collection",
    "cookies",
    "gdpr",
    "data protection",
    "no user data",
    "privacy practices",
  ],
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← back to textytools.dev
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: November 16, 2025
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Overview
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Welcome to <strong>textytools.dev</strong> (“we,” “our,” or
                “us”). This Privacy Policy describes how we handle information
                when you visit our website{" "}
                <a className="underline" href="https://textytools.dev">
                  https://textytools.dev
                </a>{" "}
                (the “Site”).
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                By using the Site you agree to the practices described in this
                policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                1. Information We Collect
              </h3>

              <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                1.1 Personal Information
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We do <strong>not</strong> collect, store, or process personally
                identifiable information (PII). The Site does not require
                accounts, sign-ins, or user uploads.
              </p>

              <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mt-4">
                1.2 Automatically Collected Data
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Although we do not collect personal data directly, third-party
                analytics and advertising services used on the Site may
                automatically collect limited data via cookies and similar
                technologies. This may include:
              </p>
              <ul>
                <li>IP address (often anonymized by providers)</li>
                <li>Browser and device type</li>
                <li>Pages visited and time on site</li>
                <li>Referring website</li>
                <li>General usage patterns</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                2. Cookies &amp; Tracking Technologies
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We use cookies and similar tracking technologies for analytics
                and advertising purposes.
              </p>

              <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mt-3">
                2.1 Analytics
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We use analytics providers to understand how visitors use the
                Site and to improve the Site experience. Analytics cookies
                typically store anonymized usage data and do not provide us with
                personally identifiable information.
              </p>

              <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mt-3">
                2.2 Advertising
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We work with advertising networks that may use cookies to
                deliver targeted ads, measure ad performance, and prevent
                repeated displays. These third-party ad partners may track
                browsing behavior across websites to provide personalized
                advertising.
              </p>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                You can manage or disable cookies through your browser settings
                or via cookie preference controls where provided.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                3. How We Use Data
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Any data collected by third-party analytics or advertising
                partners is used for:
              </p>
              <ul>
                <li>Understanding Site usage</li>
                <li>Improving Site functionality</li>
                <li>Supporting ad-based revenue</li>
                <li>Measuring and improving ad performance</li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We do not combine or cross-reference data to identify individual
                visitors.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                4. Third-Party Services
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We may use third-party services for analytics, advertising, and
                cookie consent management. These third parties have their own
                privacy policies and may store or process data on servers
                located outside your country.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We do not sell or directly share personal data. However,
                third-party partners may collect information independently for
                their own purposes consistent with applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                5. GDPR (EU/EEA Users)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                If you are located in the EU or EEA, you have the following
                rights with respect to personal data processed by third-party
                providers:
              </p>
              <ul>
                <li>Access any personal data held about you</li>
                <li>Request correction or deletion of inaccurate data</li>
                <li>Object to or restrict processing</li>
                <li>Withdraw consent to cookie-based tracking</li>
                <li>
                  File a complaint with your local data protection authority
                </li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We provide cookie consent controls to help you exercise your
                rights.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                6. CCPA (California Residents)
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Under the California Consumer Privacy Act (CCPA), California
                residents have rights including:
              </p>
              <ul>
                <li>
                  Knowing what categories of personal data third parties may
                  collect
                </li>
                <li>
                  Opting out of the “sale” or “sharing” of personal data, where
                  applicable
                </li>
                <li>
                  Requesting deletion of personal data held by third parties
                </li>
                <li>
                  Not being discriminated against for exercising privacy rights
                </li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Although we do not collect personal data directly, our
                advertising partners may collect data subject to CCPA. We
                provide mechanisms to opt out of targeted advertising where
                required.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                7. Children’s Privacy
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The Site is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
                If you believe a child has provided personal information to a
                third-party provider via the Site, please contact us and we will
                work with providers to address the issue.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                8. Data Security
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We do not store user data directly. Third-party providers
                implement their own security measures; we select providers that
                comply with GDPR, CCPA, and industry standards wherever
                possible.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                9. International Data Transfers
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Third-party analytics and advertising partners may transfer data
                across international borders. Such transfers are governed by
                mechanisms like Standard Contractual Clauses (SCCs), adequacy
                decisions, or other GDPR-compliant measures when applicable.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                10. Changes to This Privacy Policy
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We may update this Privacy Policy from time to time. The “Last
                updated” date at the top reflects the most recent version.
                Continued use of the Site constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                11. Contact Us
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                If you have questions or concerns about this Privacy Policy or
                your privacy rights, please contact us at:
              </p>
              <ul>
                <li>
                  <strong>Website:</strong>{" "}
                  <a className="underline" href="https://textytools.dev">
                    https://textytools.dev
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a className="underline" href="mailto:contact@textytools.dev">
                    contact@textytools.dev
                  </a>
                </li>
                <li>
                  <strong>Site name:</strong> textytools.dev
                </li>
              </ul>
            </section>

            <footer className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                This Privacy Policy applies only to the Site and does not govern
                the practices of third-party websites, services, or platforms
                linked from or used on the Site.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
