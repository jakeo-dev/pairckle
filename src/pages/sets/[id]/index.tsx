import ConfirmModal from "@/components/ConfirmModal";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Set } from "@/types";
import { monthName, randomElement, shuffle } from "@/utilities";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faFlag,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

import { supabase } from "../../../utils/supabase";
import { RANDOM_SET, STARTER_SETS } from "@/sets";

export default function SharedSet() {
  const router = useRouter();
  const { id } = router.query;

  const [currentSet, setCurrentSet] = useState<Set>({
    id: "",
    sharedAt: "",
    name: "",
    username: "",
    utensils: [],
  });

  useEffect(() => {
    async function getCurrentSet() {
      if (isNaN(Number(id))) {
        const { data: sharedSets } = await supabase
          .from("shared_sets")
          .select()
          .eq("id", id);
        const newSharedSets = sharedSets?.map((set) => {
          return {
            ...set,
            sharedAt: set.shared_at,
          };
        });

        if (newSharedSets) {
          setCurrentSet(newSharedSets[0]);
        }
      } else if (Number(id) === 0) {
        const newCurrentSet = RANDOM_SET;
        setCurrentSet(newCurrentSet);
      } else {
        const newCurrentSet = STARTER_SETS.filter((set) => {
          return set.id === id;
        })[0];
        setCurrentSet(newCurrentSet);
      }
    }

    getCurrentSet();
  }, [router.isReady, id]);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
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

      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + id}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + id,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      <div className="flex w-full items-center justify-center pb-16 lg:min-h-[94.6vh]">
        <div className="w-full">
          <Heading
            icon={faBarsStaggered}
            text={currentSet.name}
            subtext1={currentSet.username}
            subtext2={
              currentSet.sharedAt
                ? `${monthName(
                    Number(currentSet.sharedAt.split("T")[0].split("-")[1]),
                  ).slice(
                    0,
                    3,
                  )}. ${Number(currentSet.sharedAt.split("T")[0].split("-")[2])} ${Number(currentSet.sharedAt.split("T")[0].split("-")[0])}`
                : ""
            }
          >
            <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
              <button
                className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-base"
                onClick={() => {
                  setCopyLinkModalVisibility(true);
                }}
              >
                <FontAwesomeIcon
                  icon={faShare}
                  className="mr-1.5"
                  aria-labelledby="share-button-text"
                />
                <span id="share-button-text">Share</span>
              </button>
              <a
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:h-8 md:w-8 md:p-1 md:text-base"
                href="mailto:report@jakeo.dev"
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faFlag}
                  aria-label="Report this set"
                  title="Report this set"
                />
              </a>
            </div>
          </Heading>

          {currentSet && (
            <div className="section mb-10 md:mb-12">
              <SetBoard
                id={currentSet.id}
                showAllUtensils
                set={{
                  id: currentSet.id,
                  name: "",
                  utensils: currentSet.utensils,
                }}
                /* onRank={(event) => {
                    if (
                      localStorage.getItem("combosArray") &&
                      localStorage.getItem("combosArray") !== "[]"
                    ) {
                      event.preventDefault();
                      setErrorRankingModalVisibility(true);
                    } else {
                      localStorage.setItem(
                        "utensilInput",
                        shuffle(currentSet.utensils)
                          .map((utensil) => utensil.title)
                          .join("\n"),
                      );
                    }
                  }} */
                onRankNow={(event, rankingType) => {
                  if (
                    localStorage.getItem("combosArray") &&
                    localStorage.getItem("combosArray") !== "[]"
                  ) {
                    event.preventDefault();
                    setErrorRankingModalVisibility(true);
                  } else {
                    localStorage.setItem(
                      "utensilInput",
                      shuffle(currentSet.utensils)
                        .map((utensil) =>
                          utensil.title !== "????????"
                            ? utensil.title
                            : randomElement(
                                randomElement(STARTER_SETS).utensils,
                              ).title,
                        )
                        .join("\n"),
                    );
                    localStorage.setItem("rankNow", rankingType);
                  }
                }}
              />

              {/* <Link
                className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
                href="/sets"
              >
                <FontAwesomeIcon
                  icon={faBarsStaggered}
                  className="mr-2 text-neutral-800 dark:text-neutral-300"
                  aria-labelledby="browse-more-sets-button-text"
                />
                <span id="browse-more-sets-button-text">Browse more sets</span>
              </Link> */}

              {/* <h1 className="mt-4 rounded-full bg-neutral-400/20 p-2 text-center text-lg dark:bg-neutral-400/25">
                  Shared by <strong>{currentSet.username}</strong>
                </h1> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
