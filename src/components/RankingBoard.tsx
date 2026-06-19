import Title from "./Title";
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
  faChartSimple,
  faCircleDown,
  faEllipsis,
  faPen,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import * as htmlToImage from "html-to-image";

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

  const exportViewRef = useRef<HTMLDivElement>(null);

  const [settingsVis, setSettingsVis] = useState("invisible-fade");

  const settingsDivRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  function handleSettingsOutsideClick(event: MouseEvent) {
    if (
      settingsDivRef.current &&
      settingsBtnRef.current &&
      !settingsDivRef.current.contains(event.target as Element) &&
      !settingsBtnRef.current.contains(event.target as Element)
    )
      setSettingsVis("invisible-fade");
  }

  useEffect(() => {
    document.addEventListener("click", handleSettingsOutsideClick);
    return () =>
      document.removeEventListener("click", handleSettingsOutsideClick);
  }, []);

  const [shareVis, setShareVis] = useState("invisible-fade");

  const shareDivRef = useRef<HTMLDivElement>(null);
  const shareBtnRef = useRef<HTMLButtonElement>(null);

  function handleShareOutsideClick(event: MouseEvent) {
    if (
      shareDivRef.current &&
      shareBtnRef.current &&
      !shareDivRef.current.contains(event.target as Element) &&
      !shareBtnRef.current.contains(event.target as Element)
    )
      setShareVis("invisible-fade");
  }

  useEffect(() => {
    document.addEventListener("click", handleShareOutsideClick);
    return () => document.removeEventListener("click", handleShareOutsideClick);
  }, []);

  return (
    <div className={`w-full md:w-[45rem] ${className || ""}`}>
      <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
        <div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 md:gap-2 md:text-sm">
            <h3 className="overflow-ellipsis lg:line-clamp-1">
              {ranking.rankingType === "hurry" ? "Hurried" : "Concentrated"}
            </h3>
            <span>•</span>
            <h3 className="overflow-ellipsis lg:line-clamp-1">
              {ranking.rankingDate
                ? `${monthName(ranking.rankingDate.month).slice(
                    0,
                    3,
                  )}. ${ranking.rankingDate.day} ${ranking.rankingDate.year}`
                : ""}
            </h3>
          </div>
          <h2
            className={`flex items-center overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
          >
            {ranking.rankingName}
          </h2>
        </div>

        <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
          <div className="relative inline-block">
            <button
              className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-sm"
              onClick={() => {
                if (shareVis === "invisible-fade") setShareVis("visible-fade");
                else if (shareVis === "visible-fade")
                  setShareVis("invisible-fade");
              }}
              ref={shareBtnRef}
            >
              <FontAwesomeIcon
                icon={faShare}
                className="mr-1 md:mr-1.5"
                aria-labelledby="share-button-text"
              />
              <span id="share-button-text">Share</span>
            </button>
            <div
              ref={shareDivRef}
              className={`${shareVis} absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border-2 border-neutral-300 bg-neutral-50 shadow-md dark:border-neutral-700 dark:bg-black md:w-52`}
            >
              <button
                className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                onClick={async () => {
                  const node = exportViewRef.current;
                  console.log(node);

                  try {
                    node?.classList.remove("hidden");

                    await new Promise((resolve) => setTimeout(resolve, 100));
                    console.log(node);

                    const dataUrl = await htmlToImage.toPng(
                      node || new HTMLElement(),
                    );

                    const a = document.createElement("a");
                    a.href = dataUrl;
                    a.download = `pairckle-${ranking.rankingName.toLocaleLowerCase().replace(/\s+/g, "-")}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error("Error:", error);
                  } finally {
                    node?.classList.add("hidden");
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faCircleDown}
                  className="mr-2 w-4 text-neutral-700 dark:text-neutral-400 md:mr-3"
                  aria-labelledby="download-button-text"
                />
                <span id="download-button-text">Download as PNG</span>
              </button>
            </div>
          </div>

          {onReRank || onEditTitle || onDelete ? (
            <div className="relative inline-block">
              <button
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:h-7 md:w-7 md:p-1 md:text-sm"
                onClick={() => {
                  if (settingsVis === "invisible-fade")
                    setSettingsVis("visible-fade");
                  else if (settingsVis === "visible-fade")
                    setSettingsVis("invisible-fade");
                }}
                ref={settingsBtnRef}
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  aria-label="More options"
                  title="More options"
                />
              </button>
              <div
                ref={settingsDivRef}
                className={`${settingsVis} absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border-2 border-neutral-300 bg-neutral-50 shadow-md dark:border-neutral-700 dark:bg-black md:w-52`}
              >
                {onReRank && (
                  <Link
                    className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                    href="/create"
                    onClick={(e) => onReRank(e)}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="mr-2 w-4 rotate-90 text-neutral-700 dark:text-neutral-400 md:mr-3"
                      aria-labelledby="re-rank-button-text"
                    />
                    <span id="re-rank-button-text">Re-rank</span>
                  </Link>
                )}

                {onEditTitle && (
                  <button
                    className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                    onClick={onEditTitle}
                  >
                    <FontAwesomeIcon
                      icon={faPen}
                      className="mr-2 w-4 text-neutral-700 dark:text-neutral-400 md:mr-3"
                      aria-labelledby="edit-title-button-text"
                    />
                    <span id="edit-title-button-text">Edit title</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                    onClick={onDelete}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="mr-2 w-4 text-neutral-700 dark:text-neutral-400 md:mr-3"
                      aria-labelledby="delete-button-text"
                    />
                    <span id="delete-button-text">Delete</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <ul className="h-max overflow-hidden rounded-lg border-2 border-neutral-500/15 text-neutral-50 dark:border-neutral-500/40">
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
                    ] === utensil["score"]
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
                              ]["score"] === utensil["score"]
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
                          className={`h-full ${index2 % 2 !== 0 ? "bg-blue-500/90" : "bg-orange-500/90"} ${progress !== 1 ? "rounded-r-full" : ""}`}
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
                              ]["score"] === utensil["score"]
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

      <ExportView ref={exportViewRef} ranking={ranking} index1={index1} />
    </div>
  );
}

/* view of ranking for exporting as image */
export function ExportView({
  ranking,
  index1,
  ref,
}: {
  ranking: Ranking;
  index1: number;
  ref: React.RefObject<HTMLDivElement | null>;
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
                    ? utensil["wins"] + utensil["losses"] !== 0
                      ? utensil["wins"] / (utensil["wins"] + utensil["losses"])
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
                            ]["score"] === utensil["score"]
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
                        className={`h-full ${index2 % 2 !== 0 ? "bg-blue-500/90" : "bg-orange-500/90"} ${progress !== 1 ? "rounded-r-full" : ""}`}
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
                            ]["score"] === utensil["score"]
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
    </div>
  );
}
