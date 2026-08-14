import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { Profile, Ranking, Set } from "@/types";
import { randomNumber } from "@/utilities";

export default function AuthCallback() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

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
            ? localRankings.map((r: any) => ({
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
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("username, created_at, owned_rankings, owned_sets")
              .eq("id", session.user.id)
              .single();
            // convert snake case from database to camel case
            const { created_at, owned_rankings, owned_sets, ...rest } =
              profileData || {};
            const correctedProfileData = {
              ...rest,
              createdAt: created_at,
              ownedRankings: owned_rankings,
              ownedSets: owned_sets,
            };
            // print error if supabase throws error getting profile
            if (profileError && profileError.code !== "PGRST116") {
              console.error("error:", profileError);
            } else {
              setProfile(correctedProfileData as Profile);
            }

            // insert each ranking from local storage into supabase
            for (const ranking of correctedLocalRankings) {
              const newRankingID = randomNumber(100000000000, 999999999999);
              const rankingID =
                !ranking.id || ranking.id === -1 ? newRankingID : ranking.id;

              const { error: userRankingsError } = await supabase
                .from("user_rankings")
                .insert([
                  {
                    id: rankingID,
                    name: ranking.name ?? "New ranking",
                    created_at: ranking.createdAt,
                    ranked_utensils: ranking.rankedUtensils,
                    type: ranking.type,
                    combos: ranking.combos,
                    winners_history: ranking.winnersHistory,
                    user_id: session.user.id,
                    username: correctedProfileData?.username,
                  },
                ])
                .select();
              if (userRankingsError) console.error(userRankingsError);

              await supabase
                .from("profiles")
                .update({
                  owned_rankings:
                    // add new ranking ID to owned_rankings array
                    [rankingID, ...profileData?.owned_rankings],
                })
                .eq("id", session.user.id);
            }

            // insert each set from local storage into supabase
            for (const set of localSets) {
              const newSetID =
                set.name
                  ?.replaceAll(/[^\w]/gi, " ")
                  .replaceAll(/\s+/gi, " ")
                  .trim()
                  .toLowerCase()
                  .split(" ")
                  .slice(0, 3)
                  .join("-") +
                "-" +
                randomNumber(10000000, 99999999);
              const setID = !set.id || set.id === "" ? newSetID : set.id;

              const { error: userSetsError } = await supabase
                .from("user_sets")
                .insert([
                  {
                    id: setID,
                    name: set.name ?? "New set",
                    created_at: set.createdAt,
                    utensils: set.utensils,
                    user_id: session.user.id,
                    username: correctedProfileData?.username,
                  },
                ])
                .select();
              if (userSetsError) console.error(userSetsError);

              await supabase
                .from("profiles")
                .update({
                  owned_sets:
                    // add new set ID to owned_sets array
                    [
                      !set.id || set.id === "" ? setID : set.id,
                      ...profileData?.owned_sets,
                    ],
                })
                .eq("id", session.user.id);
            }

            localStorage.removeItem("savedRankings");
            localStorage.removeItem("savedSets");
          }

          //router.replace("/profile");
        }
      },
    );

    // redirect to create page if the user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/create");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Logging you in...
      </p>
    </div>
  );
}
