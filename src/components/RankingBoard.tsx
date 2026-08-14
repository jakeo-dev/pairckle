import Title from "./Title";
import Link from "next/link";
import ShareSetModal from "./ShareSetModal";
import ConfirmModal from "./ConfirmModal";
import { useEffect, useRef, useState } from "react";
import { randomNumber, shuffle, sortUtensils } from "@/utilities";
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
  faGlobe,
  faPen,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import * as htmlToImage from "html-to-image";

import { supabase } from "@/utils/supabase";

export default function RankingBoard({
  ranking,
  showReRank = false,
  onEditTitle,
  onDelete,
  showAllUtensils = false,
  showSeeRankingButton,
  index1,
  className = "",
  savedRankings,
}: {
  ranking: Ranking;
  showReRank?: boolean;
  onEditTitle?: () => void;
  onDelete?: () => void;
  showAllUtensils?: boolean;
  showSeeRankingButton?: boolean;
  index1: number;
  className?: string;
  savedRankings: Ranking[];
}) {
  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(
    savedRankings.length > 0 ? savedRankings.length : 1,
  ).fill(1);

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

  const [shareLinkModalVisibility, setShareLinkModalVisibility] =
    useState<boolean>(false);
  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
    useState<boolean>(false);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  const [setID, setSetID] = useState<string>("");

  return (
    <>
      {/* share set link modal */}
      <ShareSetModal
        visibility={shareLinkModalVisibility}
        onConfirm={async (inputValue1, inputValue2, checkboxValue) => {
          const newSetID =
            inputValue1
              ?.replaceAll(/[^\w]/gi, " ")
              .replaceAll(/\s+/gi, " ")
              .trim()
              .toLowerCase()
              .split(" ")
              .slice(0, 3)
              .join("-") +
            "-" +
            randomNumber(10000000, 99999999);

          setSetID(newSetID);

          const { error: userSetsError } = await supabase
            .from("user_sets")
            .insert([
              {
                id: newSetID,
                name: inputValue1,
                username: inputValue2,
                discoverable: checkboxValue,
                utensils: ranking.rankedUtensils.map((utensil) => ({
                  title: utensil.title,
                })),
              },
            ])
            .select();
          if (userSetsError) console.error("error:", userSetsError);

          setShareLinkModalVisibility(false);
          setCopyLinkModalVisibility(true);
        }}
        onCancel={() => setShareLinkModalVisibility(false)}
      />

      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + setID}
        primaryButtonText="Copy link"
        primaryButtonTextClicked="Copied!"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + setID,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      {/* error ranking modal */}
      <ConfirmModal
        visibility={errorRankingModalVisibility}
        titleText="You already have a ranking in progress"
        subtitleText="Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      <div className={`w-full ${className || ""}`}>
        <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
          <div>
            {ranking.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 md:gap-2 md:text-sm">
                <h3 className="line-clamp-1 font-semibold">
                  {ranking.type === "hurry" ? "Hurried" : "Concentrated"}
                </h3>
                <h3 className="min-w-max text-neutral-500 dark:text-neutral-400">
                  {ranking.createdAt
                    ? new Date(ranking.createdAt).toLocaleDateString()
                    : "N/A"}
                </h3>
              </div>
            )}
            <h2
              className={`line-clamp-1 text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
            >
              {ranking.name}
            </h2>
          </div>

          <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
            <div className="relative inline-block">
              <button
                className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-sm"
                onClick={() => {
                  if (shareVis === "invisible-fade")
                    setShareVis("visible-fade");
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
                  onClick={() => {
                    setShareLinkModalVisibility(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="mr-2 w-4 text-neutral-700 dark:text-neutral-400 md:mr-3"
                    aria-labelledby="publish-set-button-text"
                  />
                  <span id="publish-set-button-text">Publish this set</span>
                </button>
                <button
                  className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                  onClick={async () => {
                    const node = exportViewRef.current;

                    try {
                      node?.classList.remove("hidden");

                      await new Promise((resolve) => setTimeout(resolve, 100));

                      const dataUrl = await htmlToImage.toPng(
                        node || new HTMLElement(),
                      );

                      const a = document.createElement("a");
                      a.href = dataUrl;
                      a.download = `pairckle-${ranking.name.toLocaleLowerCase().replace(/\s+/g, "-")}.png`;
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

            {(showReRank || onEditTitle || onDelete) && (
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
                  {showReRank && (
                    <Link
                      className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                      href="/create"
                      onClick={(e) => {
                        if (
                          localStorage.getItem("combosArray") &&
                          localStorage.getItem("combosArray") !== "[]"
                        ) {
                          e.preventDefault();
                          setErrorRankingModalVisibility(true);
                        } else {
                          localStorage.setItem(
                            "utensilInput",
                            shuffle(
                              ranking.rankedUtensils.map(
                                (utensil) => utensil.title,
                              ),
                            ).join("\n"),
                          );
                        }
                      }}
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
                      className="group flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 hover:text-red-700 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:hover:text-red-400 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                      onClick={onDelete}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="mr-2 w-4 text-neutral-700 group-hover:text-red-800 dark:text-neutral-400 dark:group-hover:text-red-300 md:mr-3"
                        aria-labelledby="delete-button-text"
                      />
                      <span id="delete-button-text">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <ul
            className={`${ranking.rankedUtensils.length > 5 && !showAllUtensils ? "fade-text" : ""} h-max overflow-hidden rounded-lg border-2 border-neutral-500/15 text-neutral-50 dark:border-neutral-500/40`}
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
                      [...ranking.rankedUtensils].sort(sortUtensils)[
                        index2 - 1
                      ]["score"] === utensil["score"]
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

          {showSeeRankingButton && (
            <div className="mt-2 flex gap-2">
              <Link
                className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
                href={`/rankings/${ranking.id}`}
              >
                <FontAwesomeIcon
                  icon={faChartSimple}
                  className="mr-2 rotate-90 text-neutral-800 dark:text-neutral-300"
                  aria-labelledby="see-ranking-button-text"
                />
                <span id="see-ranking-button-text">View ranking</span>
              </Link>
            </div>
          )}
        </div>

        <ExportView
          ref={exportViewRef}
          ranking={ranking}
          index1={index1}
          savedRankings={savedRankings}
        />
      </div>
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
