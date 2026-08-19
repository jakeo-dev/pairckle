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
        setDiscoverableRankings(userRankingsData);
      }
    }

    getDiscoverableRankings();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          <Heading
            icon={faGlobe}
            text="Community"
            tabs={[
              { title: "Rankings", href: "/rankings", active: true },
              {
                title: "Sets",
                href: "/sets",
              },
            ]}
          />

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
                    associatedSetID: ranking.associatedSetID,
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
