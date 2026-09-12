import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { getNumCombos } from "@/lib/utilities";
import { useState, type MouseEvent } from "react";
import { Utensil } from "@/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBullseye } from "@fortawesome/free-solid-svg-icons";

export default function RankButtons({
  onHurry,
  onConcentrate,
  utensilsArrayLength,
  showNumCombos = false,
  className = "",
}: {
  onHurry: (utensilsArray: Utensil[]) => void;
  onConcentrate: (utensilsArray: Utensil[]) => void;
  e?: MouseEvent<HTMLAnchorElement>;
  utensilsArrayLength: number;
  showNumCombos?: boolean;
  className?: string;
}) {
  const numCombos = getNumCombos(utensilsArrayLength);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      {/* error ranking modal */}
      <ConfirmModal
        visibility={errorRankingModalVisibility}
        titleText="You already have a ranking in progress"
        subtitleText="Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      <div className={className}>
        <div className="flex gap-2.5 md:gap-3">
          <Link
            onClick={(event) => {
              if (
                localStorage.getItem("combosArray") &&
                localStorage.getItem("combosArray") !== "[]"
              ) {
                event?.preventDefault();
                setErrorRankingModalVisibility(true);
              } else {
                onHurry([]);
              }
            }}
            href="/create"
            className="group relative w-full cursor-pointer overflow-hidden rounded-md bg-orange-500/90 px-4 py-3 text-neutral-50 transition hover:bg-orange-500/80 active:bg-orange-500/70 md:px-6 lg:py-6 dark:text-black"
          >
            <FontAwesomeIcon
              icon={faBolt}
              className="absolute top-1/2 -left-4 block -translate-y-1/2 transform text-7xl text-orange-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md sm:text-8xl md:left-0 lg:text-9xl dark:text-orange-800/50"
              aria-hidden
            />
            <span className="block text-right text-sm font-medium md:text-base">
              Rank quickly
            </span>
            <span className="mt-0.5 block pl-4 text-right text-xs leading-3.5 text-white/60 md:pl-8 md:text-sm md:leading-4 dark:text-black/50">
              Quicker session, fewer matchups
            </span>
          </Link>
          <Link
            onClick={(event) => {
              if (
                localStorage.getItem("combosArray") &&
                localStorage.getItem("combosArray") !== "[]"
              ) {
                event?.preventDefault();
                setErrorRankingModalVisibility(true);
              } else {
                onConcentrate([]);
              }
            }}
            href="/create"
            className="group relative w-full cursor-pointer overflow-hidden rounded-md bg-blue-500/90 px-4 py-3 text-neutral-50 transition hover:bg-blue-500/80 active:bg-blue-500/70 md:px-6 lg:py-6 dark:text-black"
          >
            <FontAwesomeIcon
              icon={faBullseye}
              className="absolute top-1/2 -left-7 block -translate-y-1/2 transform text-7xl text-blue-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md sm:text-8xl md:-left-3 lg:text-9xl dark:text-blue-800/50"
              aria-hidden
            />
            <span className="block text-right text-sm font-medium md:text-base">
              Rank accurately
            </span>
            <span className="mt-0.5 block pl-4 text-right text-xs leading-3.5 text-white/60 md:pl-8 md:text-sm md:leading-4 dark:text-black/50">
              More accurate final ranking
            </span>
          </Link>
        </div>
        <div
          className={`mt-1 gap-2.5 text-right text-xs text-neutral-600 md:gap-3 md:text-sm dark:text-neutral-400 ${showNumCombos ? "flex" : "hidden"}`}
        >
          <p className="w-full pr-4 md:pr-6">
            {Math.ceil(numCombos / 2)} pairs
          </p>
          <p className="w-full pr-4 md:pr-6">{numCombos} pairs</p>
        </div>
      </div>
    </>
  );
}
