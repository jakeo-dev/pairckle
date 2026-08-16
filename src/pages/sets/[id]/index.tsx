import ConfirmModal from "@/components/ConfirmModal";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Set } from "@/types";
import { randomElement, shuffle } from "@/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/sets";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faFlag,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

import { supabase } from "@/utils/supabase";

export default function SharedSet() {
  const router = useRouter();
  const { id: setID } = router.query;

  const [currentSet, setCurrentSet] = useState<Set>({
    id: "",
    createdAt: "",
    name: "",
    username: "",
    utensils: [],
    userID: "",
  });

  useEffect(() => {
    async function getCurrentSet() {
      if (!setID) return;

      if (isNaN(Number(setID))) {
        const { data: userSetsData, error: userSetsError } = await supabase
          .from("user_sets")
          .select()
          .eq("id", setID);
        if (userSetsError) console.error("error:", userSetsError);
        // convert snake case from database to camel case
        const newSharedSets = userSetsData?.map((set) => {
          return {
            ...set,
            createdAt: set.created_at,
            userID: set.user_id,
          };
        });

        if (newSharedSets) {
          setCurrentSet(newSharedSets[0]);
        }
      } else if (Number(setID) === 0) {
        const newCurrentSet = RANDOM_SET;
        setCurrentSet(newCurrentSet);
      } else {
        const newCurrentSet = STARTER_SETS.filter((set) => {
          return set.id === setID;
        })[0];
        setCurrentSet(newCurrentSet);
      }
    }

    getCurrentSet();
  }, [router.isReady, setID]);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
    useState<boolean>(false);

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

      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + setID}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + setID,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.3vh]">
          {currentSet && (
            <Heading
              icon={faBarsStaggered}
              text={currentSet.name}
              subtext1={currentSet.username}
              subtext2={
                currentSet.createdAt
                  ? new Date(currentSet.createdAt).toLocaleDateString()
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
          )}

          {currentSet ? (
            <div className="section mb-10 md:mb-12">
              <SetBoard
                showAllUtensils
                set={{
                  id: currentSet.id,
                  name: "",
                  utensils: shuffle(currentSet.utensils),
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
            </div>
          ) : (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading set...
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
