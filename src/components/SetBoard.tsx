import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { Set, Utensil } from "@/types";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBullseye } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
import { shuffle } from "@/lib/utilities";
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
          <div className="mb-2.5 flex gap-2.5 md:mb-3 md:gap-3">
            <Link
              onClick={(e) => {
                onRankNow?.(e, "hurry");
                localStorage.setItem("associatedSetID", String(set.id));
              }}
              href="/create"
              className="group relative w-full overflow-hidden rounded-md bg-orange-500/90 px-3 py-4 text-neutral-50 transition hover:bg-orange-500/80 active:bg-orange-500/70 dark:text-black lg:py-6"
            >
              <FontAwesomeIcon
                icon={faBolt}
                className="absolute -left-4 top-1/2 block -translate-y-1/2 transform text-7xl text-orange-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md dark:text-orange-800/50 sm:text-8xl md:left-0 lg:text-9xl"
                aria-hidden
              />
              <span className="block text-right text-sm font-medium sm:text-center md:text-base">
                Hurry
              </span>
              <span className="block text-right text-xs text-white/60 dark:text-black/50 sm:text-center md:text-sm">
                Quicker session
              </span>
            </Link>
            <Link
              onClick={(e) => {
                onRankNow?.(e, "concentrate");
                localStorage.setItem("associatedSetID", String(set.id));
              }}
              href="/create"
              className="group relative w-full overflow-hidden rounded-md bg-blue-500/90 px-3 py-4 text-neutral-50 transition hover:bg-blue-500/80 active:bg-blue-500/70 dark:text-black lg:py-6"
            >
              <FontAwesomeIcon
                icon={faBullseye}
                className="absolute -left-7 top-1/2 block -translate-y-1/2 transform text-7xl text-blue-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md dark:text-blue-800/50 sm:text-8xl md:-left-3 lg:text-9xl"
                aria-hidden
              />
              <span className="block text-right text-sm font-medium sm:text-center md:text-base">
                Concentrate
              </span>
              <span className="block text-right text-xs text-white/60 dark:text-black/50 sm:text-center md:text-sm">
                More accurate
              </span>
            </Link>
          </div>
        )}
        <Link
          href={`/sets/${set.id}`}
          className={`${miniView ? "min-w-56 rounded-lg bg-neutral-300/10 p-2 transition hover:bg-neutral-400/25 active:bg-neutral-400/35 dark:bg-neutral-400/10 dark:hover:bg-neutral-600/25 dark:active:bg-neutral-600/35 md:min-w-72" : ""} ${className || ""}`}
        >
          {(set.username || set.name || set.createdAt) && (
            <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1 md:gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 md:gap-2 md:text-sm">
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
                  className={`line-clamp-1 text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
                >
                  {set.name}
                </h2>
              </div>
            </div>
          )}

          <ul
            className={`${utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} w-full rounded-lg border-2 border-neutral-500/15 text-neutral-700 dark:border-neutral-500/40 dark:text-neutral-200`}
          >
            {/* create shallow copy of utensils (so it wont actually change the utensils variable), sort randomly */}
            {[...utensils]
              .slice(0, showAllUtensils ? utensils.length : 5)
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

          {/* {miniView ? (
            <ul
              className={`${utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} w-full rounded-lg border-2 border-neutral-500/15 text-neutral-700 dark:border-neutral-500/40 dark:text-neutral-200`}
            >
              {[...utensils]
                .slice(0, showAllUtensils ? utensils.length : 5)
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
          ) : (
            <div
              className={`${utensils.length > 5 && !showAllUtensils ? "fade-text" : ""} grid w-full grid-cols-2 divide-x-2 divide-y-2 divide-solid divide-neutral-400/25 overflow-hidden rounded-lg border-2 border-neutral-400/25 text-neutral-700 dark:text-neutral-200 [&>*:nth-child(2)]:!border-t-0 [&>*:nth-child(4n)]:bg-neutral-500/10 dark:[&>*:nth-child(4n)]:bg-neutral-500/25 [&>*:nth-child(4n+1)]:bg-neutral-500/10 dark:[&>*:nth-child(4n+1)]:bg-neutral-500/25`}
            >
              {[...utensils]
                .slice(0, showAllUtensils ? utensils.length : 5)
                .map((utensil, index) => (
                  <div
                    key={index}
                    className="bg-transparent px-2 py-1 odd:!border-l-0 even:!border-r-0 md:px-2.5 md:py-1.5"
                  >
                    <p
                      className={`text-sm md:text-base ${showAllUtensils ? "" : "line-clamp-2"} ${utensil.title === "????????" ? "animate-pulse text-neutral-500" : ""}`}
                    >
                      {utensil.title}
                    </p>
                  </div>
                ))}
            </div>
          )} */}
        </Link>
      </>
    </>
  );
}
