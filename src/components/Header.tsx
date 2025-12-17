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
      } z-20 bg-neutral-100 dark:bg-neutral-900 border-b-2 border-neutral-200 dark:border-neutral-800 top-0 w-full text-center flex items-center gap-2 justify-between px-3.5 py-2 md:px-6 md:py-4`}
    >
      <div className="flex text-left cursor-default">
        <h1
          className={`block text-xl md:text-3xl font-extrabold ${gabarito.className}`}
        >
          <span className="text-orange-500">Pair</span>
          <span className="text-blue-500">ckle</span>
        </h1>
        {/* <h2 className="hidden lg:block text-sm text-neutral-800 dark:text-neutral-300 mt-0.5 md:mt-1">
          Rank your favorite things pairwisely
        </h2> */}
      </div>

      <div className="h-min flex gap-0.5 md:gap-1">
        <Link
          className={`${
            pathname == "/"
              ? "bg-neutral-400/20"
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          } h-min flex justify-center items-center rounded-full text-sm md:text-base text-left transition px-2.5 py-1 md:px-4 md:py-2`}
          href="/"
        >
          <FontAwesomeIcon
            icon={faChartSimple}
            className="rotate-90 mr-1.5 md:mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Create a ranking</span>
          <span className="md:hidden">Rank</span>
        </Link>
        <Link
          className={`${
            pathname == "/rankings"
              ? "bg-neutral-400/20"
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          } h-min flex justify-center items-center rounded-full text-sm md:text-base text-left transition px-2.5 py-1 md:px-4 md:py-2`}
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
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          } h-min flex justify-center items-center rounded-full text-sm md:text-base text-left transition px-2.5 py-1 md:px-4 md:py-2`}
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
          className="bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 hover:shadow-sm active:shadow-none transition flex justify-center items-center rounded-full text-sm md:text-base px-2.5 py-1 md:px-4 md:py-2 w-7 md:w-10"
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
