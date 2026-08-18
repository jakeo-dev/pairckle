import ConfirmModal from "@/components/ConfirmModal";
import SetBoard from "@/components/SetBoard";
import Heading from "@/components/Heading";
import CommonHead from "@/components/CommonHead";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Profile, Set } from "@/types";
import { randomElement, shuffle } from "@/lib/utilities";
import { RANDOM_SET, STARTER_SETS } from "@/constants/sets";
import { deleteSet, fetchCurrentProfile, fetchSet, renameSet } from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faEllipsis,
  faFlag,
  faPen,
  faShare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function SharedSet() {
  const router = useRouter();
  const { id: setID } = router.query;

  const [currentSet, setCurrentSet] = useState<Set>({
    id: "",
    createdAt: "",
    name: "",
    username: "",
    utensils: [],
    userID: "",
  });
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function getCurrentSet() {
      if (!setID) return;

      if (isNaN(Number(setID))) {
        const currentSetData = await fetchSet(String(setID));

        if (currentSetData) {
          setCurrentSet(currentSetData);
        }
      } else if (Number(setID) === 0) {
        const newCurrentSet = RANDOM_SET;
        setCurrentSet(newCurrentSet);
      } else {
        const newCurrentSet = STARTER_SETS.filter((set) => {
          return set.id === setID;
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

    getCurrentSet();
    getProfile();
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
    const randomNewSetName =
      randomElement([
        "Common",
        "Popular",
        "Well-known",
        "Types of",
        "Kinds of",
      ]) +
      " " +
      randomElement([
        "pickles",
        "spaghetti and meatballs",
        "fettuccine alfredos",
        "penne pastas",
        "macaroni and cheeses",
        "raviolis",
        "lasagnas",
        "udons",
        "ramens",
        "carbonaras",
        "baked zitis",
        "gnocchis",
        "pizzas",
        "calzones",
        "garlic breads",
        "focaccias",
        "cheese breads",
        "flatbreads",
        "french bread pizzas",
        "deep-dish pizzas",
        "pepperoni rolls",
        "burgers",
        "cheeseburgers",
        "chicken sandwiches",
        "grilled cheeses",
        "tuna melts",
        "sloppy joes",
        "philly cheesesteaks",
        "paninis",
        "shawarmas",
        "gyros",
        "falafels",
        "bánh mis",
        "tacos",
        "burritos",
        "quesadillas",
        "fajitas",
        "enchiladas",
        "tamales",
        "nachos",
        "tostadas",
        "sushis",
        "sashimis",
        "teriyakis",
        "tempuras",
        "spring rolls",
        "egg rolls",
        "dumplings",
        "orange chickens",
        "fried rices",
        "chow meins",
        "bulgogis",
        "chicken soups",
        "tomato soups",
        "french onion soups",
        "clam chowders",
        "lobster bisques",
        "beef stews",
        "vegetable stews",
        "lentil soups",
        "gazpachos",
        "minestrones",
        "tortilla soups",
        "jambalayas",
        "miso soups",
        "ribs",
        "briskets",
        "steaks",
        "meatloaves",
        "chicken parmesans",
        "fried chickens",
        "buffalo wings",
        "honey garlic wings",
        "beef bourguignons",
        "chicken pot pies",
        "casseroles",
        "stuffed peppers",
        "baked pastas",
        "pot pies",
        "pastitsios",
        "ratatouilles",
        "eggplant parmesans",
        "pancakes",
        "waffles",
        "french toasts",
        "crepes",
        "scrambled eggs",
        "omelets",
        "eggs benedicts",
        "breakfast burritos",
        "breakfast sandwiches",
        "hash browns",
        "fish and chips",
        "grilled salmons",
        "crab cakes",
        "lobster rolls",
        "shrimp scampis",
        "mozzarella sticks",
        "jalapeño poppers",
        "stuffed mushrooms",
        "deviled eggs",
        "bruschettas",
        "caprese salads",
        "chicken tenders",
      ]);

    const setNewNameInput = prompt(
      "Enter a title for this set",
      currentSet.name === "New set" ? randomNewSetName : currentSet.name,
    );
    const setNewName = setNewNameInput ?? "New set";

    await renameSet(setNewName, String(setID));
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
            await deleteSet(profile, String(setID));

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
          {currentSet && (
            <Heading
              icon={faBarsStaggered}
              text={currentSet.name}
              subtext1={currentSet.username}
              subtext2={
                currentSet.createdAt
                  ? new Date(currentSet.createdAt).toLocaleDateString()
                  : ""
              }
            >
              <div className="mb-0.5 ml-auto flex min-w-max gap-1 md:gap-1.5">
                <button
                  className="flex h-min w-min items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-2.5 md:py-1 md:text-base"
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
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-400/20 px-2 py-1 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:h-8 md:w-8 md:p-1 md:text-base"
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
                    className={`${settingsVis} absolute right-0 z-10 mt-1 flex w-40 flex-col overflow-hidden rounded-md border-2 border-neutral-200 bg-neutral-50 shadow-md dark:border-neutral-800 dark:bg-black md:w-52`}
                  >
                    {profile?.id === currentSet.userID && (
                      <>
                        <button
                          className="flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                          onClick={onEditTitle}
                        >
                          <FontAwesomeIcon
                            icon={faPen}
                            className="mr-2 w-4 text-neutral-700 dark:text-neutral-400 md:mr-3"
                            aria-labelledby="edit-title-button-text"
                          />
                          <span id="edit-title-button-text">Edit title</span>
                        </button>

                        <button
                          className="group flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 hover:text-red-700 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:hover:text-red-400 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                          onClick={onDelete}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="mr-2 w-4 text-neutral-700 group-hover:text-red-800 dark:text-neutral-400 dark:group-hover:text-red-300 md:mr-3"
                            aria-labelledby="delete-button-text"
                          />
                          <span id="delete-button-text">Delete</span>
                        </button>
                      </>
                    )}

                    {profile?.id !== currentSet.userID && (
                      <a
                        className="group flex h-min w-full items-center justify-start bg-neutral-300/20 px-2.5 py-2 text-left text-xs transition hover:bg-neutral-400/30 hover:text-yellow-700 active:bg-neutral-400/40 dark:bg-neutral-500/25 dark:hover:bg-neutral-400/35 dark:hover:text-yellow-400 dark:active:bg-neutral-400/45 md:px-3.5 md:py-2 md:text-sm"
                        href="mailto:report@jakeo.dev"
                      >
                        <FontAwesomeIcon
                          icon={faFlag}
                          className="mr-2 w-4 text-neutral-700 group-hover:text-yellow-800 dark:text-neutral-400 dark:group-hover:text-yellow-300 md:mr-3"
                          aria-labelledby="report-button-text"
                        />
                        <span id="report-button-text">Report</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Heading>
          )}

          {currentSet ? (
            <div className="section mb-10 md:mb-12">
              <SetBoard
                showAllUtensils
                set={{
                  id: currentSet.id,
                  name: "",
                  utensils: shuffle(currentSet.utensils),
                }}
                /* onRank={(event) => {
                    if (
                      localStorage.getItem("combosArray") &&
                      localStorage.getItem("combosArray") !== "[]"
                    ) {
                      event.preventDefault();
                      setErrorRankingModalVisibility(true);
                    } else {
                      localStorage.setItem(
                        "utensilInput",
                        shuffle(currentSet.utensils)
                          .map((utensil) => utensil.title)
                          .join("\n"),
                      );
                    }
                  }} */
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
                      shuffle(currentSet.utensils)
                        .map((utensil) =>
                          utensil.title !== "????????"
                            ? utensil.title
                            : randomElement(
                                randomElement(STARTER_SETS).utensils,
                              ).title,
                        )
                        .join("\n"),
                    );
                    localStorage.setItem("rankNow", rankingType);
                  }
                }}
              />
            </div>
          ) : (
            <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
              Loading set...
            </h2>
          )}
        </div>
      </div>
    </>
  );
}
