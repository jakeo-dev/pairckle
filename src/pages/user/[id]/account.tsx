import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";
import { fetchCurrentProfile, fetchUserProfile } from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function UserAccount() {
  const router = useRouter();
  const { id: username } = router.query;

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // if not logged in, set stuff to local storage & stop here
      if (!session) {
        setSelectedProfile({
          id: "",
          username: "Profile",
          createdAt: "",
          ownedRankings: [],
          ownedSets: [],
        });

        setLoading(false);

        return;
      }

      // get user
      const user = session.user;
      setEmail(user.email ?? null);

      const selectedProfileData = await fetchUserProfile(String(username));
      setSelectedProfile(selectedProfileData);

      const currentProfileData = await fetchCurrentProfile();
      setCurrentProfile(currentProfileData?.profileData);

      setLoading(false);
    }

    getProfile();
  }, [username]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const [confirmSignOutModalVisibility, setConfirmSignOutModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      <CommonHead />

      {/* confirm log out modal */}
      <ConfirmModal
        visibility={confirmSignOutModalVisibility}
        titleText="Are you sure you want to log out?"
        subtitleText="You can always log back in; your saved rankings and sets won't be lost."
        primaryButtonText="Log out"
        secondaryButtonText="Cancel"
        onConfirm={() => {
          handleSignOut();

          setConfirmSignOutModalVisibility(false);
        }}
        onCancel={() => {
          setConfirmSignOutModalVisibility(false);
        }}
      />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.1vh]">
          {!loading && (
            <Heading
              icon={faUser}
              title={selectedProfile ? selectedProfile?.username : "Profile"}
              tabs={[
                {
                  title: "Rankings",
                  href: `/user/${username}/rankings`,
                },
                {
                  title: "Sets",
                  href: `/user/${username}/sets`,
                },
                ...(String(username) === "guest" ||
                currentProfile?.id === selectedProfile?.id
                  ? [
                      {
                        title: "Account",
                        href: `/user/${username}/account`,
                        active: true,
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
                {selectedProfile?.username !== "Profile" ? (
                  <div className="section">
                    {/* <div className="mb-0.5 flex items-end px-2 md:mb-1">
                        <h2
                          className={`line-clamp-1 break-all text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
                        >
                          Account details
                        </h2>
                      </div> */}

                    <div className="w-full rounded-lg border-2 border-neutral-400/25 px-4 py-3 text-neutral-700 md:px-5 md:py-4 dark:text-neutral-300">
                      <div>
                        <label className="text-xs text-neutral-500 md:text-sm">
                          Username
                        </label>
                        <p className="text-sm font-medium md:text-base">
                          {selectedProfile?.username}
                        </p>
                      </div>

                      <div className="mt-3 md:mt-4">
                        <label className="text-xs text-neutral-500 md:text-sm">
                          Email
                        </label>
                        <p className="text-sm font-medium md:text-base">
                          {email}
                        </p>
                      </div>

                      <div className="mt-3 md:mt-4">
                        <label className="text-xs text-neutral-500 md:text-sm">
                          Pairckler since
                        </label>
                        <p className="text-sm font-medium md:text-base">
                          {selectedProfile?.createdAt
                            ? new Date(
                                selectedProfile.createdAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setConfirmSignOutModalVisibility(true);
                      }}
                      className="mt-4 w-full cursor-pointer rounded-full border-2 border-neutral-400 px-4 py-2 text-sm transition hover:border-transparent hover:bg-red-500 hover:text-neutral-50 active:bg-red-600 md:mt-6 md:text-base dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="section">
                    <h2 className="mt-10 text-center text-sm text-neutral-600 md:mt-12 md:text-base dark:text-neutral-400">
                      Sign up or log in to publish your rankings and access your
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
