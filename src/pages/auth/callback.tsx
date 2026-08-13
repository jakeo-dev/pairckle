import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { Ranking, Set } from "@/types";

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

          const { data: existingProfile, error: existingProfileError } =
            await supabase
              .from("profiles")
              .select("rankings, sets")
              .eq("id", session.user.id)
              .single();

          if (localRankings.length > 0 || localSets.length > 0) {
            await supabase
              .from("profiles")
              .update({
                rankings:
                // append local rankings to database rankings if there are already rankings saved in the database
                  existingProfile?.rankings.length > 0
                    ? [...localRankings, ...existingProfile?.rankings]
                    : localRankings,
                sets: localSets,
              })
              .eq("id", session.user.id);

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
