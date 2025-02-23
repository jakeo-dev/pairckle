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
    <div className="absolute top-0 w-full text-center lg:flex justify-between p-8">
      <div className="text-left cursor-default">
        <h1 className="block text-3xl lg:text-3xl font-bold">
          <span className="text-orange-500">Pair</span>
          <span className="text-blue-500">ckle</span>
        </h1>
        <h2 className="block text-xs lg:text-sm text-gray-800 mt-1">
          Rank with pairwise comparisons
        </h2>
      </div>

      <div className="h-min flex gap-2 mt-4 lg:mt-0">
        <Link
          className={`${
            pathname == "/"
              ? "bg-gray-400/30"
              : "hover:bg-gray-400/15 active:bg-gray-400/20"
          } h-min flex justify-center items-center rounded-md text-sm lg:text-base text-left transition px-2.5 py-1.5 lg:px-3 lg:py-2`}
          href="/"
        >
          <FontAwesomeIcon
            icon={faChartSimple}
            className="rotate-90 mr-2"
            aria-hidden
          />
          <span className="hidden lg:inline">Create a ranking</span>
          <span className="lg:hidden">Rank</span>
        </Link>
        <Link
          className={`${
            pathname == "/rankings"
              ? "bg-gray-400/30"
              : "hover:bg-gray-400/15 active:bg-gray-400/20"
          } h-min flex justify-center items-center rounded-md text-sm lg:text-base text-left transition px-2.5 py-1.5 lg:px-3 lg:py-2`}
          href="/rankings"
        >
          <FontAwesomeIcon icon={faBookmark} className="mr-2" aria-hidden />
          <span className="hidden lg:inline">Your rankings</span>
          <span className="lg:hidden">Saved</span>
        </Link>
        <Link
          className={`${
            pathname == "/sets"
              ? "bg-gray-400/30"
              : "hover:bg-gray-400/15 active:bg-gray-400/20"
          } h-min flex justify-center items-center rounded-md text-sm lg:text-base text-left transition px-2.5 py-1.5 lg:px-3 lg:py-2`}
          href="/sets"
        >
          <FontAwesomeIcon
            icon={faBarsStaggered}
            className="mr-2"
            aria-hidden
          />
          <span className="hidden lg:inline">Starter sets</span>
          <span className="lg:hidden">Sets</span>
        </Link>
      </div>
    </div>
  );
}
