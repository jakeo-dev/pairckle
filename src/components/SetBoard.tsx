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
} from "@fortawesome/free-solid-svg-icons";

export default function SetBoard({
  set,
  onRank,
  dontShowAll = false,
  showReportButton = false,
  showShareButton = false,
  className = "",
  id,
}: {
  set: Set;
  onRank: (event: React.MouseEvent<HTMLElement>) => void;
  dontShowAll?: boolean;
  showShareButton?: boolean;
  showReportButton?: boolean;
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

      <div className={`w-full md:w-[45rem] ${className || ""}`}>
        <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
          <div>
            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 md:gap-2 md:text-sm">
              {set.username && (
                <h3 className="overflow-ellipsis font-semibold lg:line-clamp-1">
                  {set.username}
                </h3>
              )}
              {set.sharedAt && (
                <h3 className="overflow-ellipsis text-neutral-400 dark:text-neutral-500 lg:line-clamp-1">
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
              className={`flex items-center overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
            >
              {set.name}
            </h2>
          </div>

          <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
            {showShareButton && (
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
            )}

            {showReportButton && (
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
            )}
          </div>
        </div>

        <ul
          className={`${set.utensils.length > 8 && dontShowAll ? "fade-text" : ""} overflow-y-auto rounded-lg border-2 border-neutral-500/15 dark:border-neutral-500/40`}
        >
          {/* create shallow copy of set.utensils (so it wont actually change the set.utensils variable), sort randomly */}
          {[...set.utensils].slice(0, 6).map((utensil, index) => (
            <li
              key={index}
              className="flex items-center justify-center px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 md:px-2.5 md:py-1.5"
            >
              <p
                className={`w-full text-sm md:text-base ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
              >
                {utensil.title}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex gap-2">
          <Link
            className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base lg:px-3"
            onClick={(e) => onRank(e)}
            href="/create"
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              className="mr-2 rotate-90 text-neutral-800 dark:text-neutral-300"
              aria-labelledby="rank-this-set-button-text"
            />
            <span id="rank-this-set-button-text">Rank this set</span>
          </Link>
        </div>
      </div>
    </>
  );
}
