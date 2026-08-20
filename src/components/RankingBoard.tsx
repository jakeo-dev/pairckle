import Title from "./Title";
import Link from "next/link";
import { RefObject } from "react";
import { sortUtensils } from "@/lib/utilities";
import { Ranking } from "@/types";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RankingBoard({
  ranking,
  showAllUtensils = false,
  index1,
  className = "",
  savedRankings,
  exportViewRef,
  miniView = false,
}: {
  ranking: Ranking;
  showAllUtensils?: boolean;
  index1: number;
  className?: string;
  savedRankings: Ranking[];
  exportViewRef?: RefObject<HTMLDivElement | null>;
  miniView?: boolean;
}) {
  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(
    savedRankings.length > 0 ? savedRankings.length : 1,
  ).fill(1);

  return (
    <>
      <Link
        href={`/rankings/${ranking.id}`}
        className={`${miniView ? "min-w-48 rounded-lg bg-neutral-300/10 p-2 transition hover:bg-neutral-400/25 active:bg-neutral-400/35 dark:bg-neutral-400/10 dark:hover:bg-neutral-600/25 dark:active:bg-neutral-600/35 md:min-w-56" : ""} ${className || ""}`}
      >
        <div
          className={`flex items-end gap-2 md:gap-3 ${miniView ? "px-1" : "mb-0.5 px-2 md:mb-1"}`}
        >
          <div>
            {ranking.createdAt && (
              <div
                className={`flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 md:gap-2 ${miniView ? "text-[0.65rem] md:text-xs" : "text-xs md:text-sm"}`}
              >
                {ranking.username && (
                  <h3 className="line-clamp-1 font-semibold">
                    {ranking.username}
                    {/* {ranking.type === "hurry" ? "Hurried" : "Concentrated"} */}
                  </h3>
                )}
                <h3 className="min-w-max text-neutral-500 dark:text-neutral-400">
                  {ranking.createdAt
                    ? new Date(ranking.createdAt).toLocaleDateString()
                    : ""}
                </h3>
              </div>
            )}
            <h2
              className={`line-clamp-1 font-medium leading-6 ${miniView ? "text-sm md:text-base" : "text-base md:text-lg"} ${gabarito.className}`}
            >
              {ranking.name}
            </h2>
          </div>
        </div>

        <ul
          className={`${ranking.rankedUtensils.length > 5 && !showAllUtensils ? "fade-text" : ""} h-max overflow-hidden rounded-lg border-2 border-neutral-400/25 text-neutral-50`}
        >
          {/* create shallow copy of ranking (so it wont actually change the ranking variable), sort utensils by their score */}
          {[...ranking.rankedUtensils]
            .sort(sortUtensils)
            .slice(0, showAllUtensils ? ranking.rankedUtensils.length : 5)
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
                    ] === utensil["score"]
                      ? rankingPlaces[index1] - 1
                      : rankingPlaces[index1]++;

                  const progress =
                    typeof utensil["wins"] === "number"
                      ? utensil["wins"] +
                          (utensil["losses"] !== undefined
                            ? utensil["losses"]
                            : -1) !==
                        0
                        ? utensil["wins"] /
                          (utensil["wins"] +
                            (utensil["losses"] !== undefined
                              ? utensil["losses"]
                              : -1))
                        : 0
                      : ranking.rankedUtensils.length - 1 !== 0
                        ? (utensil["score"] !== undefined
                            ? utensil["score"]
                            : -1) /
                          (ranking.rankedUtensils.length - 1)
                        : 0;

                  return (
                    <div
                      className={`relative flex ${miniView ? "h-6 md:h-7" : "h-11 md:h-12"} w-full items-center justify-center ${index2 % 2 === 0 ? "bg-neutral-500/10 dark:bg-neutral-500/25" : ""}`}
                    >
                      {/* title and ranking place, dark text underneath progress bar */}
                      <div
                        className={`absolute inset-0 flex items-center justify-between ${miniView ? "p-1.5 md:p-2" : "px-3 pr-14 md:px-4 md:pr-32"}`}
                      >
                        <div className="flex min-w-0 items-center">
                          <span
                            className={`font-light italic ${miniView ? "md:text-lg" : "text-xl md:text-2xl"} ${
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ] &&
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ]["score"] === utensil["score"]
                                ? "text-neutral-500/80 dark:text-neutral-200/80"
                                : "text-black dark:text-neutral-50"
                            }`}
                          >
                            #{newRankingPlace}
                          </span>
                          <p
                            className={`truncate text-base font-semibold text-neutral-800 dark:text-neutral-200 ${miniView ? "ml-1.5 text-xs md:ml-2 md:text-sm" : "ml-2.5 md:ml-3 md:text-lg"}`}
                          >
                            {utensil["title"]}
                          </p>
                        </div>
                      </div>

                      <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
                        <div
                          className={`h-full ${index2 % 2 !== 0 ? "bg-blue-500/90" : "bg-orange-500/90"} ${progress !== 1 ? "rounded-r-full" : ""}`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>

                      {/* title and ranking place, light text on top of progress bar */}
                      <div
                        className={`absolute inset-0 flex items-center justify-between ${miniView ? "p-1.5 md:p-2" : "px-3 pr-14 md:px-4 md:pr-32"}`}
                        style={{
                          clipPath: `inset(0 ${100 - 100 * progress}% 0 0)`,
                        }}
                      >
                        <div className="flex min-w-0 items-center">
                          {/* place in ranking, light text overlays dark text */}
                          <span
                            className={`font-light italic ${miniView ? "md:text-lg" : "text-xl md:text-2xl"} ${
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ] &&
                              [...ranking.rankedUtensils].sort(sortUtensils)[
                                index2 - 1
                              ]["score"] === utensil["score"]
                                ? "text-neutral-200/80"
                                : ""
                            }`}
                          >
                            #{newRankingPlace}
                          </span>
                          <p
                            className={`truncate text-base font-semibold text-neutral-100 ${miniView ? "ml-1.5 text-xs md:ml-2 md:text-sm" : "ml-2.5 md:ml-3 md:text-lg"}`}
                          >
                            {utensil["title"]}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`${miniView ? "hidden" : "hidden md:flex"} absolute right-3 ml-auto items-center justify-between rounded-full bg-neutral-600/50 text-sm text-white dark:bg-neutral-400/50 dark:text-black`}
                      >
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

                      <div
                        className={`${miniView ? "hidden" : "md:hidden"} absolute right-2.5 ml-auto items-center justify-between rounded-full bg-neutral-600/50 px-2 py-0.5 text-xs text-white dark:bg-neutral-400/50 dark:text-black`}
                      >
                        <span>
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
      </Link>

      {exportViewRef && (
        <ExportView
          ref={exportViewRef}
          ranking={ranking}
          index1={index1}
          savedRankings={savedRankings}
        />
      )}
    </>
  );
}

/* view of ranking for exporting as image */
export function ExportView({
  ranking,
  index1,
  ref,
  savedRankings,
}: {
  ranking: Ranking;
  index1: number;
  ref: React.RefObject<HTMLDivElement | null>;
  savedRankings: Ranking[];
}) {
  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(
    savedRankings.length > 0 ? savedRankings.length : 1,
  ).fill(1);

  return (
    <div className="hidden bg-neutral-50 dark:bg-black" ref={ref}>
      <Title className="px-3 py-2 text-right" />

      <ul className="h-max overflow-hidden text-neutral-50">
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
                  [...ranking.rankedUtensils].sort(sortUtensils)[index2 - 1] &&
                  [...ranking.rankedUtensils].sort(sortUtensils)[index2 - 1][
                    "score"
                  ] === utensil["score"]
                    ? rankingPlaces[index1] - 1
                    : rankingPlaces[index1]++;

                const progress =
                  typeof utensil["wins"] === "number"
                    ? utensil["wins"] +
                        (utensil["losses"] !== undefined
                          ? utensil["losses"]
                          : -1) !==
                      0
                      ? utensil["wins"] /
                        (utensil["wins"] +
                          (utensil["losses"] !== undefined
                            ? utensil["losses"]
                            : -1))
                      : 0
                    : ranking.rankedUtensils.length - 1 !== 0
                      ? (utensil["score"] !== undefined
                          ? utensil["score"]
                          : -1) /
                        (ranking.rankedUtensils.length - 1)
                      : 0;

                return (
                  <div
                    className={`relative flex h-11 w-full items-center justify-center md:h-12 ${index2 % 2 === 0 ? "bg-neutral-500/10 dark:bg-neutral-500/25" : ""}`}
                  >
                    {/* title and ranking place, dark text underneath progress bar */}
                    <div className="absolute inset-0 flex items-center justify-between px-3 pr-14 md:px-4 md:pr-32">
                      <div className="flex min-w-0 items-center">
                        <span
                          className={`text-xl font-light italic md:text-2xl ${
                            [...ranking.rankedUtensils].sort(sortUtensils)[
                              index2 - 1
                            ] &&
                            [...ranking.rankedUtensils].sort(sortUtensils)[
                              index2 - 1
                            ]["score"] === utensil["score"]
                              ? "text-neutral-500/80 dark:text-neutral-200/80"
                              : "text-black dark:text-neutral-50"
                          }`}
                        >
                          #{newRankingPlace}
                        </span>
                        <p className="ml-2.5 truncate text-base font-semibold text-neutral-800 dark:text-neutral-200 md:ml-3 md:text-lg">
                          {utensil["title"]}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
                      <div
                        className={`h-full ${index2 % 2 !== 0 ? "bg-blue-500/90" : "bg-orange-500/90"} ${progress !== 1 ? "rounded-r-full" : ""}`}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>

                    {/* title and ranking place, light text on top of progress bar */}
                    <div
                      className="absolute inset-0 flex items-center justify-between px-3 pr-14 font-bold md:px-4 md:pr-32"
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
                            ]["score"] === utensil["score"]
                              ? "text-neutral-200/80"
                              : ""
                          }`}
                        >
                          #{newRankingPlace}
                        </span>
                        <p className="ml-2.5 truncate text-base font-semibold text-neutral-100 md:ml-3 md:text-lg">
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
                          typeof utensil["losses"] === "number" ? "" : "hidden"
                        }`}
                      >
                        {typeof utensil["losses"] === "number"
                          ? `${utensil["losses"]} lost`
                          : ""}
                      </span>
                    </div>

                    <div className="absolute right-2.5 ml-auto items-center justify-between rounded-full bg-neutral-600/50 px-2 py-0.5 text-xs text-white dark:bg-neutral-400/50 dark:text-black md:hidden">
                      <span>
                        {typeof utensil["wins"] === "number"
                          ? `${utensil["wins"]}`
                          : `${utensil["score"]}`}
                      </span>
                      {" - "}
                      <span
                        className={
                          typeof utensil["losses"] === "number" ? "" : "hidden"
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
  );
}
