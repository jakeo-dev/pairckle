import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import RankingBoard from "@/components/RankingBoard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, Ranking } from "@/types";
import {
  fetchOwnedUserRankings,
  fetchUserIDFromUsername,
  fetchUserProfile,
} from "@/db";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export default function UserRankings() {
  const router = useRouter();
  const { id: username } = router.query;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [ownedRankings, setOwnedRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    async function getProfile() {
      // if not logged in, set stuff to local storage & stop here
      if (String(username) === "guest") {
        console.log("here 4");
        setProfile({
          id: "",
          username: "Profile",
          createdAt: "",
          ownedRankings: [],
          ownedSets: [],
        });

        const savedRankingsArray = JSON.parse(
          localStorage.getItem("savedRankings") ?? "[]",
        );

        // correct rankings to use new format instead of legacy one
        const rankingsArray: Ranking[] = Array.isArray(savedRankingsArray)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            savedRankingsArray.map((r: any) => ({
              ...r,
              name: r.name ?? r.rankingName,
              createdAt:
                r.createdAt ??
                (r.rankingDate
                  ? new Date(
                      r.rankingDate.year,
                      r.rankingDate.month - 1,
                      r.rankingDate.day,
                    ).toISOString()
                  : new Date().toISOString()),
              type: r.type ?? r.rankingType,
              combos: r.combos ?? r.rankingCombos,
              winnersHistory: r.winnersHistory ?? r.rankingWinnersHistory,
            }))
          : [];
        setOwnedRankings(rankingsArray);

        setLoading(false);

        return;
      }

      const result = await fetchUserProfile(String(username));
      console.log("RESULT: ", result);

      if (result?.profileData) {
        setProfile(result?.profileData);
        console.log("PROFILE DATA: ", result?.profileData);
      }

      // get rankings that are owned by current user
      const userID = await fetchUserIDFromUsername(String(username));
      console.log("USER ID: ", userID);
      const currentUserRankingsData = await fetchOwnedUserRankings(userID);
      console.log("RANKINGS: ", currentUserRankingsData);
      setOwnedRankings(currentUserRankingsData ? currentUserRankingsData : []);

      setLoading(false);
    }

    getProfile();
  }, [router.isReady, username]);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.1vh]">
          {!loading && (
            <Heading
              icon={faUser}
              title={profile ? profile?.username : "Profile"}
              tabs={[
                {
                  title: "Rankings",
                  href: `/user/${username}/rankings`,
                  active: true,
                },
                {
                  title: "Sets",
                  href: `/user/${username}/sets`,
                },
                {
                  title: "Account",
                  href: `/user/${username}/account`,
                },
              ]}
            />
          )}

          {loading ? (
            <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              Loading user data...
            </h2>
          ) : (
            <div>
              {ownedRankings && ownedRankings.length > 0 ? (
                <div className="wide-section grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {[...ownedRankings].map((ranking, i) => {
                    return (
                      <RankingBoard
                        key={i}
                        miniView
                        ranking={ranking}
                        index1={i}
                        savedRankings={ownedRankings}
                      />
                    );
                  })}
                </div>
              ) : (
                <h2 className="section text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
                  {`You haven't created any rankings yet...`}
                </h2>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
