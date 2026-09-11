import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import SetBoard from "@/components/SetBoard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Profile, UtensilSet } from "@/types";
import {
  fetchCurrentProfile,
  fetchOwnedUserSets,
  fetchUserProfile,
} from "@/db";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";

export default function UserSets() {
  const router = useRouter();
  const { id: username } = router.query;

  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const [ownedSets, setOwnedSets] = useState<UtensilSet[]>([]);

  useEffect(() => {
    async function getProfile() {
      // if not logged in, set stuff to local storage & stop here
      if (String(username) === "guest") {
        setSelectedProfile({
          id: "",
          username: "Guest",
          createdAt: "",
        });

        setOwnedSets(JSON.parse(localStorage.getItem("savedSets") ?? "[]"));

        setLoading(false);

        return;
      }

      const selectedProfileData = await fetchUserProfile(String(username));
      setSelectedProfile(selectedProfileData);

      // get sets that are owned by current user
      const currentUserSetsData = await fetchOwnedUserSets(
        selectedProfileData.id,
      );
      setOwnedSets(currentUserSetsData ? currentUserSetsData : []);

      const currentProfileData = await fetchCurrentProfile();
      setCurrentProfile(currentProfileData?.profileData);

      setLoading(false);
    }

    getProfile();
  }, [username]);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.1vh]">
          {!loading && (
            <Heading
              icon={
                selectedProfile && selectedProfile.username !== "Guest"
                  ? faUser
                  : faUserRegular
              }
              title={selectedProfile ? selectedProfile?.username : "Guest"}
              tabs={[
                {
                  title: "Rankings",
                  href: `/user/${username}/rankings`,
                },
                {
                  title: "Sets",
                  href: `/user/${username}/sets`,
                  active: true,
                },
                ...(String(username) === "guest" ||
                currentProfile?.id === selectedProfile?.id
                  ? [
                      {
                        title: "Account",
                        href: `/user/${username}/account`,
                      },
                    ]
                  : []),
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
                            id:
                              selectedProfile &&
                              selectedProfile.username !== "Guest"
                                ? set.id
                                : -1,
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
                {selectedProfile?.username === "Guest" && (
                  <div className="section">
                    <h2 className="mt-10 text-center text-sm text-pretty text-neutral-600 md:mt-12 md:text-base dark:text-neutral-400">
                      Log in to see your rankings, publish them, and access your
                      account anywhere.
                    </h2>
                    <Link
                      href="/login"
                      className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-md bg-neutral-400/20 p-2 transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:mt-3 md:p-3 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                    >
                      <FontAwesomeIcon
                        icon={faArrowRightToBracket}
                        className="mr-2 text-sm text-neutral-600/50 md:mr-2.5 md:text-base dark:text-neutral-400/50"
                        aria-hidden
                      />
                      <span className="text-sm md:text-base">Log in</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
