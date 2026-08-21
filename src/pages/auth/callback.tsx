import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Ranking, Set } from "@/types";
import { generateRankingID, generateSetID } from "@/lib/utilities";
import {
  fetchCurrentProfile,
  insertUserRankings,
  updateCurrentOwnedRankings,
  updateCurrentOwnedSets,
} from "@/db";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // once user logs in, if there are rankings/sets stored locally, they are moved to supabase
        if (session) {
          const localRankings: Ranking[] = JSON.parse(
            localStorage.getItem("savedRankings") ?? "[]",
          );
          const localSets: Set[] = JSON.parse(
            localStorage.getItem("savedSets") ?? "[]",
          );

          const correctedLocalRankings: Ranking[] = Array.isArray(localRankings)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              localRankings.map((r: any) => ({
                ...r,
                // use new format instead of legacy one
                name: r.name ?? r.rankingName,
                createdAt:
                  r.createdAt ??
                  new Date(
                    `${r.rankingDate.month} ${r.rankingDate.day} ${r.rankingDate.year}`,
                  ),
                type: r.type ?? r.rankingType,
                combos: r.combos ?? r.rankingCombos,
                winnersHistory: r.winnersHistory ?? r.rankingWinnersHistory,
              }))
            : [];

          // if there are rankings or sets saved in local storage, move them to database
          if (correctedLocalRankings.length > 0 || localSets.length > 0) {
            // get data from profile of current user
            const result = await fetchCurrentProfile();
            const profileData = result?.profileData;

            // insert each ranking from local storage into supabase
            for (const ranking of correctedLocalRankings) {
              const newRankingID = generateRankingID();
              const rankingID =
                !ranking.id || ranking.id === -1 ? newRankingID : ranking.id;

              await insertUserRankings([
                {
                  id: rankingID,
                  name: ranking.name ?? "New ranking",
                  created_at: ranking.createdAt,
                  ranked_utensils: ranking.rankedUtensils,
                  type: ranking.type,
                  combos: ranking.combos,
                  winners_history: ranking.winnersHistory,
                  associated_set_id: ranking.associatedSetID,
                  user_id: session.user.id,
                  username: profileData?.username,
                },
              ]);

              await updateCurrentOwnedRankings(rankingID, profileData);
            }

            // insert each set from local storage into supabase
            for (const set of localSets) {
              const newSetID = generateSetID();
              const setID = !set.id || set.id === -1 ? newSetID : set.id;

              await insertUserRankings([
                {
                  id: setID,
                  name: set.name ?? "New set",
                  created_at: set.createdAt,
                  utensils: set.utensils,
                  user_id: session.user.id,
                  username: profileData?.username,
                },
              ]);

              await updateCurrentOwnedSets(setID, profileData);
            }

            localStorage.removeItem("savedRankings");
            localStorage.removeItem("savedSets");
          }

          //router.replace("/profile/account");
        }
      },
    );

    // redirect to create page if the user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/profile/account");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="section text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
        Logging you in...
      </h2>
    </div>
  );
}
