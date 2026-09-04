import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Ranking, RankingData, Set, SetData } from "@/types";
import { generateRankingID, generateSetID } from "@/lib/utilities";
import {
  bulkUpdateCurrentOwnedRankings,
  bulkUpdateCurrentOwnedSets,
  fetchCurrentProfile,
  insertUserRankings,
  insertUserSets,
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

          // correct rankings to use new format instead of legacy one
          const correctedLocalRankings: Ranking[] = Array.isArray(localRankings)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              localRankings.map((r: any) => ({
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

          // if there are rankings or sets saved in local storage, move them to database
          if (correctedLocalRankings.length > 0 || localSets.length > 0) {
            // get data from profile of current user
            const result = await fetchCurrentProfile();
            const profileData = result?.profileData;

            const rankingIDs: number[] = [];
            const rankingsToInsert: RankingData[] = [];

            // insert each ranking from local storage into supabase
            for (const ranking of correctedLocalRankings) {
              const rankingID =
                !ranking.id || ranking.id === -1
                  ? generateRankingID()
                  : ranking.id;
              rankingIDs.push(rankingID);

              rankingsToInsert.push({
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
              });
            }

            await insertUserRankings(rankingsToInsert);
            await bulkUpdateCurrentOwnedRankings(rankingIDs, profileData);

            const setIDs: number[] = [];
            const setsToInsert: SetData[] = [];

            // insert each set from local storage into supabase
            for (const set of localSets) {
              const setID = !set.id || set.id === -1 ? generateSetID() : set.id;
              setIDs.push(setID);

              setsToInsert.push({
                id: setID,
                name: set.name ?? "New set",
                created_at: set.createdAt,
                utensils: set.utensils,
                user_id: session.user.id,
                username: profileData?.username,
              });
            }

            await insertUserSets(setsToInsert);
            await bulkUpdateCurrentOwnedSets(setIDs, profileData);

            localStorage.removeItem("savedRankings");
            localStorage.removeItem("savedSets");
          }

          //router.replace("/");
        }
      },
    );

    // redirect to create page if the user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h2 className="section text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
        Logging you in...
      </h2>
    </div>
  );
}
