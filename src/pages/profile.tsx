import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import ConfirmModal from "@/components/ConfirmModal";
import RankingBoard from "@/components/RankingBoard";
import SetBoard from "@/components/SetBoard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";
import { Profile } from "@/types";
import { shuffle } from "@/utilities";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartSimple,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [selectedView, setSelectedView] = useState<
    "rankings" | "sets" | "account"
  >("rankings");

  useEffect(() => {
    async function getProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // if not logged in, set stuff to local storage & return
          setProfile({
            username: "Profile",
            rankings: JSON.parse(localStorage.getItem("savedRankings") ?? "[]"),
            sets: JSON.parse(localStorage.getItem("savedSets") ?? "[]"),
            created_at: "",
          });

          return;
        }

        const user = session.user;
        setEmail(user.email ?? null);

        const { data, error } = await supabase
          .from("profiles")
          .select("username, created_at, rankings, sets")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile(data);
        } else {
          // if data falsy
          setProfile({
            username: user.user_metadata?.username,
            rankings: JSON.parse(localStorage.getItem("savedRankings") ?? "[]"),
            sets: JSON.parse(localStorage.getItem("savedSets") ?? "[]"),
            created_at: user.created_at,
          });
        }
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
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
        subtitleText="You can always sign back in; your saved rankings and sets won't be lost."
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
              text={profile ? profile?.username : "Profile"}
            />
          )}

          {loading ? (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading user data...
            </h2>
          ) : (
            <>
              <div className="section mb-8 md:mb-10">
                <div
                  className={`mb-8 flex items-end justify-center md:mb-10 md:justify-start ${gabarito.className}`}
                >
                  <button
                    onClick={() => {
                      setSelectedView("rankings");
                    }}
                    className={`line-clamp-1 border-b-2 px-2 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "rankings" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="mr-2.5 rotate-90 text-neutral-500 dark:text-neutral-400"
                    />
                    <span>Your rankings</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedView("sets");
                    }}
                    className={`line-clamp-1 border-b-2 px-2 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "sets" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                  >
                    <FontAwesomeIcon
                      icon={faBarsStaggered}
                      className="mr-2.5 text-neutral-500 dark:text-neutral-400"
                    />
                    <span>Your sets</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedView("account");
                    }}
                    className={`line-clamp-1 border-b-2 px-2 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "account" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                  >
                    <FontAwesomeIcon
                      icon={faCog}
                      className="mr-2.5 text-neutral-500 dark:text-neutral-400"
                    />
                    <span>Account</span>
                  </button>
                </div>

                <div>
                  {selectedView === "rankings" ? (
                    profile?.rankings && profile?.rankings.length > 0 ? (
                      profile?.rankings.map((ranking, i) => {
                        return (
                          <RankingBoard
                            key={i}
                            className="mb-10 md:mb-12"
                            ranking={ranking}
                            index1={i}
                            showSeeRankingButton
                            savedRankings={profile?.rankings}
                          />
                        );
                      })
                    ) : (
                      <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                        You haven't created any rankings yet...
                      </h2>
                    )
                  ) : selectedView === "sets" ? (
                    profile?.sets && profile?.sets.length > 0 ? (
                      profile?.sets.map((set, i) => {
                        return (
                          <SetBoard
                            key={i}
                            id={set.id}
                            showSeeSetButton
                            className="mb-10 flex-1 md:mb-12"
                            set={{
                              id: set.id,
                              name: set.name,
                              utensils: shuffle(set.utensils),
                              username: set.username,
                              sharedAt: set.sharedAt,
                            }}
                          />
                        );
                      })
                    ) : (
                      <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                        You haven't created any sets yet...
                      </h2>
                    )
                  ) : profile?.username !== "Profile" ? (
                    <div>
                      <div className="mb-0.5 flex items-end px-2 md:mb-1">
                        <h2
                          className={`line-clamp-1 text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
                        >
                          Account details
                        </h2>
                      </div>

                      <div className="w-full rounded-lg border-2 border-neutral-500/15 px-4 py-2 text-neutral-600 dark:border-neutral-500/40 dark:text-neutral-300 md:px-4 md:py-3">
                        <div>
                          <label className="text-sm text-neutral-500">
                            Email
                          </label>
                          <p className="font-medium">{email}</p>
                        </div>

                        <div className="mt-3">
                          <label className="text-sm text-neutral-500">
                            Pairckler since
                          </label>
                          <p className="font-medium">
                            {profile?.created_at
                              ? new Date(
                                  profile.created_at,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setConfirmSignOutModalVisibility(true);
                        }}
                        className="mt-12 w-full rounded-full border-2 border-neutral-400 px-4 py-2 transition hover:border-transparent hover:bg-red-500 hover:text-neutral-50 active:bg-red-600 dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                        Sign up or log in to see account details.
                      </h2>
                      <Link
                        href="/login"
                        className="mt-12 block w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-center transition hover:border-transparent hover:bg-neutral-500 hover:text-neutral-50 active:bg-neutral-600 dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
                      >
                        Log in
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
