import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import MasonryLayout from "@/components/MasonryLayout";
import SetBoard from "@/components/SetBoard";
import { randomElement, shuffle } from "@/utilities";
import { STARTER_SETS } from "@/constants";
import { useEffect, useState } from "react";
import { Set, SharedSetData } from "@/types";

import { supabase } from "../../utils/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<Set[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<SharedSetData[]>([]);

  useEffect(() => {
    async function getDiscoverableSets() {
      const { data: sharedSets } = await supabase
        .from("shared_sets")
        .select()
        .eq("discoverable", true);

      if (sharedSets) {
        setDiscoverableSets(sharedSets.toReversed());
      }
    }

    getDiscoverableSets();
  }, []);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    setStarterSets(
      STARTER_SETS.toSpliced(1, 0, {
        name: "Random mix",
        utensils: shuffle([
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
        <div className="mt-24 flex h-full w-full items-center justify-center px-6 pb-16 md:mt-48">
          <div>
            <h2 className="mb-12 flex items-center border-b-2 border-gray-400/30 px-2 pb-4 text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
              <FontAwesomeIcon
                icon={faGlobe}
                className="mr-3 text-gray-500 dark:text-gray-400"
              />
              Discoverable sets
            </h2>
            {discoverableSets.length > 0 ? (
              <MasonryLayout
                defaultCols={1}
                smCols={1}
                mdCols={1}
                lgCols={2}
                xlCols={2}
                className="flex"
                columnClassName="bg-clip-padding lg:odd:mr-12"
              >
                {[...discoverableSets].map((set, index1) => (
                  <SetBoard
                    key={index1}
                    id={set.id}
                    dontShowAll
                    showShareButton
                    showReportButton
                    className="mb-10 w-full md:mb-12 lg:w-96"
                    set={{
                      name: set.name,
                      utensils: shuffle(set.utensils),
                      username: set.username,
                      sharedAt: set.shared_at,
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
                          shuffle(
                            set.utensils.map((utensil) => utensil.title),
                          ).join("\n"),
                        );
                      }
                    }}
                  />
                ))}
              </MasonryLayout>
            ) : (
              <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                Loading sets...
              </h2>
            )}

            <h2 className="mb-12 mt-12 flex items-center border-b-2 border-gray-400/30 px-2 pb-4 text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
              <FontAwesomeIcon
                icon={faBoxArchive}
                className="mr-3 text-gray-500 dark:text-gray-400"
              />
              Pre-made sets
            </h2>
            <MasonryLayout
              defaultCols={1}
              smCols={1}
              mdCols={1}
              lgCols={2}
              xlCols={2}
              className="flex"
              columnClassName="bg-clip-padding lg:odd:mr-12"
            >
              {[...starterSets].map((set, index1) => (
                <SetBoard
                  key={index1}
                  id=""
                  dontShowAll
                  className="mb-10 w-full md:mb-12 lg:w-96"
                  set={{
                    name: set.name,
                    utensils: set.utensils,
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
                        shuffle(
                          set.utensils.map((utensil) =>
                            utensil.title !== "????????"
                              ? utensil.title
                              : randomElement(
                                  randomElement(
                                    [...starterSets].filter(
                                      (s) => s.name !== "Random mix",
                                    ),
                                  ).utensils,
                                ).title,
                          ),
                        ).join("\n"),
                      );
                    }
                  }}
                />
              ))}
            </MasonryLayout>
          </div>
        </div>
      </div>
    </>
  );
}
