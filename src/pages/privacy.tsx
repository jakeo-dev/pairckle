import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import { faShield } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Privacy() {
  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.1vh]">
          <Heading
            icon={faShield}
            title="Privacy Policy"
            subtext2="Last updated: August 20, 2026"
          />

          <div className="section w-full">
            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Introduction
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              This Privacy Policy for Pairckle describes how and why your
              information may be accessed, collected, stored, used, and/or
              shared when you visit this website.
            </p>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              By using Pairckle, you agree to the collection and use of
              information in accordance with this policy. If you have any
              questions, please contact us at{" "}
              <a
                className="link"
                href="mailto:privacy@jakeo.dev"
                target="_blank"
              >
                privacy@jakeo.dev
              </a>
              .
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Information We Collect
            </h2>

            <h3
              className={`mb-4 mt-6 flex w-fit items-center text-lg font-medium md:text-xl ${gabarito.className}`}
            >
              Account & Contributions
            </h3>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              When you create an account with Pairckle, we collect:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">Email address</li>
              <li className="leading-7">Display name</li>
              <li className="leading-7">Device type and browser information</li>
              <li className="leading-7">Traffic sources</li>
            </ul>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              When you contribute to Pairckle while logged in, we store:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">
                The content, including the title and items, of a submitted
                ranking or set
              </li>
              <li className="leading-7">
                The date and time of when you submit a ranking or set
              </li>
            </ul>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              We do not sell or share your personal information with third
              parties for marketing purposes. You may delete your account and
              all associated personal data at any time by contacting us at{" "}
              <a
                className="link"
                href="mailto:privacy@jakeo.dev"
                target="_blank"
              >
                privacy@jakeo.dev
              </a>
              .
            </p>

            <h3
              className={`mb-4 mt-6 flex w-fit items-center text-lg font-medium md:text-xl ${gabarito.className}`}
            >
              Analytics
            </h3>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              This website uses Vercel Analytics to collect basic usage
              statistics, such as:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">Pages visited</li>
              <li className="leading-7">
                Approximate region (such as country)
              </li>
              <li className="leading-7">Device type and browser information</li>
              <li className="leading-7">Traffic sources</li>
            </ul>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Third-Party Services
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              We use the following third-party services that may collect or
              process your data:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">
                This website is hosted on Vercel and uses Vercel Analytics. See{" "}
                <a
                  className="link"
                  href="https://vercel.com/legal/privacy-notice"
                  target="_blank"
                >
                  {`Vercel's Privacy Policy`}
                </a>
                .
              </li>
              <li className="leading-7">
                We use Supabase to store your account information. See{" "}
                <a
                  className="link"
                  href="https://supabase.com/privacy"
                  target="_blank"
                >
                  {`Supabase's Privacy Policy`}
                </a>
                .
              </li>
              <li className="leading-7">
                We use Cloudflare to protect against malicious traffic.
                Cloudflare may collect information such as your IP address and
                approximate region. See{" "}
                <a
                  className="link"
                  href="https://www.cloudflare.com/policies/privacy/"
                  target="_blank"
                >
                  {`Cloudflare's Privacy Policy`}
                </a>
                .
              </li>
              <li className="leading-7">
                We use Brevo to send emails for account creation. See{" "}
                <a
                  className="link"
                  href="https://www.cloudflare.com/policies/privacy/"
                  target="_blank"
                >
                  {`Brevo's Privacy Policy`}
                </a>
                .
              </li>
            </ul>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Data Security
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              The security of your personal information is important to us, so
              we implement appropriate measures to protect your data. However,
              no method of transmission over the internet is fully secure, so we
              cannot guarantee absolute security.
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Changes to This Privacy Policy
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              {`We may update this Privacy Policy in the future. We will notify
              you of any changes made by posting them on this page and updating
              the "Last updated" text. Your continued use of our services after
              such changes means you accept the new Privacy Policy.`}
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Contact
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              For any questions about this Privacy Policy, please contact us at{" "}
              <a
                className="link"
                href="mailto:privacy@jakeo.dev"
                target="_blank"
              >
                privacy@jakeo.dev
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
