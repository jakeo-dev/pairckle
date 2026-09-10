import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import Link from "next/link";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function About() {
  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.1vh]">
          <Heading icon={faCircleInfo} title="About" />

          <div className="section w-full">
            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              What is Pairckle?
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              Pairckle is a website that makes ranking easier by using pairwise
              comparisons. Choose from sets made by the community, re-rank an
              existing ranking, or create something completely new. Share your
              finished rankings with friends and explore what others have
              ranked.
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              How does Pairckle work?
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              {`Pairckle creates a ranking using pairwise comparisons, basing it
              on the choices you make between two possible options. Two random
              options (called "utensils") from your chosen set are shown to you,
              and whichever one you pick gains one point; the other loses one
              point. If in "Rank accurately" mode, this process is done for
              every possible combination of two utensils in your set. If in
              "Rank quickly" mode, this process is done for a random half of
              every possible combination. After finishing selecting utensils,
              Pairckle presents your final ranking, ordered by each utensil's
              number of wins subtracted by its number of losses. The ranking is
              displayed using dense ranking, so number number is skipped.`}
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              How can I create a ranking?
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              Go to the{" "}
              <Link href="/create" className="link-blue">
                Create
              </Link>{" "}
              {`page to begin. You can either choose from an existing set made by
              another user, or create your own new set to rank. Enter the title
              of the set and the different things you want to include that are
              part of it. Click "Add more items" to add more to your set. When
              you're ready, choose "Rank quickly" for a quicker session or "Rank
              accurately" for a more accurate final ranking. Choose between the
              two options shown, and when you're finished, your ranking and its
              set will be published.`}
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Where can I find my rankings and sets?
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              If you are logged in to an account, you can view your rankings and
              sets on your{" "}
              <Link href="/user" className="link-blue">
                Account
              </Link>{" "}
              page.
            </p>
            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              If you are not logged in, your rankings and sets will be saved
              locally, but you will not be able to access them unless you{" "}
              <Link href="/login" className="link-blue">
                log in or create an account
              </Link>
              .
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              Who can see my rankings and sets?
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              Currently, if you are logged in to an account, all of your
              rankings and sets are public and discoverable to anyone.
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              {`What's the backstory?`}
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              {`I always wanted to figure out which things in a specific category
              I liked best, but tier lists aren't definitive enough, and can get
              messy and subjective with different opinions on what the different
              tiers mean. Using pairwise comparisons allows the final ranking to
              have a clear winner, loser, and everything in between.`}
            </p>

            <h2
              className={`mt-12 mb-4 flex w-fit items-center text-xl font-semibold md:text-2xl ${gabarito.className}`}
            >
              {`I'm having trouble with something else.`}
            </h2>

            <p className="mt-4 leading-7 text-pretty text-neutral-800 dark:text-neutral-200">
              If you are experiencing any kind of bug, error, or something else
              that looks wrong, please contact{" "}
              <a
                className="link-blue"
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
