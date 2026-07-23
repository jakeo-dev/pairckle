import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import MasonryLayout from "@/components/MasonryLayout";
import SetBoard from "@/components/SetBoard";
import { randomElement, shuffle } from "@/utilities";
import { STARTER_SETS } from "@/constants";
import { useEffect, useState } from "react";
import { Set, SharedSetData } from "@/types";

import { supabase } from "../../utils/supabase";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<Set[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<SharedSetData[]>([]);

  useEffect(() => {
    async function getDiscoverableSets() {
      const { data: sharedSets } = await supabase.from("shared_sets").select();

      if (sharedSets) {
        const theseSets = sharedSets.filter((set) => set.public === true);

        setDiscoverableSets(theseSets);
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
              {[...discoverableSets].map((set, index1) => (
                <SetBoard
                  key={index1}
                  id=""
                  dontShowAll
                  className="mb-10 w-full md:mb-12 lg:w-96"
                  set={{
                    name: set.name,
                    utensils: set.utensils,
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
