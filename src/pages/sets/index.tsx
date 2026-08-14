import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import MasonryLayout from "@/components/MasonryLayout";
import SetBoard from "@/components/SetBoard";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import { shuffle } from "@/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/sets";
import { useEffect, useState } from "react";
import { Ranking, Set } from "@/types";

import { supabase } from "../../utils/supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartSimple,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Sets() {
  const [starterSets, setStarterSets] = useState<Set[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<Set[]>([]);
  const [discoverableRankings, setDiscoverableRankings] = useState<Ranking[]>(
    [],
  );

  const [selectedView, setSelectedView] = useState<"rankings" | "sets">(
    "rankings",
  );

  useEffect(() => {
    async function getDiscoverableStuff() {
      const { data: userSetsData, error: userSetsError } = await supabase
        .from("user_sets")
        .select()
        .eq("discoverable", true);
      const correctedUserSets = userSetsData?.map((set) => {
        return {
          ...set,
          createdAt: set.created_at,
          userID: set.user_id,
        };
      });
      if (userSetsError) console.error("error:", userSetsError);

      const { data: userRankingsData, error: userRankingsError } =
        await supabase.from("user_rankings").select().eq("discoverable", true);
      if (userRankingsError) console.error("error:", userRankingsError);
      // convert snake case from database to camel case
      const correctedUserRankings = userRankingsData?.map((ranking) => {
        return {
          ...ranking,
          createdAt: ranking.created_at,
          rankedUtensils: ranking.ranked_utensils,
          winnersHistory: ranking.winners_history,
          userID: ranking.user_id,
        };
      });

      if (correctedUserSets) {
        setDiscoverableSets(correctedUserSets.toReversed());
      }
      if (correctedUserRankings) {
        setDiscoverableRankings(correctedUserRankings.toReversed());
      }
    }

    getDiscoverableStuff();
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

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          <Heading icon={faGlobe} text="Community" />

          <div
            className={`section mb-8 flex items-end justify-center md:mb-10 md:justify-start ${gabarito.className}`}
          >
            <button
              onClick={() => {
                setSelectedView("rankings");
              }}
              className={`group line-clamp-1 break-all border-b-2 px-3 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "rankings" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 text-neutral-500 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className={`mr-2 rotate-90 md:mr-2.5 ${selectedView === "rankings" ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`}
              />
              <span>Rankings</span>
            </button>
            <button
              onClick={() => {
                setSelectedView("sets");
              }}
              className={`group line-clamp-1 break-all border-b-2 px-3 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "sets" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 text-neutral-500 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
            >
              <FontAwesomeIcon
                icon={faBarsStaggered}
                className={`mr-2 md:mr-2.5 ${selectedView === "sets" ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`}
              />
              <span>Sets</span>
            </button>
          </div>

          {selectedView === "sets" ? (
            <>
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
                      showSeeSetButton
                      className="mb-10 flex-1 md:mb-12"
                      set={{
                        id: set.id,
                        name: set.name,
                        utensils: shuffle(set.utensils),
                        username: set.username,
                        createdAt: set.createdAt,
                      }}
                    />
                  ))}
                </MasonryLayout>
              ) : (
                <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                  Loading community sets...
                </h2>
              )}
              <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

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
                    showSeeSetButton
                    className="mb-10 md:mb-12"
                    set={{
                      id: set.id,
                      name: set.name,
                      utensils: shuffle(set.utensils),
                    }}
                  />
                ))}
              </MasonryLayout>
            </>
          ) : (
            <>
              {discoverableRankings.length > 0 ? (
                <div className="section">
                  {[...discoverableRankings].map((ranking, index1) => (
                    <RankingBoard
                      key={index1}
                      index1={index1}
                      showSeeRankingButton
                      className="mb-10 flex-1 md:mb-12"
                      ranking={{
                        id: ranking.id,
                        name: ranking.name,
                        rankedUtensils: ranking.rankedUtensils,
                        username: ranking.username,
                        createdAt: ranking.createdAt,
                        type: ranking.type,
                        combos: ranking.combos,
                        winnersHistory: ranking.winnersHistory,
                        userID: ranking.userID,
                      }}
                      savedRankings={discoverableRankings}
                    />
                  ))}
                </div>
              ) : (
                <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                  Loading community rankings...
                </h2>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
