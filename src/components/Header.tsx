import Link from "next/link";
import Title from "./Title";
import CreateRankingModal from "./CreateRankingModal";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHome,
  faMoon,
  faPlusCircle,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Header({
  fixed,
  showTabs,
}: {
  fixed: boolean;
  showTabs: boolean;
}) {
  const { pathname } = useRouter();

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

          <div className="flex h-min">
            {showTabs ? (
              <>
                <Link
                  className={`${
                    pathname === "/" ||
                    pathname.startsWith("/rankings") ||
                    pathname.startsWith("/sets")
                      ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                      : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
                  } flex h-min items-center justify-center rounded-l-full border-2 border-r border-neutral-200 px-2.5 py-2 pr-2 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:pr-3.5 md:text-base`}
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
                  } flex h-min items-center justify-center border-2 border-x border-neutral-200 px-2.5 py-2 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:text-base`}
                  href="/create"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="md:mr-2.5"
                    aria-hidden
                  />
                  <span className="hidden md:inline">Create</span>
                </Link>
                <Link
                  className={`${
                    pathname.startsWith("/profile")
                      ? "border-transparent bg-neutral-400/20 dark:border-transparent"
                      : "text-neutral-600 hover:bg-neutral-400/15 hover:text-neutral-700 active:bg-neutral-400/20 dark:border-neutral-400/20 dark:text-neutral-400 dark:hover:border-transparent dark:hover:text-neutral-300"
                  } flex h-min items-center justify-center rounded-r-full border-2 border-l border-neutral-200 px-2.5 py-2 pl-2 text-left text-sm transition dark:border-neutral-700 md:px-4 md:py-2 md:pl-3.5 md:text-base`}
                  href="/profile/rankings"
                >
                  <FontAwesomeIcon icon={faUser} aria-hidden />
                  <span className="hidden md:inline md:w-0 md:text-transparent">
                    Profile
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  className={`flex h-min items-center justify-center rounded-full border-2 border-transparent bg-neutral-400/20 px-2.5 py-2 text-left text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:border-neutral-700 dark:border-transparent md:px-4 md:py-2 md:text-base`}
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
            <button
              className="ml-1 flex w-[2.1rem] items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none md:ml-1.5 md:w-11 md:px-4 md:py-2 md:text-base"
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
      </div>
    </>
  );
}
