import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import MasonryLayout from "@/components/MasonryLayout";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import { shuffle } from "@/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/sets";
import { useEffect, useState } from "react";
import { Set } from "@/types";

import { supabase } from "../../utils/supabase";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<Set[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<Set[]>([]);

  useEffect(() => {
    async function getDiscoverableSets() {
      const { data: sharedSets } = await supabase
        .from("shared_sets")
        .select()
        .eq("discoverable", true);
      const newSharedSets = sharedSets?.map((set) => {
        return {
          ...set,
          sharedAt: set.shared_at,
        };
      });

      if (newSharedSets) {
        setDiscoverableSets(newSharedSets.toReversed());
      }
    }

    getDiscoverableSets();
  }, []);

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    setStarterSets(shuffle(STARTER_SETS).toSpliced(1, 0, RANDOM_SET));
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

      <div className="flex min-h-screen w-full items-center justify-center pb-16 lg:min-h-[94.6vh]">
        <div className="w-full">
          <Heading icon={faGlobe} text="Community sets" />

          {discoverableSets.length > 0 ? (
            <MasonryLayout
              defaultCols={1}
              smCols={1}
              mdCols={1}
              lgCols={2}
              xlCols={2}
              className="section flex"
              columnClassName="bg-clip-padding lg:odd:mr-12"
            >
              {[...discoverableSets].map((set, index1) => (
                <SetBoard
                  key={index1}
                  id={set.id}
                  showSeeSetButton
                  className="mb-10 md:mb-12"
                  set={{
                    id: set.id,
                    name: set.name,
                    utensils: shuffle(set.utensils),
                    username: set.username,
                    sharedAt: set.sharedAt,
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
                          shuffle(
                            set.utensils.map((utensil) => utensil.title),
                          ).join("\n"),
                        );
                      }
                    }} */
                />
              ))}
            </MasonryLayout>
          ) : (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading community sets...
            </h2>
          )}

          <div className="mb-10 flex w-full items-center border-b-2 border-neutral-400/30 md:mb-12" />

          <MasonryLayout
            defaultCols={1}
            smCols={1}
            mdCols={1}
            lgCols={2}
            xlCols={2}
            className="section flex"
            columnClassName="bg-clip-padding lg:odd:mr-12"
          >
            {[...starterSets].map((set, index1) => (
              <SetBoard
                key={index1}
                id={set.id}
                showSeeSetButton
                className="mb-10 md:mb-12"
                set={{
                  id: set.id,
                  name: set.name,
                  utensils: shuffle(set.utensils),
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
                  }} */
              />
            ))}
          </MasonryLayout>
        </div>
      </div>
    </>
  );
}
