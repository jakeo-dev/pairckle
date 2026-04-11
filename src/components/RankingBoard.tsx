import { useEffect, useState } from "react";
import { sortUtensils } from "@/utilities";
import { Utensil, Ranking } from "@/types";

export default function RankingBoard({
  ranking,
  index1,
  className = "",
}: {
  ranking: Utensil[];
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

  return (
    <ul
      className={`rounded-lg border-2 border-neutral-500/15 text-neutral-50 dark:border-neutral-500/40 ${className || "h-max overflow-hidden"}`}
    >
      {/* create shallow copy of ranking (so it wont actually change the ranking variable), sort utensils by their score */}
      {[...ranking].sort(sortUtensils).map((utensil, index2) => (
        <li
          key={index2}
          className="border-b-2 border-transparent last:border-b-0"
        >
          {(() => {
            const newRankingPlace =
              [...ranking].sort(sortUtensils)[index2 - 1] &&
              [...ranking].sort(sortUtensils)[index2 - 1]["score"] ==
                utensil["score"]
                ? rankingPlaces[index1] - 1
                : rankingPlaces[index1]++;

            const progress =
              typeof utensil["wins"] === "number"
                ? utensil["wins"] + utensil["losses"] !== 0
                  ? utensil["wins"] / (utensil["wins"] + utensil["losses"])
                  : 0
                : ranking.length - 1 !== 0
                  ? utensil["score"] / (ranking.length - 1)
                  : 0;

            return (
              <div
                className={`relative flex h-11 w-full items-center justify-center md:h-12 ${index2 % 2 === 0 ? "bg-neutral-500/10 dark:bg-neutral-500/25" : ""}`}
              >
                <progress
                  className={`${index2 % 2 !== 0 ? "win-rate-bar-blue" : "win-rate-bar-orange"} ${progress !== 1 ? "win-rate-bar-rounded" : ""} absolute inset-0 h-full w-full appearance-none`}
                  value={progress}
                />

                <div className="absolute inset-0 flex items-center justify-between px-3 md:px-4">
                  <div className="flex min-w-0 items-center">
                    {/* place in ranking, dark text */}
                    <span
                      className={`text-xl font-light italic md:text-2xl ${
                        [...ranking].sort(sortUtensils)[index2 - 1] &&
                        [...ranking].sort(sortUtensils)[index2 - 1]["score"] ==
                          utensil["score"]
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
                        [...ranking].sort(sortUtensils)[index2 - 1] &&
                        [...ranking].sort(sortUtensils)[index2 - 1]["score"] ==
                          utensil["score"]
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
                      typeof utensil["losses"] === "number" ? "" : "hidden"
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
  );
}
