import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import MasonryLayout from "@/components/MasonryLayout";
import { randomElement, shuffle } from "@/utilities";
import { useEffect, useState } from "react";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { STARTER_SETS } from "@/constants";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<
    {
      setName: string;
      utensilSet: { title: string }[];
    }[]
  >([]);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    setStarterSets(
      STARTER_SETS.toSpliced(1, 0, {
        setName: "Random mix",
        utensilSet: shuffle([
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
          { title: "????????" },
        ]),
      }),
    );
  }, []);

  return (
    <>
      <CommonHead />

      {/* error ranking modal */}
      <ConfirmModal
        visibility={errorRankingModalVisibility}
        titleText="You already have a ranking in progress"
        subtitleText="Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="mt-24 flex h-full w-full items-center justify-center pb-16 md:mt-48">
          <div>
            <MasonryLayout
              defaultCols={1}
              smCols={1}
              mdCols={1}
              lgCols={2}
              xlCols={2}
              className="flex"
              columnClassName="bg-clip-padding px-6"
            >
              {[...starterSets].map((set, index1) => (
                <div className="mb-10 w-full md:mb-12 lg:w-96" key={index1}>
                  <div className="mb-0.5 flex items-end gap-2 px-2 md:mb-1">
                    <h2
                      className={`w-full overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
                    >
                      {set["setName"]}
                    </h2>
                  </div>
                  <ul className="h-max overflow-y-auto rounded-lg border-2 border-neutral-400/40">
                    {/* create shallow copy of set["utensilSet"] (so it wont actually change the set["utensilSet"] variable), sort utensils by their score */}
                    {[...set["utensilSet"]].map((utensil, index2) => (
                      <li
                        key={index2}
                        className="flex items-center justify-center px-2 py-1 first:rounded-t-md last:rounded-b-md odd:bg-neutral-500/10 dark:odd:bg-neutral-500/25 md:px-2.5 md:py-1.5"
                      >
                        <p
                          className={`w-full text-sm md:text-base ${utensil["title"] === "????????" ? `animate-pulse text-neutral-500` : ""}`}
                        >
                          {utensil["title"]}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-base lg:px-3 lg:py-2"
                    href="/create"
                    onClick={(event) => {
                      if (
                        localStorage.getItem("combosArray") &&
                        localStorage.getItem("combosArray") !== "[]"
                      ) {
                        event.preventDefault();
                        setErrorRankingModalVisibility(true);
                      } else {
                        localStorage.setItem(
                          "utensilInput",
                          set["utensilSet"]
                            .map((utensil) =>
                              utensil.title !== "????????"
                                ? utensil.title
                                : randomElement(
                                    randomElement(
                                      [...starterSets].filter(
                                        (s) => s["setName"] !== "Random mix",
                                      ),
                                    )["utensilSet"],
                                  )["title"],
                            )
                            .join("\n"),
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="mr-2 rotate-90 text-neutral-800 dark:text-neutral-300"
                      aria-labelledby="rank-this-set-button-text"
                    />
                    <span id="rank-this-set-button-text">Rank this set</span>
                  </Link>
                </div>
              ))}
            </MasonryLayout>
          </div>
        </div>
      </div>
    </>
  );
}
