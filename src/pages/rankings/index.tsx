import CommonHead from "@/components/CommonHead";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Ranking } from "@/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartSimple,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
import { fetchDiscoverableUserRankings } from "@/db";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Rankings() {
  const [discoverableRankings, setDiscoverableRankings] = useState<Ranking[]>(
    [],
  );

  useEffect(() => {
    async function getDiscoverableRankings() {
      const userRankingsData = await fetchDiscoverableUserRankings();

      if (userRankingsData) {
        setDiscoverableRankings(userRankingsData.toReversed());
      }
    }

    getDiscoverableRankings();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          <Heading icon={faGlobe} text="Community" />

          <div
            className={`wide-section mb-8 flex items-end justify-center md:mb-10 ${gabarito.className}`}
          >
            <button className="group line-clamp-1 break-all border-b-2 border-neutral-500/50 px-3 pb-1 text-sm font-medium leading-6 transition dark:border-neutral-400/50 md:px-6 md:pb-3 md:text-lg">
              <FontAwesomeIcon
                icon={faChartSimple}
                className="mr-2 rotate-90 text-neutral-500 dark:text-neutral-400 md:mr-2.5"
              />
              <span>Rankings</span>
            </button>
            <Link
              href="/sets"
              className="group line-clamp-1 break-all border-b-2 border-neutral-500/20 px-3 pb-1 text-sm font-medium leading-6 text-neutral-500 transition hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30 md:px-6 md:pb-3 md:text-lg"
            >
              <FontAwesomeIcon
                icon={faBarsStaggered}
                className="mr-2 text-neutral-400 dark:text-neutral-600 md:mr-2.5"
              />
              <span>Sets</span>
            </Link>
          </div>

          {discoverableRankings.length > 0 ? (
            <div className="wide-section grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                    associatedSetID: ranking.associatedSetID
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
        </div>
      </div>
    </>
  );
}
