import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import SetBoard from "@/components/SetBoard";
import { useEffect, useState } from "react";
import { Profile, Set } from "@/types";
import {
  fetchOwnedUserSets,
  fetchUserIDFromUsername,
  fetchUserProfile,
} from "@/db";
import { useRouter } from "next/router";

import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UserSets() {
  const router = useRouter();
  const { id: username } = router.query;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [ownedSets, setOwnedSets] = useState<Set[]>([]);

  useEffect(() => {
    async function getProfile() {
      // if not logged in, set stuff to local storage & stop here
      if (String(username) === "guest") {
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

      const profileData = await fetchUserProfile(String(username));

      setProfile(profileData);

      // get sets that are owned by current user
      const currentUserSetsData = await fetchOwnedUserSets(profileData.id);
      setOwnedSets(currentUserSetsData ? currentUserSetsData : []);

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
                { title: "Rankings", href: `/user/${username}/rankings` },
                {
                  title: "Sets",
                  href: `/user/${username}/sets`,
                  active: true,
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
              <div>
                {ownedSets && ownedSets.length > 0 ? (
                  <div className="wide-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...ownedSets].map((set, i) => {
                      return (
                        <SetBoard
                          key={i}
                          miniView
                          set={{
                            id: profile ? set.id : -1,
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
                  <h2 className="section text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
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
