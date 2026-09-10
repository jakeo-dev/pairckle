import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import RankButtons from "./RankButtons";
import { UtensilSet, Utensil } from "@/types";
import { useEffect, useState } from "react";
import { shuffle } from "@/lib/utilities";

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
  disabled = false,
}: {
  set: UtensilSet;
  onRankNow?: (rankingType: string) => void;
  showAllUtensils?: boolean;
  className?: string;
  miniView?: boolean;
  disabled?: boolean;
}) {
  const [utensils, setUtensils] = useState<Utensil[]>([]);
  const [areUtensilsShuffled, setAreUtensilsShuffled] =
    useState<boolean>(false);

  useEffect(() => {
    if (set.utensils.length < 1 || areUtensilsShuffled) return;

    setAreUtensilsShuffled(true);
    setUtensils(shuffle(set.utensils));
  }, [set]);

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

      <>
        {onRankNow && (
          <RankButtons
            onHurry={() => onRankNow?.("hurry")}
            onConcentrate={() => onRankNow?.("concentrate")}
            utensilsArrayLength={utensils.length}
            className="mb-2.5 md:mb-3"
          />
        )}
        <Link
          href={`/sets/${set.id}`}
          className={`${disabled ? "pointer-events-none" : ""} ${miniView ? "min-w-56 rounded-lg bg-neutral-300/10 p-2 transition hover:bg-neutral-400/25 active:bg-neutral-400/35 md:min-w-72 dark:bg-neutral-400/10 dark:hover:bg-neutral-600/25 dark:active:bg-neutral-600/35" : ""} ${className || ""}`}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
        >
          {(set.username || set.name || set.createdAt) && (
            <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 md:gap-2 md:text-sm dark:text-neutral-300">
                  {set.username && (
                    <h3 className="line-clamp-1 font-semibold">
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
                  className={`line-clamp-1 text-base leading-6 font-medium md:text-lg ${gabarito.className}`}
                >
                  {set.name}
                </h2>
              </div>
            </div>
          )}

          <ul
            className={`${utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} w-full rounded-lg border-2 border-neutral-400/25 text-neutral-700 dark:text-neutral-200`}
          >
            {/* create shallow copy of utensils (so it wont actually change the utensils variable), sort randomly */}
            {[...utensils]
              .slice(0, showAllUtensils ? utensils.length : 5)
              .map((utensil, index) => (
                <li
                  key={index}
                  className={`px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 ${miniView ? "md:px-2.5 md:py-1.5" : "md:px-3.5 md:py-2"}`}
                >
                  <p
                    className={`text-sm md:text-base ${showAllUtensils ? "" : "line-clamp-2"} ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
                  >
                    {utensil.title}
                  </p>
                </li>
              ))}
          </ul>

          {/* <div
              className={`${utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} grid w-full grid-cols-2 divide-x-2 divide-y-2 divide-solid divide-neutral-400/25 overflow-hidden rounded-lg border-2 border-neutral-400/25 text-neutral-700 dark:text-neutral-200 [&>*:nth-child(2)]:border-t-0! [&>*:nth-child(4n)]:bg-neutral-500/10 dark:[&>*:nth-child(4n)]:bg-neutral-500/25 [&>*:nth-child(4n+1)]:bg-neutral-500/10 dark:[&>*:nth-child(4n+1)]:bg-neutral-500/25`}
            >
              {[...utensils]
                .slice(0, showAllUtensils ? utensils.length : 5)
                .map((utensil, index) => (
                  <div
                    key={index}
                    className="bg-transparent px-2 py-1 odd:border-l-0! even:border-r-0! md:px-2.5 md:py-1.5"
                  >
                    <p
                      className={`text-sm md:text-base ${showAllUtensils ? "" : "line-clamp-2"} ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
                    >
                      {utensil.title}
                    </p>
                  </div>
                ))}
            </div> */}
        </Link>
      </>
    </>
  );
}
