import Link from "next/link";
import Title from "./Title";
import CreateRankingModal from "./CreateRankingModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchCurrentProfile } from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faGlobe,
  faHome,
  faMoon,
  faPlusCircle,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Header({
  fixed,
  showTabs,
}: {
  fixed: boolean;
  showTabs: boolean;
}) {
  const { pathname } = useRouter();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function getUsername() {
      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setUsername(result?.profileData.username);
      }
    }

    getUsername();
  }, []);

  const [createRankingModalVisibility, setCreateRankingModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      <CreateRankingModal
        onCancel={() => {
          setCreateRankingModalVisibility(false);
        }}
        visibility={createRankingModalVisibility}
      />
      <div
        className={`${
          fixed ? "fixed" : "absolute"
        } ${showTabs ? "bg-neutral-100/80 dark:bg-neutral-900/80" : "bg-neutral-400/10"} top-0 z-20 w-full gap-2 border-b-2 border-neutral-400/20 text-center backdrop-blur-lg`}
      >
        <div className="wide-section flex items-center justify-between px-3.5 py-2 md:px-5 md:py-3">
          <div className="flex cursor-default text-left">
            <Title />
            {/* <h2 className="hidden lg:block text-sm text-neutral-800 dark:text-neutral-300 mt-0.5 md:mt-1">
          Rank your favorite things pairwisely
        </h2> */}
          </div>

          <div className="flex h-min items-center">
            {showTabs ? (
              <>
                <Link
                  className={`${
                    pathname === "/"
                      ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                      : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
                  } flex h-min items-center justify-center rounded-l-full border-2 border-r border-neutral-200 px-2.5 py-2 pr-2 text-left text-sm transition md:px-4 md:py-2 md:pr-3.5 md:text-base dark:border-neutral-700`}
                  href="/"
                >
                  <FontAwesomeIcon icon={faHome} aria-hidden />
                  <span className="hidden md:inline md:w-0 md:text-transparent">
                    Home
                  </span>
                </Link>
                <Link
                  className={`${
                    pathname === "/create"
                      ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                      : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
                  } flex h-min items-center justify-center border-2 border-x border-neutral-200 px-2.5 py-2 text-left text-sm transition md:px-4 md:py-2 md:text-base dark:border-neutral-700`}
                  href="/create"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="mr-1.5 md:mr-2.5"
                    aria-hidden
                  />
                  <span className="leading-3 md:leading-normal">Create</span>
                </Link>
                <Link
                  className={`${
                    pathname.startsWith("/rankings") ||
                    pathname.startsWith("/sets")
                      ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                      : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
                  } flex h-min items-center justify-center rounded-r-full border-2 border-l border-neutral-200 px-2.5 py-2 pl-2 text-left text-sm transition md:px-4 md:py-2 md:pl-3.5 md:text-base dark:border-neutral-700`}
                  href="/rankings"
                >
                  <FontAwesomeIcon icon={faGlobe} aria-hidden />
                  <span className="hidden md:inline md:w-0 md:text-transparent">
                    Community
                  </span>
                </Link>

                <button
                  className="ml-1 flex w-[2.1rem] cursor-pointer items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 hover:shadow-xs active:bg-neutral-400/40 active:shadow-none md:ml-1.5 md:w-11 md:px-4 md:py-2.5 md:text-base"
                  /* className="mr-1 h-min w-5 cursor-pointer rounded-full px-1 py-0.5 text-xs transition hover:bg-neutral-400/20 hover:drop-shadow-xs active:bg-neutral-400/30 active:drop-shadow-none md:mr-1.5 md:w-7 md:px-1.5 md:py-1 md:text-sm" */
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
                  <div className="hidden dark:inline-block">
                    <FontAwesomeIcon
                      icon={faSun}
                      className="text-neutral-300/80"
                      aria-label="Switch to light mode"
                      title="Switch to light mode"
                    />
                  </div>
                  <div className="inline-block dark:hidden">
                    <FontAwesomeIcon
                      icon={faMoon}
                      className="text-neutral-600/80"
                      aria-label="Switch to dark mode"
                      title="Switch to dark mode"
                    />
                  </div>
                </button>

                <Link
                  className="ml-1 flex w-8 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-orange-300/50 to-blue-300/50 px-2.5 py-1.5 text-sm transition hover:from-orange-300/45 hover:to-blue-300/45 hover:shadow-xs active:from-orange-300/40 active:to-blue-300/40 active:shadow-none md:ml-1.5 md:w-11 md:px-4 md:py-2.5 md:text-base dark:from-orange-800/50 dark:to-blue-800/50 dark:hover:from-orange-800/45 dark:hover:to-blue-800/45 dark:active:from-orange-800/40 dark:active:to-blue-800/40"
                  href={`/user/${username ?? "guest"}/rankings`}
                >
                  {username ? (
                    <span
                      className={`bg-linear-to-tl from-orange-700 to-blue-700 bg-clip-text text-lg leading-5 font-semibold text-transparent md:text-xl dark:from-orange-200 dark:to-blue-200 ${gabarito.className}`}
                    >
                      {username[0]}
                    </span>
                  ) : (
                    <FontAwesomeIcon icon={faUser} aria-hidden />
                  )}
                  <span className="hidden md:inline md:w-0 md:text-transparent">
                    Profile
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={`flex h-min items-center justify-center rounded-full border-2 border-transparent bg-neutral-400/20 px-2.5 py-2 text-left text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-4 md:py-2 md:text-base dark:border-transparent`}
                  href="/create"
                >
                  <span>Start ranking</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-1.5 md:ml-2.5"
                    aria-hidden
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
