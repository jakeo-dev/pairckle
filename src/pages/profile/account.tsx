import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";
import { fetchCurrentProfile } from "@/db";

import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function YourAccount() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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

        setLoading(false);

        return;
      }

      // get user
      const user = session.user;
      setEmail(user.email ?? null);

      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }

      setLoading(false);
    }

    getProfile();
  }, []);

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
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          {!loading && (
            <Heading
              icon={faUser}
              title={profile ? profile?.username : "Profile"}
              tabs={[
                { title: "Rankings", href: "/profile/rankings" },
                {
                  title: "Sets",
                  href: "/profile/sets",
                },
                {
                  title: "Account",
                  href: "/profile/account",
                  active: true,
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
                {profile?.username !== "Profile" ? (
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
                          {profile?.username}
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
                          {profile?.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
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
                    <h2 className="text-center text-xl text-pretty text-neutral-600 md:text-2xl dark:text-neutral-400">
                      Sign up or log in to publish your rankings and access your
                      account anywhere.
                    </h2>
                    <Link
                      href="/login"
                      className="mt-10 block w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-center text-sm transition hover:border-transparent hover:bg-neutral-500 hover:text-neutral-50 active:bg-neutral-600 md:mt-12 md:text-base dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
                    >
                      Log in
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
