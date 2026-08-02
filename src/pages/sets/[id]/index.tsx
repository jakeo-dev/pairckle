import ConfirmModal from "@/components/ConfirmModal";
import SetBoard from "@/components/SetBoard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SharedSetData } from "@/types";
import { shuffle } from "@/utilities";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";

import { supabase } from "../../../utils/supabase";

export default function SharedSet() {
  const router = useRouter();
  const { id } = router.query;

  const [currentSet, setCurrentSet] = useState<SharedSetData>({
    id: "",
    shared_at: "",
    name: "",
    username: "",
    utensils: [],
  });

  useEffect(() => {
    async function getCurrentSet() {
      const { data: sharedSets } = await supabase.from("shared_sets").select();

      if (sharedSets) {
        const thisSet = sharedSets.filter((set) => set.id === id)[0];

        setCurrentSet(thisSet);
      }
    }

    getCurrentSet();
  }, [router.isReady, id]);

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

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="mt-24 flex h-full w-full items-center justify-center px-6 pb-16 md:mt-48">
          <div className="w-full md:w-auto">
            {currentSet && (
              <>
                <SetBoard
                  id={currentSet.id}
                  showReportButton
                  className="mb-10 md:mb-12"
                  set={{
                    name: currentSet.name,
                    utensils: currentSet.utensils,
                    username: currentSet.username,
                    sharedAt: currentSet.shared_at,
                  }}
                  onRank={(event) => {
                    if (
                      localStorage.getItem("combosArray") &&
                      localStorage.getItem("combosArray") !== "[]"
                    ) {
                      event.preventDefault();
                      setErrorRankingModalVisibility(true);
                    } else {
                      localStorage.setItem(
                        "utensilInput",
                        shuffle(currentSet.utensils).join("\n"),
                      );
                    }
                  }}
                />

                <Link
                  className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base lg:px-3"
                  href="/sets"
                >
                  <FontAwesomeIcon
                    icon={faBarsStaggered}
                    className="mr-2 text-neutral-800 dark:text-neutral-300"
                    aria-labelledby="browse-more-sets-button-text"
                  />
                  <span id="browse-more-sets-button-text">
                    Browse more sets
                  </span>
                </Link>

                {/* <h1 className="mt-4 rounded-full bg-neutral-400/20 p-2 text-center text-lg dark:bg-neutral-400/25">
                  Shared by <strong>{currentSet.username}</strong>
                </h1> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
