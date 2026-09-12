import CommonHead from "@/components/CommonHead";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import { RANDOM_SET, STARTER_SETS } from "@/constants/sets";
import { useEffect, useState } from "react";
import { UtensilSet } from "@/types";
import { shuffle } from "@/lib/utilities";
import { fetchDiscoverableUserSets } from "@/db";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Sets() {
  const [starterSets, setStarterSets] = useState<UtensilSet[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<UtensilSet[]>([]);

  useEffect(() => {
    async function getDiscoverableSets() {
      const userSetsData = await fetchDiscoverableUserSets({ limit: 50 });

      if (userSetsData) {
        setDiscoverableSets(userSetsData);
      }
    }

    getDiscoverableSets();

    setStarterSets(shuffle(STARTER_SETS).toSpliced(1, 0, RANDOM_SET));
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.1vh]">
          <Heading
            icon={faGlobe}
            title="Community"
            tabs={[
              { title: "Rankings", href: "/rankings" },
              {
                title: "Sets",
                href: "/sets",
                active: true,
              },
            ]}
          />

          {discoverableSets.length > 0 ? (
            <div className="wide-section grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
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
          ) : (
            <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              Loading community sets...
            </h2>
          )}

          <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

          <div className="wide-section grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[...starterSets].map((set, index1) => (
              <SetBoard
                key={index1}
                miniView
                set={{
                  id: set.id,
                  name: set.name,
                  utensils: set.utensils,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
