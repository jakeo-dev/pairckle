import CommonHead from "@/components/CommonHead";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import Link from "next/link";
import { shuffle } from "@/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/sets";
import { useEffect, useState } from "react";
import { Set } from "@/types";

import { supabase } from "@/utils/supabase";

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

  useEffect(() => {
    async function getDiscoverableStuff() {
      const { data: userSetsData, error: userSetsError } = await supabase
        .from("user_sets")
        .select()
        .eq("discoverable", true);
      if (userSetsError) console.error("error:", userSetsError);
      // convert snake case from database to camel case
      const correctedUserSets = userSetsData?.map((set) => {
        return {
          ...set,
          createdAt: set.created_at,
          userID: set.user_id,
        };
      });

      if (correctedUserSets) {
        setDiscoverableSets(correctedUserSets.toReversed());
      }
    }

    getDiscoverableStuff();
  }, []);

  useEffect(() => {
    setStarterSets(shuffle(STARTER_SETS).toSpliced(1, 0, RANDOM_SET));
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
            <Link
              href="/rankings"
              className="group line-clamp-1 break-all border-b-2 border-neutral-500/20 px-3 pb-1 text-sm font-medium leading-6 text-neutral-500 transition hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30 md:px-6 md:pb-3 md:text-lg"
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="mr-2 rotate-90 text-neutral-400 dark:text-neutral-600 md:mr-2.5"
              />
              <span>Rankings</span>
            </Link>
            <button className="group line-clamp-1 break-all border-b-2 border-neutral-500/50 px-3 pb-1 text-sm font-medium leading-6 transition dark:border-neutral-400/50 md:px-6 md:pb-3 md:text-lg">
              <FontAwesomeIcon
                icon={faBarsStaggered}
                className="mr-2 text-neutral-500 dark:text-neutral-400 md:mr-2.5"
              />
              <span>Sets</span>
            </button>
          </div>

          {discoverableSets.length > 0 ? (
            <div className="wide-section grid grid-cols-3 gap-4">
              {[...discoverableSets].map((set, index1) => (
                <SetBoard
                  key={index1}
                  miniView
                  set={{
                    id: set.id,
                    name: set.name,
                    utensils: shuffle(set.utensils),
                    username: set.username,
                    createdAt: set.createdAt,
                  }}
                />
              ))}
            </div>
          ) : (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading community sets...
            </h2>
          )}
          <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

          <div className="wide-section grid grid-cols-3 gap-4">
            {[...starterSets].map((set, index1) => (
              <SetBoard
                key={index1}
                miniView
                set={{
                  id: set.id,
                  name: set.name,
                  utensils: shuffle(set.utensils),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
