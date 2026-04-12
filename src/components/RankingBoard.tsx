import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { monthName, sortUtensils } from "@/utilities";
import { Ranking } from "@/types";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBullseye,
  faChartSimple,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import Title from "./Title";

export default function RankingBoard({
  ranking,
  onReRank,
  onEditTitle,
  onDelete,
  index1,
  className = "",
}: {
  ranking: Ranking;
  onReRank?: (event: React.MouseEvent<HTMLElement>) => void;
  onEditTitle?: () => void;
  onDelete?: () => void;
  index1: number;
  className?: string;
}) {
  const [savedRankings, setSavedRankings] = useState<Ranking[]>([]);

  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(
    savedRankings.length > 0 ? savedRankings.length : 1,
  ).fill(1);

  useEffect(() => {
    setSavedRankings(JSON.parse(localStorage.getItem("savedRankings") ?? "[]"));
  }, []);

  const rankingRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  return (
    <div className={`w-full md:w-[45rem] ${className || ""}`}>
      <div className="mb-0.5 flex items-end gap-3 px-2 md:mb-1">
        <h2
          className={`flex items-center overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
        >
          <FontAwesomeIcon
            icon={ranking.rankingType == "hurry" ? faBolt : faBullseye}
            className={`${
              ranking.rankingType == "hurry"
                ? "text-orange-500 dark:text-orange-400"
                : ranking.rankingType == "concentrate"
                  ? "text-blue-500 dark:text-blue-400"
                  : "hidden"
            } mr-1.5`}
            aria-label={
              ranking.rankingType == "hurry"
                ? "Type: hurry"
                : "Type: concentrate"
            }
            title={
              ranking.rankingType == "hurry"
                ? "Type: hurry"
                : "Type: concentrate"
            }
          />
          {ranking.rankingName}
        </h2>
        <h3 className="ml-auto min-w-max text-right text-xs leading-6 text-neutral-700 dark:text-neutral-400 md:text-sm">
          {ranking.rankingDate
            ? `${monthName(ranking.rankingDate.month).slice(
                0,
                3,
              )}. ${ranking.rankingDate.day}, ${ranking.rankingDate.year}`
            : ""}
        </h3>
      </div>

      <div ref={rankingRef}>
        <ul
          className="h-max overflow-hidden rounded-lg border-2 border-neutral-500/15 text-neutral-50 dark:border-neutral-500/40"
          ref={ulRef}
        >
          {/* create shallow copy of ranking (so it wont actually change the ranking variable), sort utensils by their score */}
          {[...ranking.rankedUtensils]
            .sort(sortUtensils)
            .map((utensil, index2) => (
              <li
                key={index2}
                className="border-b-2 border-transparent last:border-b-0"
              >
                {(() => {
                  const newRankingPlace =
                    [...ranking.rankedUtensils].sort(sortUtensils)[
                      index2 - 1
                    ] &&
                    [...ranking.rankedUtensils].sort(sortUtensils)[index2 - 1][
                      "score"
                    ] == utensil["score"]
                      ? rankingPlaces[index1] - 1
                      : rankingPlaces[index1]++;

                  const progress =
                    typeof utensil["wins"] === "number"
                      ? utensil["wins"] + utensil["losses"] !== 0
                        ? utensil["wins"] /
                          (utensil["wins"] + utensil["losses"])
                        : 0
                      : ranking.rankedUtensils.length - 1 !== 0
                        ? utensil["score"] / (ranking.rankedUtensils.length - 1)
                        : 0;

                  return (
                    <div
                      className={`relative flex h-11 w-full items-center justify-center md:h-12 ${index2 % 2 === 0 ? "bg-neutral-500/10 dark:bg-neutral-500/25" : ""}`}
                    >
                      {/* title and ranking place, dark text underneath progress bar */}
                      <div className="absolute inset-0 flex items-center justify-between px-3 md:px-4">
                        <div className="flex min-w-0 items-center">
                          <span
                            className={`text-xl font-light italic md:text-2xl ${
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ] &&
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ]["score"] == utensil["score"]
                                ? "text-neutral-500/80 dark:text-neutral-200/80"
                                : "text-black dark:text-neutral-50"
                            }`}
                          >
                            #{newRankingPlace}
                          </span>
                          <p className="ml-2.5 truncate text-base font-semibold text-black dark:text-neutral-50 md:ml-3 md:text-lg">
                            {utensil["title"]}
                          </p>
                        </div>
                      </div>

                      <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
                        <div
                          className={`h-full transition-all duration-300 ${index2 % 2 !== 0 ? "bg-blue-500/90" : "bg-orange-500/90"} ${progress !== 1 ? "rounded-r-full" : ""}`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>

                      {/* title and ranking place, light text on top of progress bar */}
                      <div
                        className="absolute inset-0 flex items-center justify-between px-3 font-bold md:px-4"
                        style={{
                          clipPath: `inset(0 ${100 - 100 * progress}% 0 0)`,
                        }}
                      >
                        <div className="flex min-w-0 items-center">
                          {/* place in ranking, light text overlays dark text */}
                          <span
                            className={`text-xl font-light italic md:text-2xl ${
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ] &&
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ]["score"] == utensil["score"]
                                ? "text-neutral-200/80"
                                : ""
                            }`}
                          >
                            #{newRankingPlace}
                          </span>
                          <p className="ml-2.5 truncate text-base font-semibold text-neutral-50 md:ml-3 md:text-lg">
                            {utensil["title"]}
                          </p>
                        </div>
                      </div>

                      <div className="absolute right-3 ml-auto hidden items-center justify-between rounded-full bg-neutral-600/50 text-sm text-white dark:bg-neutral-400/50 dark:text-black md:flex">
                        <span className="px-2.5 py-0.5">
                          {typeof utensil["wins"] === "number"
                            ? `${utensil["wins"]} won`
                            : `${utensil["score"]} won`}
                        </span>
                        <span
                          className={`border-l border-neutral-300/50 px-2.5 py-0.5 dark:border-neutral-700/50 ${
                            typeof utensil["losses"] === "number"
                              ? ""
                              : "hidden"
                          }`}
                        >
                          {typeof utensil["losses"] === "number"
                            ? `${utensil["losses"]} lost`
                            : ""}
                        </span>
                      </div>

                      <div className="absolute right-2.5 ml-auto items-center justify-between rounded-full bg-neutral-600/50 px-2 py-0.5 text-xs text-white dark:bg-neutral-400/50 dark:text-black md:hidden">
                        <span className="">
                          {typeof utensil["wins"] === "number"
                            ? `${utensil["wins"]}`
                            : `${utensil["score"]}`}
                        </span>
                        {" - "}
                        <span
                          className={
                            typeof utensil["losses"] === "number"
                              ? ""
                              : "hidden"
                          }
                        >
                          {typeof utensil["losses"] === "number"
                            ? `${utensil["losses"]}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </li>
            ))}
        </ul>
      </div>

      {onReRank && onEditTitle && onDelete && (
        <div className="flex gap-2">
          <Link
            className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
            href="/"
            onClick={(e) => onReRank(e)}
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              className="mr-1.5 rotate-90 text-neutral-800 dark:text-neutral-300 md:mr-2"
              aria-labelledby="re-rank-button-text"
            />
            <span id="re-rank-button-text">Re-rank</span>
          </Link>

          <button
            className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
            onClick={onEditTitle}
          >
            <FontAwesomeIcon
              icon={faPen}
              className="mr-1.5 text-neutral-800 dark:text-neutral-300 md:mr-2"
              aria-labelledby="edit-title-button-text"
            />
            <span id="edit-title-button-text">Edit title</span>
          </button>

          <button
            className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
            onClick={onDelete}
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              className="mr-1.5 text-neutral-800 dark:text-neutral-300 md:mr-2"
              aria-labelledby="delete-button-text"
            />
            <span id="delete-button-text">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
