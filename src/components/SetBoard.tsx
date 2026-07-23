import { useState } from "react";
import { monthName, shuffle } from "@/utilities";
import { Set } from "@/types";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faShare } from "@fortawesome/free-solid-svg-icons";

export default function SetBoard({
  set,
  onRank,
  dontShowAll = false,
  className = "",
  id,
}: {
  set: Set;
  onRank: (event: React.MouseEvent<HTMLElement>) => void;
  dontShowAll?: boolean;
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
            {set.username && set.sharedAt && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 md:gap-2 md:text-sm">
                <h3 className="overflow-ellipsis lg:line-clamp-1">
                  {set.username}
                </h3>
                <span>•</span>
                <h3 className="overflow-ellipsis lg:line-clamp-1">
                  {set.sharedAt
                    ? `${monthName(
                        Number(set.sharedAt.split("T")[0].split("-")[1]),
                      ).slice(
                        0,
                        3,
                      )}. ${set.sharedAt.split("T")[0].split("-")[2]} ${set.sharedAt.split("T")[0].split("-")[0]}`
                    : ""}
                </h3>
              </div>
            )}
            <h2
              className={`flex items-center overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
            >
              {set.setName}
            </h2>
          </div>

          {/* <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
            <Link
              className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-sm"
              onClick={(e) => onRank(e)}
              href="/create"
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="mr-1 rotate-90 md:mr-1.5"
                aria-labelledby="rank-button-text"
              />
              <span id="rank-button-text">Rank</span>
            </Link>

            <button
              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:h-7 md:w-7 md:p-1 md:text-sm"
              onClick={() => {
                setShareLinkModalVisibility(true);
              }}
            >
              <FontAwesomeIcon
                icon={faShare}
                aria-label="Share set"
                title="Share set"
              />
            </button>
          </div> */}
        </div>

        <ul
          className={`${set.utensils.length > 8 && dontShowAll ? "fade-text" : ""} overflow-y-auto rounded-lg border-2 border-neutral-500/15 dark:border-neutral-500/40`}
        >
          {/* create shallow copy of set.utensils (so it wont actually change the set.utensils variable), sort randomly */}
          {shuffle([...set.utensils])
            .slice(0, 8)
            .map((utensil, index2) => (
              <li
                key={index2}
                className="flex items-center justify-center px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 md:px-2.5 md:py-1.5"
              >
                <p
                  className={`w-full text-sm md:text-base ${utensil === "????????" ? `animate-pulse text-neutral-500` : ""}`}
                >
                  {utensil}
                </p>
              </li>
            ))}
        </ul>

        <div className="mt-2 flex gap-2">
          <Link
            className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-base lg:px-3 lg:py-2"
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

          <button
            className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-base lg:px-3 lg:py-2"
            onClick={() => {
              setCopyLinkModalVisibility(true);
            }}
          >
            <FontAwesomeIcon
              icon={faShare}
              className="mr-2 text-neutral-800 dark:text-neutral-300"
              aria-labelledby="share-button-text"
            />
            <span id="share-button-text">Share</span>
          </button>
        </div>
      </div>
    </>
  );
}
