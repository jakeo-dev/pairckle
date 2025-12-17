import Link from "next/link";
import { useRouter } from "next/router";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faBookmark,
  faChartSimple,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function Header({ fixed }: { fixed: boolean }) {
  const { pathname } = useRouter();

  return (
    <div
      className={`${
        fixed ? "fixed" : "absolute"
      } top-0 z-20 flex w-full items-center justify-between gap-2 border-b-2 border-neutral-200 bg-neutral-100 px-3.5 py-2 text-center dark:border-neutral-800 dark:bg-neutral-900 md:px-6 md:py-4`}
    >
      <div className="flex cursor-default text-left">
        <h1
          className={`block text-xl font-extrabold md:text-3xl ${gabarito.className}`}
        >
          <span className="text-orange-500">Pair</span>
          <span className="text-blue-500">ckle</span>
        </h1>
        {/* <h2 className="hidden lg:block text-sm text-neutral-800 dark:text-neutral-300 mt-0.5 md:mt-1">
          Rank your favorite things pairwisely
        </h2> */}
      </div>

      <div className="flex h-min gap-0.5 md:gap-1">
        <Link
          className={`${
            pathname == "/"
              ? "bg-neutral-400/20"
              : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:text-neutral-400 dark:hover:text-neutral-300"
          } flex h-min items-center justify-center rounded-full px-2.5 py-1 text-left text-sm transition md:px-4 md:py-2 md:text-base`}
          href="/"
        >
          <FontAwesomeIcon
            icon={faChartSimple}
            className="mr-1.5 rotate-90 md:mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Create a ranking</span>
          <span className="md:hidden">Rank</span>
        </Link>
        <Link
          className={`${
            pathname == "/rankings"
              ? "bg-neutral-400/20"
              : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:text-neutral-400 dark:hover:text-neutral-300"
          } flex h-min items-center justify-center rounded-full px-2.5 py-1 text-left text-sm transition md:px-4 md:py-2 md:text-base`}
          href="/rankings"
        >
          <FontAwesomeIcon
            icon={faBookmark}
            className="mr-1.5 md:mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Your rankings</span>
          <span className="md:hidden">Saved</span>
        </Link>
        <Link
          className={`${
            pathname == "/sets"
              ? "bg-neutral-400/20"
              : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:text-neutral-400 dark:hover:text-neutral-300"
          } flex h-min items-center justify-center rounded-full px-2.5 py-1 text-left text-sm transition md:px-4 md:py-2 md:text-base`}
          href="/sets"
        >
          <FontAwesomeIcon
            icon={faBarsStaggered}
            className="mr-1.5 md:mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Starter sets</span>
          <span className="md:hidden">Sets</span>
        </Link>
        <button
          className="flex w-7 items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none md:w-10 md:px-4 md:py-2 md:text-base"
          onClick={() => {
            if (localStorage.getItem("theme") === "dark") {
              document.documentElement.classList.remove("dark");
              localStorage.setItem("theme", "light");
            } else {
              document.documentElement.classList.add("dark");
              localStorage.setItem("theme", "dark");
            }
          }}
        >
          <FontAwesomeIcon
            icon={faSun}
            className="hidden dark:inline"
            aria-label="Switch to light mode"
            title="Switch to light mode"
          />
          <FontAwesomeIcon
            icon={faMoon}
            className="dark:hidden"
            aria-label="Switch to dark mode"
            title="Switch to dark mode"
          />
        </button>
      </div>
    </div>
  );
}
