import Link from "next/link";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faBookmark,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { pathname } = useRouter();

  return (
    <div className="z-20 absolute top-0 w-full text-center flex gap-2 justify-between px-5 py-4 md:p-8">
      <div className="flex md:block items-center text-left cursor-default">
        <h1 className="block text-xl md:text-3xl font-bold">
          <span className="text-orange-500">Pair</span>
          <span className="text-blue-500">ckle</span>
        </h1>
        <h2 className="hidden lg:block text-sm text-neutral-800 dark:text-neutral-300 mt-0.5 md:mt-1">
          Rank your favorite things pairwisely
        </h2>
      </div>

      <div className="h-min flex gap-0.5 md:gap-2">
        <Link
          className={`${
            pathname == "/"
              ? "bg-neutral-400/20 dark:bg-neutral-300/20"
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
          } h-min flex justify-center items-center rounded-md text-sm md:text-base text-left transition px-2.5 py-1.5 md:px-3 md:py-2`}
          href="/"
        >
          <FontAwesomeIcon
            icon={faChartSimple}
            className="rotate-90 mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Create a ranking</span>
          <span className="md:hidden">Rank</span>
        </Link>
        <Link
          className={`${
            pathname == "/rankings"
              ? "bg-neutral-400/20 dark:bg-neutral-300/20"
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
          } h-min flex justify-center items-center rounded-md text-sm md:text-base text-left transition px-2.5 py-1.5 md:px-3 md:py-2`}
          href="/rankings"
        >
          <FontAwesomeIcon icon={faBookmark} className="mr-2" aria-hidden />
          <span className="hidden md:inline">Your rankings</span>
          <span className="md:hidden">Saved</span>
        </Link>
        <Link
          className={`${
            pathname == "/sets"
              ? "bg-neutral-400/20 dark:bg-neutral-300/20"
              : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
          } h-min flex justify-center items-center rounded-md text-sm md:text-base text-left transition px-2.5 py-1.5 md:px-3 md:py-2`}
          href="/sets"
        >
          <FontAwesomeIcon
            icon={faBarsStaggered}
            className="mr-2"
            aria-hidden
          />
          <span className="hidden md:inline">Starter sets</span>
          <span className="md:hidden">Sets</span>
        </Link>
      </div>
    </div>
  );
}
