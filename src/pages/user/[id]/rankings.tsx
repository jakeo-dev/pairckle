import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import RankingBoard from "@/components/RankingBoard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Profile, Ranking } from "@/types";
import {
  fetchCurrentProfile,
  fetchOwnedUserRankings,
  fetchUserProfile,
} from "@/db";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faUser as faUserRegular } from "@fortawesome/free-regular-svg-icons";

export default function UserRankings() {
  const router = useRouter();
  const { id: username } = router.query;

  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const [ownedRankings, setOwnedRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    async function getProfile() {
      // if not logged in, set stuff to local storage & stop here
      if (String(username) === "guest") {
        setSelectedProfile({
          id: "",
          username: "Guest",
          createdAt: "",
          ownedRankings: [],
          ownedSets: [],
        });

        const savedRankingsArray = JSON.parse(
          localStorage.getItem("savedRankings") ?? "[]",
        );

        // correct rankings to use new format instead of legacy one
        const rankingsArray: Ranking[] = Array.isArray(savedRankingsArray)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            savedRankingsArray.map((r: any) => ({
              ...r,
              name: r.name ?? r.rankingName,
              createdAt:
                r.createdAt ??
                (r.rankingDate
                  ? new Date(
                      r.rankingDate.year,
                      r.rankingDate.month - 1,
                      r.rankingDate.day,
                    ).toISOString()
                  : new Date().toISOString()),
              type: r.type ?? r.rankingType,
              combos: r.combos ?? r.rankingCombos,
              winnersHistory: r.winnersHistory ?? r.rankingWinnersHistory,
            }))
          : [];
        setOwnedRankings(rankingsArray);

        setLoading(false);

        return;
      }

      const selectedProfileData = await fetchUserProfile(String(username));
      setSelectedProfile(selectedProfileData);

      // get rankings that are owned by selected user
      const selectedUserRankingsData = await fetchOwnedUserRankings(
        selectedProfileData.id,
      );
      setOwnedRankings(
        selectedUserRankingsData ? selectedUserRankingsData : [],
      );

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
              title={selectedProfile?.username ?? "Guest"}
              tabs={[
                {
                  title: "Rankings",
                  href: `/user/${username}/rankings`,
                  active: true,
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
              {ownedRankings && ownedRankings.length > 0 ? (
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
                <h2 className="section text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
                  {`You haven't created any rankings yet...`}
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
          )}
        </div>
      </div>
    </>
  );
}
