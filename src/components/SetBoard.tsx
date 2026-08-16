import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { Set } from "@/types";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBullseye } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function SetBoard({
  set,
  onRankNow,
  showAllUtensils = false,
  className = "",
  miniView = false,
}: {
  set: Set;
  onRankNow?: (
    event: React.MouseEvent<HTMLElement>,
    rankingType: string,
  ) => void;
  showAllUtensils?: boolean;
  className?: string;
  miniView?: boolean;
}) {
  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + set.id}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + set.id,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      <Link
        href={`/sets/${set.id}`}
        className={`${miniView ? "min-w-72 rounded-lg p-2 transition hover:bg-neutral-400/25 active:bg-neutral-400/35 dark:hover:bg-neutral-600/25 dark:active:bg-neutral-600/35" : ""} ${className || ""}`}
      >
        <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 md:gap-2 md:text-sm">
              {set.username && (
                <h3 className="line-clamp-1 overflow-ellipsis font-semibold">
                  {set.username}
                </h3>
              )}
              {set.createdAt && (
                <h3 className="min-w-max text-neutral-500 dark:text-neutral-400">
                  {set.createdAt
                    ? new Date(set.createdAt).toLocaleDateString()
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
          className={`${set.utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} w-full rounded-lg border-2 border-neutral-500/15 text-neutral-600 dark:border-neutral-500/40 dark:text-neutral-300`}
        >
          {/* create shallow copy of set.utensils (so it wont actually change the set.utensils variable), sort randomly */}
          {[...set.utensils]
            .slice(0, showAllUtensils ? set.utensils.length : 5)
            .map((utensil, index) => (
              <li
                key={index}
                className="px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 md:px-2.5 md:py-1.5"
              >
                <p
                  className={`text-sm md:text-base ${showAllUtensils ? "" : "line-clamp-2"} ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
                >
                  {utensil.title}
                </p>
              </li>
            ))}
        </ul>
      </Link>
    </>
  );
}
