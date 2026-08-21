import ConfirmModal from "@/components/ConfirmModal";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Profile, Ranking } from "@/types";
import { generateRankingName, shuffle } from "@/lib/utilities";
import {
  deleteRanking,
  fetchCurrentProfile,
  fetchRanking,
  renameRanking,
} from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faCircleDown,
  faEllipsis,
  faFlag,
  faLink,
  faPen,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import * as htmlToImage from "html-to-image";

export default function SharedRanking() {
  const router = useRouter();
  const { id: rankingID } = router.query;

  const [currentRanking, setCurrentRanking] = useState<Ranking | null>();
  const [profile, setProfile] = useState<Profile | null>(null);

  const exportViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getCurrentRanking() {
      if (!rankingID) return;

      const currentRankingData = await fetchRanking(Number(rankingID));

      if (currentRankingData) {
        setCurrentRanking(currentRankingData);
      } else {
        setCurrentRanking(null);
      }
    }

    async function getProfile() {
      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }
    }

    getCurrentRanking();
    getProfile();
  }, [router.isReady, rankingID]);

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

  const [shareVis, setShareVis] = useState("invisible-fade");

  const shareDivRef = useRef<HTMLDivElement>(null);
  const shareBtnRef = useRef<HTMLButtonElement>(null);

  function handleShareOutsideClick(event: MouseEvent) {
    if (
      shareDivRef.current &&
      shareBtnRef.current &&
      !shareDivRef.current.contains(event.target as Element) &&
      !shareBtnRef.current.contains(event.target as Element)
    )
      setShareVis("invisible-fade");
  }

  useEffect(() => {
    document.addEventListener("click", handleShareOutsideClick);
    return () => document.removeEventListener("click", handleShareOutsideClick);
  }, []);

  async function onEditTitle() {
    const randomNewRankingName = generateRankingName();

    const rankingNewNameInput = prompt(
      "Enter a title for this ranking",
      currentRanking?.name === "New ranking"
        ? randomNewRankingName
        : currentRanking?.name,
    );

    if (rankingNewNameInput && rankingNewNameInput?.length > 50) {
      alert("Ranking title can only be 50 characters maximum");
      return;
    }

    const rankingNewName = rankingNewNameInput ?? "New ranking";

    await renameRanking(rankingNewName, Number(rankingID));
  }

  function onDelete() {
    setConfirmDeleteModalVisibility(true);
  }

  /* const [shareLinkModalVisibility, setShareLinkModalVisibility] =
    useState<boolean>(false); */
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

      {/* share set link modal */}
      {/* <ShareSetModal
        visibility={shareLinkModalVisibility}
        onConfirm={async (inputValue1, inputValue2, checkboxValue) => {
          const newSetID = generateSetID();

          setSetID(newSetID);

          const { error: userSetsError } = await supabase
            .from("user_sets")
            .insert([
              {
                id: newSetID,
                name: inputValue1,
                username: inputValue2,
                discoverable: checkboxValue,
                utensils: ranking.rankedUtensils.map((utensil) => ({
                  title: utensil.title,
                })),
              },
            ])
            .select();
          if (userSetsError) console.error("error:", userSetsError);

          setShareLinkModalVisibility(false);
          setCopyLinkModalVisibility(true);
        }}
        onCancel={() => setShareLinkModalVisibility(false)}
      /> */}

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
        titleText="Here's the link to this ranking"
        subtitleText={"https://pairckle.jakeo.dev/rankings/" + rankingID}
        primaryButtonText="Copy link"
        secondaryButtonText="Close"
        onConfirm={() => {
          navigator.clipboard.writeText(
            "https://pairckle.jakeo.dev/rankings/" + rankingID,
          );
        }}
        onCancel={() => setCopyLinkModalVisibility(false)}
      />

      {/* confirm to delete modal */}
      {currentRanking && profile && (
        <ConfirmModal
          visibility={confirmDeleteModalVisibility}
          titleText={`Are you sure you want to permanently delete "${currentRanking.name}"?`}
          subtitleText="This ranking will be lost forever!"
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onConfirm={async () => {
            await deleteRanking(profile, Number(rankingID));

            setGoHomeModalVisibility(true);
            setConfirmDeleteModalVisibility(false);
          }}
          onCancel={() => {
            setConfirmDeleteModalVisibility(false);
          }}
        />
      )}

      {/* go home after deletion modal */}
      {currentRanking && (
        <ConfirmModal
          visibility={goHomeModalVisibility}
          titleText={`"${currentRanking.name}" has been permanently deleted.`}
          primaryButtonText="Go to home screen"
          onConfirm={() => {
            router.replace("/");
          }}
        />
      )}

      <div className="flex w-full items-center justify-center pb-16">
        <div className="w-full lg:min-h-[88.1vh]">
          <Heading
            icon={faChartSimple}
            rotateIcon
            title={currentRanking?.name || "Your ranking"}
            subtext1={currentRanking?.username}
            subtext2={
              currentRanking?.createdAt
                ? new Date(currentRanking.createdAt).toLocaleDateString()
                : ""
            }
          >
            {currentRanking && (
              <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
                {/* <button
                  className="cursor-pointer flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-1 md:text-base"
                  onClick={() => {
                    likeRanking(Number(rankingID));
                  }}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="mr-1 md:mr-1.5"
                    aria-labelledby="like-button-text"
                  />
                  <span id="like-button-text">Like</span>
                </button> */}

                <div className="relative inline-block">
                  <button
                    className="flex h-min w-min cursor-pointer items-center justify-center rounded-full bg-neutral-400/20 px-2.5 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3 md:py-1 md:text-base dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                    onClick={() => {
                      if (shareVis === "invisible-fade")
                        setShareVis("visible-fade");
                      else if (shareVis === "visible-fade")
                        setShareVis("invisible-fade");
                    }}
                    ref={shareBtnRef}
                  >
                    <FontAwesomeIcon
                      icon={faShare}
                      className="mr-1 md:mr-1.5"
                      aria-labelledby="share-button-text"
                    />
                    <span id="share-button-text">Share</span>
                  </button>
                  <div
                    ref={shareDivRef}
                    className={`${shareVis} absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border-2 border-neutral-200 bg-neutral-50 shadow-md md:w-52 dark:border-neutral-800 dark:bg-black`}
                  >
                    <button
                      className="flex h-min w-full cursor-pointer items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                      onClick={() => {
                        setCopyLinkModalVisibility(true);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faLink}
                        className="mr-2 w-4 text-neutral-700 md:mr-3 dark:text-neutral-400"
                        aria-labelledby="copy-link-button-text"
                      />
                      <span id="copy-link-button-text">Copy link</span>
                    </button>
                    <button
                      className="flex h-min w-full cursor-pointer items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                      onClick={async () => {
                        const node = exportViewRef.current;

                        try {
                          node?.classList.remove("hidden");

                          await new Promise((resolve) =>
                            setTimeout(resolve, 100),
                          );

                          const dataUrl = await htmlToImage.toPng(
                            node || new HTMLElement(),
                          );

                          const a = document.createElement("a");
                          a.href = dataUrl;
                          a.download = `pairckle-${currentRanking.name.toLocaleLowerCase().replace(/\s+/g, "-")}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error("Error:", error);
                        } finally {
                          node?.classList.add("hidden");
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCircleDown}
                        className="mr-2 w-4 text-neutral-700 md:mr-3 dark:text-neutral-400"
                        aria-labelledby="download-button-text"
                      />
                      <span id="download-button-text">Download as PNG</span>
                    </button>
                  </div>
                </div>

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
                    <Link
                      className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 md:px-3.5 md:py-2 md:text-sm dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45"
                      href="/create"
                      onClick={(e) => {
                        if (
                          localStorage.getItem("combosArray") &&
                          localStorage.getItem("combosArray") !== "[]"
                        ) {
                          e.preventDefault();
                          setErrorRankingModalVisibility(true);
                        } else {
                          localStorage.setItem(
                            "utensilInput",
                            shuffle(
                              currentRanking.rankedUtensils.map(
                                (utensil) => utensil.title,
                              ),
                            ).join("\n"),
                          );

                          localStorage.setItem(
                            "associatedSetID",
                            String(currentRanking.associatedSetID ?? -1),
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChartSimple}
                        className="mr-2 w-4 rotate-90 text-neutral-700 md:mr-3 dark:text-neutral-400"
                        aria-labelledby="re-rank-button-text"
                      />
                      <span id="re-rank-button-text">Re-rank</span>
                    </Link>

                    {profile?.id === currentRanking.userID && (
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

                    {profile?.id !== currentRanking.userID && (
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

          {currentRanking && Number(rankingID) > -1 ? (
            <div className="section mb-10 md:mb-12">
              <RankingBoard
                showAllUtensils
                disabled
                ranking={{
                  id: Number(rankingID),
                  name: "",
                  rankedUtensils: currentRanking.rankedUtensils,
                  type: currentRanking.type,
                }}
                index1={0}
                savedRankings={[]}
                exportViewRef={exportViewRef}
              />
            </div>
          ) : rankingID &&
            (Number(rankingID) < 0 || rankingID === "undefined") ? (
            <div className="section">
              <RankingBoard
                className="blur-xs"
                disabled
                ranking={{
                  id: -1,
                  name: "",
                  rankedUtensils: [
                    {
                      title: "When the Chips are Down",
                      score: 8,
                      wins: 8,
                      losses: 0,
                    },
                    {
                      title: "Way Down Hadestown",
                      score: 6,
                      wins: 8,
                      losses: 2,
                    },
                    {
                      title: "Our Lady of the Underground",
                      score: 3,
                      wins: 6,
                      losses: 3,
                    },
                    { title: "Road to Hell", score: 3, wins: 4, losses: 1 },
                    { title: "Chant", score: 1, wins: 7, losses: 6 },
                    { title: "Wedding Song", score: -1, wins: 3, losses: 4 },
                  ],
                  type: "hurry",
                }}
                index1={0}
                savedRankings={[]}
              />

              <h2 className="mt-10 text-center text-sm text-neutral-600 md:mt-12 md:text-base dark:text-neutral-400">
                Sign up or log in to see your full ranking.
              </h2>
              <Link
                href="/login"
                className="mt-2 block w-full rounded-full border-2 border-neutral-400 px-4 py-2 text-center text-sm transition hover:border-transparent hover:bg-neutral-500 hover:text-neutral-50 active:bg-neutral-600 md:mt-3 md:text-base dark:border-neutral-400 dark:hover:border-transparent dark:hover:text-black"
              >
                Log in
              </Link>
            </div>
          ) : !currentRanking ? (
            <div className="section">
              <h2 className="text-left text-xl text-pretty text-neutral-600 md:text-2xl dark:text-neutral-400">
                The page you are looking for does not exist. This may be
                because:
              </h2>
              <ul className="mt-4 list-inside list-disc pl-4">
                <li className="leading-7 text-neutral-800 md:text-lg dark:text-neutral-200">
                  This ranking has been deleted.
                </li>
                <li className="leading-7 text-neutral-800 md:text-lg dark:text-neutral-200">
                  You entered an incorrect link.
                </li>
              </ul>
            </div>
          ) : (
            <h2 className="section animate-pulse text-center text-xl text-neutral-600 md:text-2xl dark:text-neutral-400">
              Loading ranking...
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
