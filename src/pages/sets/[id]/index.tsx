import ConfirmModal from "@/components/ConfirmModal";
import SetBoard from "@/components/SetBoard";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Profile, Ranking, Set } from "@/types";
import { generateSetName, randomElement, shuffle } from "@/lib/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/constants/sets";
import {
  deleteSet,
  fetchCurrentProfile,
  fetchDiscoverableUserRankings,
  fetchSet,
  renameSet,
} from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faEllipsis,
  faFlag,
  faPen,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
import Link from "next/link";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function SharedSet() {
  const router = useRouter();
  const { id: setID } = router.query;

  const [currentSet, setCurrentSet] = useState<Set | null>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [associatedDiscoverableRankings, setAssociatedDiscoverableRankings] =
    useState<Ranking[]>([]);

  useEffect(() => {
    async function getCurrentSet() {
      if (!setID) return;

      if (String(setID).length > 4) {
        const currentSetData = await fetchSet(Number(setID));

        if (currentSetData) {
          setCurrentSet(currentSetData);
        }
      } else if (Number(setID) === 0) {
        const newCurrentSet = RANDOM_SET;
        setCurrentSet(newCurrentSet);
      } else {
        const newCurrentSet = STARTER_SETS.filter((set) => {
          return set.id === Number(setID);
        })[0];
        setCurrentSet(newCurrentSet);
      }
    }

    async function getProfile() {
      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }
    }

    async function getAssociatedDiscoverableRankings() {
      if (!setID) return;

      const userRankingsData = await fetchDiscoverableUserRankings(
        Number(setID),
      );

      if (userRankingsData) {
        setAssociatedDiscoverableRankings(userRankingsData);
      }
    }

    getCurrentSet();
    getProfile();
    getAssociatedDiscoverableRankings();
  }, [router.isReady, setID]);

  const [settingsVis, setSettingsVis] = useState("invisible-fade");

  const settingsDivRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  function handleSettingsOutsideClick(event: MouseEvent) {
    if (
      settingsDivRef.current &&
      settingsBtnRef.current &&
      !settingsDivRef.current.contains(event.target as Element) &&
      !settingsBtnRef.current.contains(event.target as Element)
    )
      setSettingsVis("invisible-fade");
  }

  useEffect(() => {
    document.addEventListener("click", handleSettingsOutsideClick);
    return () =>
      document.removeEventListener("click", handleSettingsOutsideClick);
  }, []);

  async function onEditTitle() {
    const randomNewSetName = generateSetName();

    const setNewNameInput = prompt(
      "Enter a title for this set",
      currentSet?.name === "New set" ? randomNewSetName : currentSet?.name,
    );

    if (setNewNameInput && setNewNameInput?.length > 50) {
      alert("Ranking title can only be 50 characters maximum");
      return;
    }

    const setNewName = setNewNameInput ?? "New set";

    await renameSet(setNewName, Number(setID));
  }

  function onDelete() {
    setConfirmDeleteModalVisibility(true);
  }

  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);
  const [copyLinkModalVisibility, setCopyLinkModalVisibility] =
    useState<boolean>(false);
  const [confirmDeleteModalVisibility, setConfirmDeleteModalVisibility] =
    useState<boolean>(false);
  const [goHomeModalVisibility, setGoHomeModalVisibility] =
    useState<boolean>(false);

  return (
    <>
      <CommonHead />

      {/* error ranking modal */}
      <ConfirmModal
        visibility={errorRankingModalVisibility}
        titleText="You already have a ranking in progress"
        subtitleText="Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      {/* copy link modal */}
      <ConfirmModal
        visibility={copyLinkModalVisibility}
        titleText="Here's your link"
        subtitleText={"https://pairckle.jakeo.dev/sets/" + setID}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/sets/" + setID,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      {/* confirm to delete modal */}
      {currentSet && profile && (
        <ConfirmModal
          visibility={confirmDeleteModalVisibility}
          titleText={`Are you sure you want to permanently delete "${currentSet.name}"?`}
          subtitleText="This set will be lost forever!"
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onConfirm={async () => {
            await deleteSet(profile, Number(setID));

            setGoHomeModalVisibility(true);
            setConfirmDeleteModalVisibility(false);
          }}
          onCancel={() => {
            setConfirmDeleteModalVisibility(false);
          }}
        />
      )}

      {/* go home after deletion modal */}
      {currentSet && (
        <ConfirmModal
          visibility={goHomeModalVisibility}
          titleText={`"${currentSet.name}" has been permanently deleted.`}
          primaryButtonText="Go to home screen"
          onConfirm={() => {
            router.replace("/");
          }}
        />
      )}

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.3vh]">
          <Heading
            icon={faBarsStaggered}
            title={currentSet?.name || "Your set"}
            subtext1={currentSet?.username}
            subtext2={
              currentSet?.createdAt
                ? new Date(currentSet.createdAt).toLocaleDateString()
                : ""
            }
          >
            {currentSet && (
              <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
                <button
                  className="flex h-min w-min cursor-pointer items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3 md:py-1 md:text-base dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                  onClick={() => {
                    setCopyLinkModalVisibility(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faShare}
                    className="mr-1.5"
                    aria-labelledby="share-button-text"
                  />
                  <span id="share-button-text">Share</span>
                </button>

                <div className="relative inline-block">
                  <button
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:h-8 md:w-8 md:p-1 md:text-base dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                    onClick={() => {
                      if (settingsVis === "invisible-fade")
                        setSettingsVis("visible-fade");
                      else if (settingsVis === "visible-fade")
                        setSettingsVis("invisible-fade");
                    }}
                    ref={settingsBtnRef}
                  >
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      aria-label="More options"
                      title="More options"
                    />
                  </button>
                  <div
                    ref={settingsDivRef}
                    className={`${settingsVis} absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border-2 border-neutral-200 bg-neutral-50 shadow-md md:w-52 dark:border-neutral-800 dark:bg-black`}
                  >
                    {profile?.id === currentSet.userID && (
                      <>
                        <button
                          className="flex h-min w-full cursor-pointer items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                          onClick={onEditTitle}
                        >
                          <FontAwesomeIcon
                            icon={faPen}
                            className="mr-2 w-4 text-neutral-700 md:mr-3 dark:text-neutral-400"
                            aria-labelledby="edit-title-button-text"
                          />
                          <span id="edit-title-button-text">Edit title</span>
                        </button>

                        <button
                          className="group flex h-min w-full cursor-pointer items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 hover:text-red-700 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:hover:text-red-400 dark:active:bg-neutral-400/45"
                          onClick={onDelete}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="mr-2 w-4 text-neutral-700 group-hover:text-red-800 md:mr-3 dark:text-neutral-400 dark:group-hover:text-red-300"
                            aria-labelledby="delete-button-text"
                          />
                          <span id="delete-button-text">Delete</span>
                        </button>
                      </>
                    )}

                    {profile?.id !== currentSet.userID && (
                      <a
                        className="group flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 hover:text-yellow-700 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:hover:text-yellow-400 dark:active:bg-neutral-400/45"
                        href="mailto:report@jakeo.dev"
                      >
                        <FontAwesomeIcon
                          icon={faFlag}
                          className="mr-2 w-4 text-neutral-700 group-hover:text-yellow-800 md:mr-3 dark:text-neutral-400 dark:group-hover:text-yellow-300"
                          aria-labelledby="report-button-text"
                        />
                        <span id="report-button-text">Report</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Heading>

          {currentSet && Number(setID) > -1 ? (
            <div className="section mb-10 md:mb-12">
              <SetBoard
                showAllUtensils
                disabled
                set={{
                  id: currentSet.id,
                  name: "",
                  utensils: currentSet.utensils,
                }}
                onRankNow={(event, rankingType) => {
                  if (
                    localStorage.getItem("combosArray") &&
                    localStorage.getItem("combosArray") !== "[]"
                  ) {
                    event.preventDefault();
                    setErrorRankingModalVisibility(true);
                  } else {
                    localStorage.setItem(
                      "utensilInput",
                      JSON.stringify(
                        shuffle(currentSet.utensils).map((utensil) => {
                          return {
                            title:
                              utensil.title !== "????????"
                                ? utensil.title
                                : randomElement(
                                    randomElement(STARTER_SETS).utensils,
                                  ).title,
                            score: 0,
                            wins: 0,
                            losses: 0,
                          };
                        }),
                      ),
                    );
                    localStorage.setItem("rankNow", rankingType);

                    localStorage.setItem("associatedSetID", String(setID));
                  }
                }}
              />
            </div>
          ) : setID && Number(setID) < 0 ? (
            <div className="section">
              <SetBoard
                className="blur-xs"
                disabled
                set={{
                  id: -1,
                  name: "",
                  utensils: [
                    {
                      title: "When the Chips are Down",
                    },
                    {
                      title: "Way Down Hadestown",
                    },
                    {
                      title: "Our Lady of the Underground",
                    },
                    { title: "Road to Hell" },
                    { title: "Chant" },
                    { title: "Wedding Song" },
                  ],
                }}
              />

              <h2 className="mt-10 text-center text-sm text-neutral-600 md:mt-12 md:text-base dark:text-neutral-400">
                Sign up or log in to see your full set.
              </h2>
              <Link
                href="/login"
                className="mt-2 block w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-center text-sm transition hover:border-transparent hover:bg-neutral-500 hover:text-neutral-50 active:bg-neutral-600 md:mt-3 md:text-base dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
              >
                Log in
              </Link>
            </div>
          ) : !currentSet ? (
            <h2 className="section text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              The set you are looking for does not exist. Either it has been
              deleted or you entered the incorrect link.
            </h2>
          ) : (
            <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              Loading set...
            </h2>
          )}

          {/* rankings that use this set */}
          {currentSet && associatedDiscoverableRankings.length > 0 && (
            <div className="wide-section">
              <h2
                className={`mb-6 px-4 text-lg font-semibold md:px-6 md:text-xl ${gabarito.className}`}
              >
                Rankings of this set
              </h2>
              <div className="fade-edges-sides flex gap-2 overflow-x-scroll px-2 md:gap-4 md:px-4">
                {[...associatedDiscoverableRankings].map((ranking, index1) => (
                  <RankingBoard
                    key={index1}
                    index1={index1}
                    miniView
                    ranking={{
                      id: ranking.id,
                      name: ranking.name,
                      rankedUtensils: ranking.rankedUtensils,
                      username: ranking.username,
                      createdAt: ranking.createdAt,
                      type: ranking.type,
                      combos: ranking.combos,
                      winnersHistory: ranking.winnersHistory,
                      userID: ranking.userID,
                      associatedSetID: ranking.associatedSetID,
                    }}
                    savedRankings={associatedDiscoverableRankings}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
