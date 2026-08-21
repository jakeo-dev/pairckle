import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import RankingBoard from "@/components/RankingBoard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, Ranking } from "@/types";
import { fetchCurrentProfile, fetchOwnedUserRankings } from "@/db";

import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function YourRankings() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [ownedRankings, setOwnedRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // if not logged in, set stuff to local storage & stop here
      if (!session) {
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
        const rankingsArray: Ranking[] = Array.isArray(savedRankingsArray)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            savedRankingsArray.map((r: any) => ({
              ...r,
              // use new format instead of legacy one
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

      // get user
      const user = session.user;

      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }

      // get rankings that are owned by current user
      const currentUserRankingsData = await fetchOwnedUserRankings(user.id);
      setOwnedRankings(currentUserRankingsData ? currentUserRankingsData : []);

      setLoading(false);
    }

    getProfile();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          {!loading && (
            <Heading
              icon={faUser}
              title={profile ? profile?.username : "Profile"}
              tabs={[
                { title: "Rankings", href: "/profile/rankings", active: true },
                {
                  title: "Sets",
                  href: "/profile/sets",
                },
                {
                  title: "Account",
                  href: "/profile/account",
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
