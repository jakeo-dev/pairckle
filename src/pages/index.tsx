import CommonHead from "@/components/CommonHead";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import SetBoard from "@/components/SetBoard";
import Link from "next/link";
import { Ranking, Set } from "@/types";
import { useEffect, useState } from "react";
import { fetchDiscoverableUserRankings, fetchDiscoverableUserSets } from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  /* const [starterSets, setStarterSets] = useState<Set[]>([]); */
  const [discoverableSets, setDiscoverableSets] = useState<Set[]>([]);
  const [discoverableRankings, setDiscoverableRankings] = useState<Ranking[]>(
    [],
  );

  useEffect(() => {
    async function getDiscoverableStuff() {
      const userSetsData = await fetchDiscoverableUserSets();
      const userRankingsData = await fetchDiscoverableUserRankings();

      if (userSetsData) {
        setDiscoverableSets(userSetsData);
      }
      if (userRankingsData) {
        setDiscoverableRankings(userRankingsData);
      }
    }

    getDiscoverableStuff();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          <Heading
            rotateIcon
            title="Rank your favorite things \neasily, accurately, and pairwisely."
            subtitle="Choose a set or create your own to begin ranking - or discover rankings from other users."
            className="mx-auto text-center"
            childrenDivClassName="hidden"
            subtextClassName="mt-4 text-pretty"
          />

          <>
            {/* recent sets shown on home page */}
            {discoverableSets.length > 0 ? (
              <div className="wide-section w-full">
                <Link
                  className="group mb-6 flex w-fit items-center px-4 transition hover:text-neutral-600 md:px-6 dark:hover:text-neutral-300"
                  href="/sets"
                >
                  <h2
                    className={`text-xl font-semibold md:text-2xl ${gabarito.className}`}
                  >
                    Recent sets
                  </h2>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="ml-3 transition group-hover:translate-x-1"
                  />
                </Link>
                <div className="fade-edges-sides flex gap-2 overflow-x-scroll px-2 md:gap-4 md:px-4">
                  {[...discoverableSets].map((set, index1) => (
                    <SetBoard
                      key={index1}
                      miniView
                      set={{
                        id: set.id,
                        name: set.name,
                        utensils: set.utensils,
                        username: set.username,
                        createdAt: set.createdAt,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
                Loading community sets...
              </h2>
            )}

            {/* <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

            <div className="wide-section">
              <h2
                  className={`mb-4 text-lg font-semibold md:text-xl ${gabarito.className}`}
                >
                  Pre-made sets
              </h2>
              <div className="flex gap-2 md:gap-4 overflow-x-scroll">
                {[...starterSets].map((set, index1) => (
                  <SetBoard
                    key={index1}
                    showSeeSetButton
                    className="mb-10 md:mb-12"
                    set={{
                      id: set.id,
                      name: set.name,
                      utensils: set.utensils,
                    }}
                  />
                ))}
              </div>
            </div> */}
          </>

          <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

          {/* recent rankings shown on home page */}
          {discoverableRankings.length > 0 ? (
            <div className="wide-section">
              <Link
                className="group mb-6 flex w-fit items-center px-4 transition hover:text-neutral-600 md:px-6 dark:hover:text-neutral-300"
                href="/rankings"
              >
                <h2
                  className={`text-xl font-semibold md:text-2xl ${gabarito.className}`}
                >
                  Recent rankings
                </h2>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-3 transition group-hover:translate-x-1"
                />
              </Link>
              <div className="fade-edges-sides flex gap-2 overflow-x-scroll px-2 md:gap-4 md:px-4">
                {[...discoverableRankings].map((ranking, index1) => (
                  <RankingBoard
                    key={index1}
                    index1={index1}
                    miniView
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
                      associatedSetID: ranking.associatedSetID,
                    }}
                    savedRankings={discoverableRankings}
                  />
                ))}
              </div>
            </div>
          ) : (
            <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              Loading community rankings...
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
