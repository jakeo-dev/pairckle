import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import ConfirmModal from "@/components/ConfirmModal";
import RankingBoard from "@/components/RankingBoard";
import SetBoard from "@/components/SetBoard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Profile, Ranking, Set } from "@/types";
import { shuffle } from "@/lib/utilities";
import {
  fetchCurrentProfile,
  fetchOwnedUserRankings,
  fetchOwnedUserSets,
} from "@/db";

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

  const [ownedRankings, setOwnedRankings] = useState<Ranking[]>([]);
  const [ownedSets, setOwnedSets] = useState<Set[]>([]);

  const [selectedView, setSelectedView] = useState<
    "rankings" | "sets" | "account"
  >("rankings");

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

        const savedRankingsArray = JSON.parse(
          localStorage.getItem("savedRankings") ?? "[]",
        );
        const rankingsArray: Ranking[] = Array.isArray(savedRankingsArray)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            savedRankingsArray.map((r: any) => ({
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
        setOwnedRankings(rankingsArray);
        setOwnedSets(JSON.parse(localStorage.getItem("savedSets") ?? "[]"));

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

      // get rankings that are owned by current user
      const currentUserRankingsData = await fetchOwnedUserRankings(user.id);
      setOwnedRankings(currentUserRankingsData ? currentUserRankingsData : []);

      // get sets that are owned by current user
      const currentUserSetsData = await fetchOwnedUserSets(user.id);
      setOwnedSets(currentUserSetsData ? currentUserSetsData : []);

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
              text={profile ? profile?.username : "Profile"}
            />
          )}

          {loading ? (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading user data...
            </h2>
          ) : (
            <div>
              <div
                className={`wide-section mb-8 flex items-end justify-center md:mb-10 ${gabarito.className}`}
              >
                <button
                  onClick={() => {
                    setSelectedView("rankings");
                  }}
                  className={`group line-clamp-1 break-all border-b-2 px-3 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "rankings" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 text-neutral-500 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                >
                  <FontAwesomeIcon
                    icon={faChartSimple}
                    className={`mr-2 rotate-90 md:mr-2.5 ${selectedView === "rankings" ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`}
                  />
                  <span className="hidden md:inline">Your rankings</span>
                  <span className="md:hidden">Rankings</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedView("sets");
                  }}
                  className={`group line-clamp-1 break-all border-b-2 px-3 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "sets" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 text-neutral-500 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                >
                  <FontAwesomeIcon
                    icon={faBarsStaggered}
                    className={`mr-2 md:mr-2.5 ${selectedView === "sets" ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`}
                  />
                  <span className="hidden md:inline">Your sets</span>
                  <span className="md:hidden">Sets</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedView("account");
                  }}
                  className={`group line-clamp-1 break-all border-b-2 px-3 pb-1 text-sm font-medium leading-6 transition md:px-6 md:pb-3 md:text-lg ${selectedView === "account" ? "border-neutral-500/50 dark:border-neutral-400/50" : "border-neutral-500/20 text-neutral-500 hover:border-neutral-500/30 dark:border-neutral-400/20 dark:hover:border-neutral-400/30"}`}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className={`mr-2 md:mr-2.5 ${selectedView === "account" ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`}
                  />
                  <span>Account</span>
                </button>
              </div>

              <div>
                {selectedView === "rankings" ? (
                  ownedRankings && ownedRankings.length > 0 ? (
                    <div className="wide-section grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {[...ownedRankings].map((ranking, i) => {
                        return (
                          <RankingBoard
                            key={i}
                            miniView
                            ranking={ranking}
                            index1={i}
                            savedRankings={ownedRankings}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                      {`You haven't created any rankings yet...`}
                    </h2>
                  )
                ) : selectedView === "sets" ? (
                  ownedSets && ownedSets.length > 0 ? (
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
                              utensils: shuffle(set.utensils),
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
                  )
                ) : profile?.username !== "Profile" ? (
                  <div className="section">
                    {/* <div className="mb-0.5 flex items-end px-2 md:mb-1">
                        <h2
                          className={`line-clamp-1 break-all text-base font-medium leading-6 md:text-lg ${gabarito.className}`}
                        >
                          Account details
                        </h2>
                      </div> */}

                    <div className="w-full rounded-lg border-2 border-neutral-500/15 px-4 py-3 text-neutral-600 dark:border-neutral-500/40 dark:text-neutral-300 md:px-5 md:py-4">
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
                      className="mt-4 w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-sm transition hover:border-transparent hover:bg-red-500 hover:text-neutral-50 active:bg-red-600 dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black md:mt-6 md:text-base"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="section">
                    <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                      Sign up or log in to see account details.
                    </h2>
                    <Link
                      href="/login"
                      className="mt-12 block w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-center text-sm transition hover:border-transparent hover:bg-neutral-500 hover:text-neutral-50 active:bg-neutral-600 dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black md:text-base"
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
