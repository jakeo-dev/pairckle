import { useState } from "react";
import { monthName } from "@/utilities";
import { Set } from "@/types";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faShare,
  faFlag,
  faBolt,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";

export default function SetBoard({
  set,
  onRankNow,
  showAllUtensils = false,
  showTopButtons,
  showSeeSetButton,
  className = "",
  id,
}: {
  set: Set;
  onRankNow?: (
    event: React.MouseEvent<HTMLElement>,
    rankingType: string,
  ) => void;
  showAllUtensils?: boolean;
  showTopButtons?: boolean;
  showSeeSetButton?: boolean;
  className?: string;
  id: string;
}) {
  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + id}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + id,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      <div className={`w-full ${className || ""}`}>
        <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 md:gap-2 md:text-sm">
              {set.username && (
                <h3 className="line-clamp-1 overflow-ellipsis font-semibold">
                  {set.username}
                </h3>
              )}
              {set.sharedAt && (
                <h3 className="min-w-max text-neutral-500 dark:text-neutral-400">
                  {set.sharedAt
                    ? `${monthName(
                        Number(set.sharedAt.split("T")[0].split("-")[1]),
                      ).slice(
                        0,
                        3,
                      )}. ${Number(set.sharedAt.split("T")[0].split("-")[2])} ${Number(set.sharedAt.split("T")[0].split("-")[0])}`
                    : ""}
                </h3>
              )}
            </div>
            <h2
              className={`line-clamp-1 overflow-ellipsis text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
            >
              {set.name}
            </h2>
          </div>

          {showTopButtons && (
            <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
              <button
                className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-sm"
                onClick={() => {
                  setCopyLinkModalVisibility(true);
                }}
              >
                <FontAwesomeIcon
                  icon={faShare}
                  className="mr-1 md:mr-1.5"
                  aria-labelledby="share-button-text"
                />
                <span id="share-button-text">Share</span>
              </button>
              <a
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:h-7 md:w-7 md:p-1 md:text-sm"
                href="mailto:report@jakeo.dev"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faFlag}
                  aria-label="Report this set"
                  title="Report this set"
                />
              </a>
            </div>
          )}
        </div>

        {onRankNow && (
          <div className="mb-2.5 flex gap-2.5 md:mb-3 md:gap-3">
            <Link
              className="flex h-min w-full items-center justify-center rounded-md bg-orange-500/90 px-3 py-2 text-sm text-neutral-50 transition hover:bg-orange-500/80 active:bg-orange-500/70 dark:text-black md:px-4 md:py-3 md:text-base"
              onClick={(e) => onRankNow?.(e, "hurry")}
              href="/create"
            >
              <FontAwesomeIcon
                icon={faBolt}
                className="mr-2 text-orange-200 dark:text-orange-800"
                aria-hidden
              />
              <span>Hurry</span>
            </Link>
            <Link
              className="flex h-min w-full items-center justify-center rounded-md bg-blue-500/90 px-3 py-2 text-sm text-neutral-50 transition hover:bg-blue-500/80 active:bg-blue-500/70 dark:text-black md:px-4 md:py-3 md:text-base"
              onClick={(e) => onRankNow?.(e, "concentrate")}
              href="/create"
            >
              <FontAwesomeIcon
                icon={faBullseye}
                className="mr-2 text-blue-200 dark:text-blue-800"
                aria-hidden
              />
              <span>Concentrate</span>
            </Link>
          </div>
        )}

        <ul
          className={`${set.utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} overflow-y-auto rounded-lg border-2 border-neutral-500/15 text-neutral-600 dark:border-neutral-500/40 dark:text-neutral-300`}
        >
          {/* create shallow copy of set.utensils (so it wont actually change the set.utensils variable), sort randomly */}
          {[...set.utensils]
            .slice(0, showAllUtensils ? set.utensils.length : 5)
            .map((utensil, index) => (
              <li
                key={index}
                className="flex items-center justify-center px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 md:px-2.5 md:py-1.5"
              >
                <p
                  className={`w-full text-sm md:text-base ${showAllUtensils ? "" : "line-clamp-2 truncate overflow-ellipsis"} ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
                >
                  {utensil.title}
                </p>
              </li>
            ))}
        </ul>

        {showSeeSetButton && (
          <div className="mt-2 flex gap-2">
            {/* <Link
            className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
            onClick={(e) => onRank?.(e)}
            href="/create"
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              className="mr-2 rotate-90 text-neutral-800 dark:text-neutral-300"
              aria-labelledby="rank-this-set-button-text"
            />
            <span id="rank-this-set-button-text">Rank this set</span>
          </Link> */}
            <Link
              className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
              href={`/sets/${id}`}
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="mr-2 rotate-90 text-neutral-800 dark:text-neutral-300"
                aria-labelledby="see-set-button-text"
              />
              <span id="see-set-button-text">View set</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
