import Link from "next/link";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBarsStaggered,
  faBookmark,
  faChartSimple,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import Title from "./Title";

export default function Header({
  fixed,
  showTabs,
}: {
  fixed: boolean;
  showTabs: boolean;
}) {
  const { pathname } = useRouter();

  return (
    <div
      className={`${
        fixed ? "fixed" : "absolute"
      } top-0 z-20 flex w-full items-center justify-between gap-2 border-b-2 border-neutral-400/20 ${showTabs ? "bg-neutral-100/80 dark:bg-neutral-900/80" : "bg-neutral-400/10"} px-3.5 py-2 text-center backdrop-blur-lg md:px-6 md:py-4`}
    >
      <div className="flex cursor-default text-left">
        <Title />
        {/* <h2 className="hidden lg:block text-sm text-neutral-800 dark:text-neutral-300 mt-0.5 md:mt-1">
          Rank your favorite things pairwisely
        </h2> */}
      </div>

      <div className="flex h-min">
        {showTabs ? (
          <>
            <Link
              className={`${
                pathname === "/create"
                  ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                  : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
              } flex h-min items-center justify-center rounded-l-full border-2 border-r border-neutral-200 px-2.5 py-1 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:text-base`}
              href="/create"
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="mr-1.5 rotate-90 md:mr-2.5"
                aria-hidden
              />
              <span className="hidden md:inline">Create a ranking</span>
              <span className="md:hidden">Rank</span>
            </Link>
            <Link
              className={`${
                pathname === "/rankings"
                  ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                  : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
              } flex h-min items-center justify-center border-2 border-x border-neutral-200 px-2.5 py-1 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:text-base`}
              href="/rankings"
            >
              <FontAwesomeIcon
                icon={faBookmark}
                className="mr-1.5 md:mr-2.5"
                aria-hidden
              />
              <span className="hidden md:inline">Your rankings</span>
              <span className="md:hidden">Saved</span>
            </Link>
            <Link
              className={`${
                pathname === "/sets"
                  ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                  : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
              } flex h-min items-center justify-center rounded-r-full border-2 border-l border-neutral-200 px-2.5 py-1 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:text-base`}
              href="/sets"
            >
              <FontAwesomeIcon
                icon={faBarsStaggered}
                className="mr-1.5 md:mr-2.5"
                aria-hidden
              />
              <span className="hidden md:inline">Starter sets</span>
              <span className="md:hidden">Sets</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              className={`flex h-min items-center justify-center rounded-full border-2 border-transparent bg-neutral-400/20 px-2.5 py-1 text-left text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:border-neutral-700 dark:border-transparent md:px-4 md:py-2 md:text-base`}
              href="/create"
            >
              <span className="hidden md:inline">Start ranking!</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-1.5 md:ml-2.5"
                aria-hidden
              />
            </Link>
          </>
        )}
        <button
          className="ml-1 flex w-8 items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none md:ml-1.5 md:w-11 md:px-4 md:py-2 md:text-base"
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
