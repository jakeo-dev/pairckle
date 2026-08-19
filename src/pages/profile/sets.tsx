import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import SetBoard from "@/components/SetBoard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, Set } from "@/types";
import { fetchCurrentProfile, fetchOwnedUserSets } from "@/db";

import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function YourSets() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [ownedSets, setOwnedSets] = useState<Set[]>([]);

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

        setOwnedSets(JSON.parse(localStorage.getItem("savedSets") ?? "[]"));

        setLoading(false);

        return;
      }

      // get user
      const user = session.user;

      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }

      // get sets that are owned by current user
      const currentUserSetsData = await fetchOwnedUserSets(user.id);
      setOwnedSets(currentUserSetsData ? currentUserSetsData : []);

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
              text={profile ? profile?.username : "Profile"}
              tabs={[
                { title: "Rankings", href: "/profile/rankings" },
                {
                  title: "Sets",
                  href: "/profile/sets",
                  active: true,
                },
                {
                  title: "Account",
                  href: "/profile/account",
                },
              ]}
            />
          )}

          {loading ? (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading user data...
            </h2>
          ) : (
            <div>
              <div>
                {ownedSets && ownedSets.length > 0 ? (
                  <div className="wide-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...ownedSets].map((set, i) => {
                      return (
                        <SetBoard
                          key={i}
                          miniView
                          set={{
                            id: set.id,
                            name: set.name,
                            createdAt: set.createdAt,
                            utensils: set.utensils,
                            discoverable: set.discoverable,
                            userID: set.userID,
                            username: set.username,
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                    {`You haven't created any sets yet...`}
                  </h2>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
