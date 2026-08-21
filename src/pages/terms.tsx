import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
import Link from "next/link";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Terms() {
  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.1vh]">
          <Heading
            icon={faBalanceScale}
            title="Terms of Service"
            subtext2="Last updated: August 20, 2026"
          />

          <div className="section w-full">
            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Introduction
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              These Terms of Service for Pairckle describe how you are allowed
              to use the website. By using Pairckle, you agree to be bound by
              these Terms. If you have any questions, please contact us at{" "}
              <a
                className="link"
                href="mailto:support@jakeo.dev"
                target="_blank"
              >
                support@jakeo.dev
              </a>
              .
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              User Accounts
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              To contribute publicly, you may create an account. You are
              responsible for maintaining the confidentiality of your account
              and all activity that occurs under your account.
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              User Conduct
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              You agree to use our services responsibly and not to:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">
                Use the service for any unlawful purpose
              </li>
              <li className="leading-7">
                Attempt to gain unauthorized access to any part of the service,
                including underlying systems and other accounts
              </li>
              <li className="leading-7">
                Misrepresent or impersonate another person or identity
              </li>
              <li className="leading-7">Harass other users</li>
            </ul>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Privacy
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              We store user data such as:
            </p>
            <ul className="mt-4 list-inside list-disc pl-4 text-neutral-800 marker:text-neutral-500 dark:text-neutral-200">
              <li className="leading-7">Emails</li>
              <li className="leading-7">Display names</li>
              <li className="leading-7">
                The content of submitted rankings or sets
              </li>
              <li className="leading-7">Usage analytics</li>
            </ul>
            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              Please see our{" "}
              <Link className="link" href="/privacy" target="_blank">
                Privacy Policy
              </Link>{" "}
              for more information on how your data is handled.
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Termination
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              You may terminate your account at any time by contacting us at{" "}
              <a
                className="link"
                href="mailto:support@jakeo.dev"
                target="_blank"
              >
                support@jakeo.dev
              </a>
              . We reserve the right to suspend or terminate your access to our
              services, with or without notice, if you violate these Terms or
              for any other reason at our discretion.
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Changes to These Terms
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              {`We may update these Terms in the future. We will notify you of any
              changes made by posting them on this page and updating the "Last
              updated" text. Your continued use of our services after such
              changes means you accept the new Terms.`}
            </p>

            <h2
              className={`mb-4 mt-12 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Contact
            </h2>

            <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">
              For any questions about these Terms, please contact us at{" "}
              <a
                className="link"
                href="mailto:support@jakeo.dev"
                target="_blank"
              >
                support@jakeo.dev
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
