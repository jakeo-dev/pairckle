import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { Profile } from "@/types";

export default function Account() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const user = session.user;
      setEmail(user.email ?? null);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, created_at")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data);
      } else {
        setProfile({
          username: user.user_metadata?.username || "[no username]",
          created_at: user.created_at,
        });
      }

      setLoading(false);
    }

    getProfile();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/signin");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="mt-48">
      {!profile ? (
        <>
          <p>not signed in</p>
        </>
      ) : (
        <div className="mx-auto max-w-md p-6">
          <h1 className="mb-6 text-2xl font-bold">Account</h1>

          <div className="space-y-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
            <div>
              <label className="text-xs text-neutral-500">Email</label>
              <p className="font-medium">{email}</p>
            </div>

            <div>
              <label className="text-xs text-neutral-500">Username</label>
              <p className="font-medium">{profile?.username}</p>
            </div>

            <div>
              <label className="text-xs text-neutral-500">
                Pairckler since
              </label>
              <p className="font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-6 w-full rounded-full bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
