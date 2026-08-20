import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import RankingBoard from "@/components/RankingBoard";
import Heading from "@/components/Heading";
import SetBoard from "@/components/SetBoard";
import { Profile, Ranking, Utensil, Set } from "@/types";
import {
  generateRankingID,
  generateSetID,
  shuffle,
  sortUtensils,
} from "@/lib/utilities";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { RANDOM_SET, STARTER_SETS } from "@/constants/sets";
import {
  fetchCurrentProfile,
  fetchDiscoverableUserSets,
  insertUserRankings,
  insertUserSets,
  updateCurrentOwnedRankings,
  updateCurrentOwnedSets,
} from "@/db";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faBolt,
  faBookmark,
  faBullseye,
  faForward,
  faPlusCircle,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Create() {
  const [flowView, setFlowView] = useState<"start" | "selection" | "ranking">(
    "start",
  );

  const [createView, setCreateView] = useState<"choose" | "new">("new");

  const [confirmRestartModalVisibility, setConfirmRestartModalVisibility] =
    useState<boolean>(false);
  const [confirmRestartModalSubtext, setConfirmRestartModalSubtext] =
    useState<string>(
      "If you restart, you'll lose all of your progress so far in this ranking.",
    );

  // index of the current combo in combosArray; how far along in the selection process
  const [currentComboIndex, setCurrentComboIndex] = useState<number>(-1);

  // saves the winner for each combo (0: first option, 1: second option, 2: skip), allows for undoing a selection
  const [winnersHistory, setWinnersHistory] = useState<number[]>([]);

  const [firstOption, setFirstOption] = useState<string>();
  const [secondOption, setSecondOption] = useState<string>();

  // number of combos until the selection process is finished, the number is halved for Hurry
  const [maxCombos, setMaxCombos] = useState<number>(1);

  // type of ranking: hurry or concentrate
  const [rankingType, setRankingType] = useState<string>("");

  // array of utensils (each option inputted) from utensilInput, each starts with a score of 0, new user starts with 10 blank utensils
  const [utensilsArray, setUtensilsArray] = useState<Utensil[]>([
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
    { title: "", score: 0, wins: 0, losses: 0 },
  ]);
  const [setNameInput, setSetNameInput] = useState<string>("");

  // randomized array of combos, each number in a combo corresponds to a utensil
  const [combosArray, setCombosArray] = useState<number[][]>([[]]);

  useEffect(() => {
    const storedUtensilsInput = localStorage.getItem("utensilInput") ?? "";
    let usableStoredUtensilsInput: Utensil[];

    if (!storedUtensilsInput) {
      usableStoredUtensilsInput = [
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
        { title: "", score: 0, wins: 0, losses: 0 },
      ];
    } else if (storedUtensilsInput?.startsWith("[")) {
      usableStoredUtensilsInput = JSON.parse(storedUtensilsInput);
    } else {
      // if input is not separated by lines, then assume its separated by commas
      // lines trump commas
      let splitKey = "\n";
      if (
        storedUtensilsInput.trim().split("\n").length < 2 &&
        storedUtensilsInput.trim().split(",").length > 1
      ) {
        splitKey = ",";
      }

      usableStoredUtensilsInput = storedUtensilsInput
        .trim()
        .split(splitKey)
        .map((utensil) => {
          return { title: utensil, score: 0, wins: 0, losses: 0 };
        });
      if (usableStoredUtensilsInput.length % 2 !== 0)
        usableStoredUtensilsInput.push({
          title: "",
          score: 0,
          wins: 0,
          losses: 0,
        });
    }

    setUtensilsArray(usableStoredUtensilsInput);

    const savedSetName = JSON.parse(localStorage.getItem("setNameInput") ?? "");
    setSetNameInput(savedSetName);

    if (localStorage.getItem("rankNow") === "hurry") {
      onHurry(usableStoredUtensilsInput);
    } else if (localStorage.getItem("rankNow") === "concentrate") {
      onConcentrate(usableStoredUtensilsInput);
    }
    localStorage.setItem("rankNow", "");

    if (
      // dont check for winnersHistory, because it could be null if no decisions have been made yet even if the ranking has been started
      localStorage.getItem("maxCombos") &&
      localStorage.getItem("rankingType") &&
      localStorage.getItem("utensilsArray") &&
      localStorage.getItem("combosArray")
    ) {
      const savedMaxCombos = Number(localStorage.getItem("maxCombos") ?? "1");
      const savedRankingType = localStorage.getItem("rankingType") ?? "";
      const savedUtensilsArray = JSON.parse(
        localStorage.getItem("utensilsArray") ?? "[]",
      );
      const savedCombosArray = JSON.parse(
        localStorage.getItem("combosArray") ?? "[]",
      );
      const savedWinnersHistory = JSON.parse(
        localStorage.getItem("winnersHistory") ?? "[]",
      );

      setMaxCombos(savedMaxCombos);
      setRankingType(savedRankingType);
      setUtensilsArray(savedUtensilsArray);
      setCombosArray(savedCombosArray);
      setWinnersHistory(savedWinnersHistory);
      setCurrentComboIndex(savedWinnersHistory.length - 1);

      setNextCombo(
        savedCombosArray,
        savedUtensilsArray,
        savedWinnersHistory.length - 1,
        savedMaxCombos,
      );

      setFlowView("selection");
    }
  }, []);

  // click first option, second option, previous, or skip based on keyboard input (WASD, arrows)
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const secondOptionRef = useRef<HTMLButtonElement>(null);
  const previousOptionRef = useRef<HTMLButtonElement>(null);
  const skipOptionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        localStorage.getItem("combosArray") === null ||
        localStorage.getItem("combosArray") === "[]"
      )
        return;

      if (
        (event.key === "a" || event.key === "ArrowLeft") &&
        firstOptionRef.current
      ) {
        firstOptionRef.current.click();
      } else if (
        (event.key === "d" || event.key === "ArrowRight") &&
        secondOptionRef.current
      ) {
        secondOptionRef.current.click();
      } else if (
        (event.key === "s" || event.key === "ArrowDown") &&
        previousOptionRef.current
      ) {
        previousOptionRef.current.click();
      } else if (
        (event.key === "w" || event.key === "ArrowUp") &&
        skipOptionRef.current
      ) {
        skipOptionRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const router = useRouter();
  //const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function getProfile() {
      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        setProfile(result?.profileData);
      }
    }

    getProfile();
  }, [router]);

  function generateCombos(array: Utensil[]) {
    const combinations: number[][] = [];

    for (const utensil1 of array) {
      const firstUtensilIndex = array.indexOf(utensil1);

      for (const utensil2 of array) {
        const secondUtensilIndex = array.indexOf(utensil2);

        if (
          // checks if combo is the same utensil twice
          firstUtensilIndex != secondUtensilIndex &&
          // checks if duplicate combos in other orders already exists in combinations
          !combinations
            .map((combo) => JSON.stringify(combo))
            .includes(JSON.stringify([secondUtensilIndex, firstUtensilIndex]))
        ) {
          // shuffles order of numbers in each combo
          combinations.push([firstUtensilIndex, secondUtensilIndex]);
        }
      }
    }

    // shuffles order of numbers in each combo
    combinations.forEach((combo) => shuffle(combo));

    // shuffles order of combos
    return shuffle(combinations);
  }

  async function setNextCombo(
    combosArray: number[][],
    utensilsArray: Utensil[],
    currentComboIndex: number,
    maxCombos: number,
    winnersHistory?: number[], // winnersHistory only needed if setNextCombo is called when the ranking could be finished next combo
  ) {
    if (currentComboIndex + 1 < maxCombos) {
      // go to next combo in array
      const nextComboIndex = currentComboIndex + 1;
      setCurrentComboIndex(nextComboIndex);

      // set options to the selected combo
      setFirstOption(utensilsArray[combosArray[nextComboIndex][0]]["title"]);
      setSecondOption(utensilsArray[combosArray[nextComboIndex][1]]["title"]);
    } else {
      // done with all combos
      setFlowView("ranking");
      setCurrentComboIndex(-1);
      setWinnersHistory([]);
      localStorage.setItem("winnersHistory", JSON.stringify([]));
      localStorage.setItem("combosArray", JSON.stringify([]));
      localStorage.setItem("utensilsArray", JSON.stringify([]));
      localStorage.setItem("maxCombos", "1");
      localStorage.setItem("rankingType", "");

      const associatedSetID = Number(
        localStorage.getItem("associatedSetID") || -1,
      );

      if (!profile) {
        // utilize local storage if not logged in
        const savedRankingsArray = JSON.parse(
          localStorage.getItem("savedRankings") ?? "[]",
        );
        const correctedSavedRankingsArray: Ranking[] = Array.isArray(
          savedRankingsArray,
        )
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

        // add new ranking to array
        correctedSavedRankingsArray.unshift({
          id: -1,
          name: "New ranking", //"New ranking #" + (savedRankingsArray.length + 1),
          createdAt: new Date().toISOString(),
          type: rankingType,
          rankedUtensils: [...utensilsArray].sort(sortUtensils),
          combos: combosArray,
          winnersHistory: winnersHistory,
          associatedSetID: associatedSetID,
        });

        localStorage.setItem(
          "savedRankings",
          JSON.stringify(correctedSavedRankingsArray),
        );

        // utilize local storage if not logged in
        const savedSetsArray = JSON.parse(
          localStorage.getItem("savedSets") ?? "[]",
        );

        // add new set to array
        savedSetsArray.unshift({
          id: -1,
          name: "New set",
          createdAt: new Date().toISOString(),
          utensils: shuffle([...utensilsArray]),
        });

        localStorage.setItem("savedSets", JSON.stringify(savedSetsArray));
      } else {
        // add new ranking to db if logged in

        const rankingID = generateRankingID();

        await insertUserRankings([
          {
            id: rankingID,
            name: "New ranking",
            ranked_utensils: [...utensilsArray].sort(sortUtensils),
            type: rankingType,
            combos: combosArray,
            winners_history: winnersHistory,
            user_id: profile.id,
            username: profile.username,
            associated_set_id: associatedSetID,
          },
        ]);

        await updateCurrentOwnedRankings(rankingID, profile);

        // add new set to db if logged in

        const setID = generateSetID();

        await insertUserSets([
          {
            id: setID,
            name: "New set",
            utensils: shuffle([...utensilsArray]),
            user_id: profile.id,
            username: profile.username,
          },
        ]);

        await updateCurrentOwnedSets(setID, profile);
      }
    }
  }

  function setPrevCombo(combosArray: number[][], utensilsArray: Utensil[]) {
    // go to previous combo in array
    const prevComboIndex = currentComboIndex - 1;
    setCurrentComboIndex(prevComboIndex);

    // set options to the selected combo
    setFirstOption(utensilsArray[combosArray[prevComboIndex][0]]["title"]);
    setSecondOption(utensilsArray[combosArray[prevComboIndex][1]]["title"]);
  }

  function onHurry(usableUtensilsArray: Utensil[]) {
    const newUtensilsArray = usableUtensilsArray.filter(
      (u) => u.title.trim() !== "",
    );
    localStorage.setItem("utensilInput", JSON.stringify(newUtensilsArray));

    if (newUtensilsArray.length < 2) {
      alert("Enter a list of things or choose a set to rank");
    } else if (newUtensilsArray.some((u) => u.title.length > 200)) {
      alert("One of your inputs is too long");
    } else {
      const newCombosArray = generateCombos(newUtensilsArray);

      setMaxCombos(Math.ceil(newCombosArray.length / 2));

      setRankingType("hurry");

      setUtensilsArray(newUtensilsArray);
      setCombosArray(newCombosArray);

      localStorage.setItem(
        "maxCombos",
        String(Math.ceil(newCombosArray.length / 2)),
      );
      localStorage.setItem("rankingType", "hurry");
      localStorage.setItem("utensilsArray", JSON.stringify(newUtensilsArray));
      localStorage.setItem("combosArray", JSON.stringify(newCombosArray));

      setNextCombo(
        newCombosArray,
        newUtensilsArray,
        currentComboIndex,
        maxCombos,
      );

      setFlowView("selection");
    }
  }

  function onConcentrate(usableUtensilsArray: Utensil[]) {
    const newUtensilsArray = usableUtensilsArray.filter(
      (u) => u.title.trim() == "",
    );
    localStorage.setItem("utensilInput", JSON.stringify(newUtensilsArray));

    if (newUtensilsArray.length < 2) {
      alert("Enter a list of things or choose a set to rank");
    } else if (newUtensilsArray.some((u) => u.title.length > 200)) {
      alert("One of your inputs is too long");
    } else {
      const newCombosArray = generateCombos(newUtensilsArray);

      setMaxCombos(newCombosArray.length);

      setRankingType("concentrate");

      setUtensilsArray(newUtensilsArray);
      setCombosArray(newCombosArray);

      localStorage.setItem("maxCombos", String(newCombosArray.length));
      localStorage.setItem("rankingType", "concentrate");
      localStorage.setItem("utensilsArray", JSON.stringify(newUtensilsArray));
      localStorage.setItem("combosArray", JSON.stringify(newCombosArray));

      setNextCombo(
        newCombosArray,
        newUtensilsArray,
        currentComboIndex,
        maxCombos,
      );

      setFlowView("selection");
    }
  }

  const [starterSets, setStarterSets] = useState<Set[]>([]);
  const [discoverableSets, setDiscoverableSets] = useState<Set[]>([]);

  useEffect(() => {
    async function getDiscoverableSets() {
      const userSetsData = await fetchDiscoverableUserSets();

      if (userSetsData) {
        setDiscoverableSets(userSetsData);
      }
    }

    getDiscoverableSets();

    setStarterSets(shuffle(STARTER_SETS).toSpliced(1, 0, RANDOM_SET));
  }, []);

  return (
    <>
      <CommonHead />

      {/* confirm to restart modal */}
      <ConfirmModal
        visibility={confirmRestartModalVisibility}
        titleText="Are you sure want to restart?"
        subtitleText={confirmRestartModalSubtext}
        primaryButtonText="Restart"
        secondaryButtonText="Cancel"
        onConfirm={() => {
          setFlowView("start");
          setCurrentComboIndex(-1);
          setWinnersHistory([]);

          const newUtensilsArray = utensilsArray.map((utensil) => ({
            title: utensil.title,
            score: 0,
            wins: 0,
            losses: 0,
          }));
          if (newUtensilsArray.length % 2 !== 0)
            newUtensilsArray.push({
              title: "",
              score: 0,
              wins: 0,
              losses: 0,
            });
          setUtensilsArray(newUtensilsArray);
          localStorage.setItem("combosArray", JSON.stringify([]));
          localStorage.setItem("utensilsArray", JSON.stringify([]));
          localStorage.setItem("winnersHistory", JSON.stringify([]));
          localStorage.setItem("rankingType", "");
          localStorage.setItem("maxCombos", "1");

          setConfirmRestartModalVisibility(false);
        }}
        onCancel={() => {
          setConfirmRestartModalVisibility(false);
        }}
      />

      <div className="flex w-full items-center justify-center pb-16">
        <div className="min-h-screen w-full lg:min-h-[88.3vh]">
          {flowView === "start" && (
            <Heading
              icon={faPlusCircle}
              rotateIcon
              title="Create"
              tabs={[
                {
                  title: "Create new set",
                  onClick: () => {
                    setCreateView("new");
                  },
                  active: createView === "new",
                },
                {
                  title: "Choose set",
                  onClick: () => {
                    setCreateView("choose");
                  },
                  active: createView === "choose",
                },
              ]}
            />
          )}

          {createView === "new" ? (
            <div className={`${flowView === "start" ? "" : "hidden"} section`}>
              {/* start screen - create new set */}
              <label
                className="mb-0.5 block px-1.5 text-xs text-neutral-500 md:text-sm"
                htmlFor="set-name-input-label"
              >
                Name for this set
              </label>
              <input
                type="text"
                placeholder="Common types of pickles"
                className="w-full rounded-lg border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm outline-none transition placeholder:text-neutral-500/50 hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base"
                id="set-name-input-label"
                value={setNameInput}
                onChange={(e) => {
                  setSetNameInput(e.target.value);
                  localStorage.setItem(
                    "setNameInput",
                    JSON.stringify(e.target.value),
                  );
                }}
                maxLength={50}
              />

              <label className="mb-0.5 mt-4 block px-1.5 text-xs text-neutral-500 md:text-sm">
                Items to rank
              </label>
              <div className="grid grid-cols-2 divide-x-2 divide-y-2 divide-solid divide-neutral-400/40 overflow-hidden rounded-lg border-2 border-neutral-400/40 [&>*:nth-child(2)]:!border-t-0">
                {/* [&>*:nth-child(4n)]:bg-neutral-500/10 dark:[&>*:nth-child(4n)]:bg-neutral-500/25 [&>*:nth-child(4n+1)]:bg-neutral-500/10 dark:[&>*:nth-child(4n+1)]:bg-neutral-500/25 */}
                {utensilsArray.map((utensil, i) => {
                  return (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Thing ${i + 1}`}
                      className="w-full bg-transparent px-3.5 py-2 text-sm outline-none transition placeholder:text-neutral-500/50 odd:!border-l-0 even:!border-r-0 hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base"
                      value={utensil.title}
                      onChange={(e) => {
                        const newUtensilsArray = [...utensilsArray];
                        newUtensilsArray[i].title = e.target.value;

                        setUtensilsArray(newUtensilsArray);
                        localStorage.setItem(
                          "utensilInput",
                          JSON.stringify(newUtensilsArray),
                        );
                      }}
                      maxLength={50}
                    />
                  );
                })}
              </div>

              <button
                className="mt-2 w-full rounded-md bg-neutral-400/20 p-2 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:mt-3 md:p-3 md:text-base"
                onClick={() => {
                  if (utensilsArray.length > 500) {
                    alert(
                      "Item limit reached. You can only have a maximum of 500 items to rank.",
                    );
                    return;
                  }

                  const newUtensilsArray = [
                    ...utensilsArray,
                    { title: "", score: 0, wins: 0, losses: 0 },
                    { title: "", score: 0, wins: 0, losses: 0 },
                    { title: "", score: 0, wins: 0, losses: 0 },
                    { title: "", score: 0, wins: 0, losses: 0 },
                  ];

                  setUtensilsArray(newUtensilsArray);
                  localStorage.setItem(
                    "utensilInput",
                    JSON.stringify(newUtensilsArray),
                  );
                }}
              >
                Add more items
              </button>

              <div className="mt-2 flex gap-2 md:mt-3 md:gap-3">
                <button
                  onClick={() => onHurry(utensilsArray)}
                  className="group relative w-full overflow-hidden rounded-md bg-orange-500/90 px-3 py-4 text-neutral-50 transition hover:bg-orange-500/80 active:bg-orange-500/70 dark:text-black lg:py-6"
                >
                  <FontAwesomeIcon
                    icon={faBolt}
                    className="absolute -left-4 top-1/2 block -translate-y-1/2 transform text-7xl text-orange-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md dark:text-orange-800/50 sm:text-8xl md:left-0 lg:text-9xl"
                    aria-hidden
                  />
                  <span className="block text-right text-sm font-medium sm:text-center md:text-base">
                    Hurry
                  </span>
                  <span className="block text-right text-xs text-white/60 dark:text-black/50 sm:text-center md:text-sm">
                    Quicker session
                  </span>
                </button>
                <button
                  onClick={() => onConcentrate(utensilsArray)}
                  className="group relative w-full overflow-hidden rounded-md bg-blue-500/90 px-3 py-4 text-neutral-50 transition hover:bg-blue-500/80 active:bg-blue-500/70 dark:text-black lg:py-6"
                >
                  <FontAwesomeIcon
                    icon={faBullseye}
                    className="absolute -left-7 top-1/2 block -translate-y-1/2 transform text-7xl text-blue-200/50 transition duration-300 group-hover:scale-105 group-hover:drop-shadow-md dark:text-blue-800/50 sm:text-8xl md:-left-3 lg:text-9xl"
                    aria-hidden
                  />
                  <span className="block text-right text-sm font-medium sm:text-center md:text-base">
                    Concentrate
                  </span>
                  <span className="block text-right text-xs text-white/60 dark:text-black/50 sm:text-center md:text-sm">
                    More accurate
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className={flowView === "start" ? "" : "hidden"}>
              {/* start screen - choose existing set */}
              {discoverableSets.length > 0 ? (
                <div className="wide-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...discoverableSets].map((set, index1) => (
                    <SetBoard
                      key={index1}
                      miniView
                      set={{
                        id: set.id,
                        name: set.name,
                        utensils: set.utensils,
                        username: set.username,
                        createdAt: set.createdAt,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <h2 className="animate-pulse text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
                  Loading community sets...
                </h2>
              )}

              <div className="my-10 flex w-full items-center border-b-2 border-neutral-400/30 md:my-12" />

              <div className="wide-section grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...starterSets].map((set, index1) => (
                  <SetBoard
                    key={index1}
                    miniView
                    set={{
                      id: set.id,
                      name: set.name,
                      utensils: set.utensils,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* selection process screen */}
          <div
            className={`${flowView === "selection" ? "" : "hidden"} absolute left-1/2 top-0 mt-48 w-[85vw] -translate-x-1/2 md:left-1/2 md:top-1/2 md:mt-0 md:w-auto md:-translate-x-1/2 md:-translate-y-1/2`}
          >
            <p className="mb-4 text-pretty px-2 text-center text-xs text-neutral-500 dark:text-neutral-400 md:text-sm">
              <FontAwesomeIcon
                icon={faBookmark}
                className={`${
                  rankingType === "hurry"
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-blue-500 dark:text-blue-400"
                } mr-1.5 md:mr-2`}
                aria-hidden
              />
              Progress auto-saved. It is safe to leave and continue later.
            </p>

            <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
              <button
                ref={firstOptionRef}
                className="flex min-h-[10rem] w-full items-center justify-center rounded-2xl border-b-[6px] border-t-2 border-b-black/15 border-t-white/35 bg-orange-500/90 p-6 text-white shadow-md shadow-orange-500/40 transition duration-200 hover:scale-100 hover:bg-orange-500/90 hover:shadow-md hover:shadow-orange-500/40 active:scale-[0.98] active:bg-orange-500/80 active:shadow-none active:hover:bg-orange-500/70 dark:border-b-black/30 dark:border-t-white/20 md:hover:scale-[1.02] md:hover:bg-orange-500/80 md:hover:shadow-lg md:hover:shadow-orange-500/40 md:active:scale-100 md:active:shadow-none lg:h-[15rem] lg:w-[25rem] lg:p-8 xl:h-[18rem] xl:w-[30rem]"
                onClick={() => {
                  const updatedUtensilsArray = [...utensilsArray].map(
                    (item, index) => {
                      // add 1 to wins and add 1 to score for first option
                      if (index === combosArray[currentComboIndex][0]) {
                        return {
                          ...item,
                          score: item.score !== undefined ? item.score + 1 : -1,
                          wins: item.wins !== undefined ? item.wins + 1 : -1,
                        };
                        // add 1 to losses and remove 1 from score for second option
                      } else if (index === combosArray[currentComboIndex][1]) {
                        return {
                          ...item,
                          score: item.score !== undefined ? item.score - 1 : -1,
                          losses:
                            item.losses !== undefined ? item.losses + 1 : -1,
                        };
                      }
                      return item;
                    },
                  );
                  setUtensilsArray(updatedUtensilsArray);
                  localStorage.setItem(
                    "utensilsArray",
                    JSON.stringify(updatedUtensilsArray),
                  );
                  setWinnersHistory((ogArray) => [...ogArray, 0]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 0]),
                  );

                  setNextCombo(
                    combosArray,
                    updatedUtensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 0],
                  );
                }}
              >
                <span className="line-clamp-3 overflow-ellipsis text-center text-2xl font-semibold lg:line-clamp-4 lg:text-3xl/[2.5rem] xl:py-1 xl:text-4xl/[3rem]">
                  {firstOption}
                </span>
              </button>
              <button
                ref={secondOptionRef}
                className="flex min-h-[10rem] w-full items-center justify-center rounded-2xl border-b-[6px] border-t-2 border-b-black/15 border-t-white/35 bg-blue-500/90 p-6 text-white shadow-md shadow-blue-500/40 transition duration-200 hover:scale-100 hover:bg-blue-500/90 hover:shadow-md hover:shadow-blue-500/40 active:scale-[0.98] active:bg-blue-500/80 active:shadow-none active:hover:bg-blue-500/70 dark:border-b-black/30 dark:border-t-white/20 md:hover:scale-[1.02] md:hover:bg-blue-500/80 md:hover:shadow-lg md:hover:shadow-blue-500/40 md:active:scale-100 md:active:shadow-none lg:h-[15rem] lg:w-[25rem] lg:p-8 xl:h-[18rem] xl:w-[30rem]"
                onClick={() => {
                  const updatedUtensilsArray = [...utensilsArray].map(
                    (item, index) => {
                      // add 1 to wins and add 1 to score for second option
                      if (index === combosArray[currentComboIndex][1]) {
                        return {
                          ...item,
                          score: item.score !== undefined ? item.score + 1 : -1,
                          wins: item.wins !== undefined ? item.wins + 1 : -1,
                        };
                        // add 1 to losses and remove 1 from score for first option
                      } else if (index === combosArray[currentComboIndex][0]) {
                        return {
                          ...item,
                          score: item.score !== undefined ? item.score - 1 : -1,
                          losses:
                            item.losses !== undefined ? item.losses + 1 : -1,
                        };
                      }
                      return item;
                    },
                  );
                  setUtensilsArray(updatedUtensilsArray);
                  localStorage.setItem(
                    "utensilsArray",
                    JSON.stringify(updatedUtensilsArray),
                  );
                  setWinnersHistory((ogArray) => [...ogArray, 1]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 1]),
                  );

                  setNextCombo(
                    combosArray,
                    updatedUtensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 1],
                  );
                }}
              >
                <span className="line-clamp-3 overflow-ellipsis text-center text-2xl font-semibold lg:line-clamp-4 lg:text-3xl/[2.5rem] xl:py-1 xl:text-4xl/[3rem]">
                  {secondOption}
                </span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 lg:mt-6">
              <button
                ref={previousOptionRef}
                className={`h-8 w-8 rounded-full bg-neutral-400/20 px-3 py-1.5 transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 lg:h-auto lg:w-32 lg:flex-1 lg:rounded-md ${
                  currentComboIndex < 1
                    ? "pointer-events-none cursor-not-allowed opacity-70"
                    : ""
                }`}
                onClick={() => {
                  if (currentComboIndex > 0) {
                    if (winnersHistory[currentComboIndex - 1] != 2) {
                      // if not skipped
                      setUtensilsArray((prevArray) => {
                        const newUtensilsArray = [...prevArray].map(
                          (item, index) => {
                            // undo previous action by removing 1 from wins and removing 1 from score for the previous winner
                            if (
                              index ===
                              combosArray[currentComboIndex - 1][
                                winnersHistory[currentComboIndex - 1]
                              ]
                            ) {
                              return {
                                ...item,
                                score:
                                  item.score !== undefined
                                    ? item.score - 1
                                    : -1,
                                wins:
                                  item.wins !== undefined ? item.wins - 1 : -1,
                              };
                              // undo previous action by removing 1 from losses and adding 1 to score for the previous loser
                            } else if (
                              index ===
                              combosArray[currentComboIndex - 1][
                                Math.abs(
                                  winnersHistory[currentComboIndex - 1] - 1,
                                )
                              ]
                            ) {
                              return {
                                ...item,
                                score:
                                  item.score !== undefined
                                    ? item.score + 1
                                    : -1,
                                losses:
                                  item.losses !== undefined
                                    ? item.losses - 1
                                    : -1,
                              };
                            }
                            return item;
                          },
                        );

                        localStorage.setItem(
                          "utensilsArray",
                          JSON.stringify(newUtensilsArray),
                        );

                        return newUtensilsArray;
                      });
                    }

                    setWinnersHistory((ogArray) => ogArray.slice(0, -1));
                    localStorage.setItem(
                      "winnersHistory",
                      JSON.stringify([...winnersHistory].slice(0, -1)),
                    );

                    setPrevCombo(combosArray, utensilsArray);
                  }
                }}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faBackward}
                    className="text-sm lg:mr-2"
                    aria-labelledby="previous-button-text"
                  />
                  <span className="hidden lg:inline" id="previous-button-text">
                    Previous
                  </span>
                </div>
              </button>
              <button
                className="h-8 w-8 rounded-full bg-neutral-400/20 px-3 py-1.5 transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 lg:h-auto lg:w-32 lg:flex-[0.5] lg:rounded-md"
                onClick={() => {
                  setConfirmRestartModalSubtext(
                    "If you restart, you'll lose all of your progress so far in this ranking.",
                  );
                  setConfirmRestartModalVisibility(true);
                }}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faRotateRight}
                    className="text-sm lg:mr-2"
                    aria-labelledby="restart-button-text"
                  />
                  <span className="hidden lg:inline" id="restart-button-text">
                    Restart
                  </span>
                </div>
              </button>
              <button
                ref={skipOptionRef}
                className="h-8 w-8 rounded-full bg-neutral-400/20 px-3 py-1.5 transition hover:bg-neutral-400/30 hover:shadow-sm active:bg-neutral-400/40 active:shadow-none dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 lg:h-auto lg:w-32 lg:flex-1 lg:rounded-md"
                onClick={() => {
                  setWinnersHistory((ogArray) => [...ogArray, 2]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 2]),
                  );

                  setNextCombo(
                    combosArray,
                    utensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 2],
                  );
                }}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faForward}
                    className="text-sm lg:mr-2"
                    aria-labelledby="skip-button-text"
                  />
                  <span className="hidden lg:inline" id="skip-button-text">
                    Skip
                  </span>
                </div>
              </button>
            </div>

            {/* progress bar */}
            <div className="mt-6 flex items-center justify-center">
              {[...Array(maxCombos)].map((_, i) => (
                <div
                  key={i}
                  className={`group relative h-3 flex-1 border-neutral-800/10 first:rounded-l-full last:rounded-r-full last:border-r-0 dark:border-neutral-200/10 ${winnersHistory[i] === 0 ? "bg-orange-500/60 dark:bg-orange-400/60" : winnersHistory[i] === 1 ? "bg-blue-500/60 dark:bg-blue-400/60" : i === currentComboIndex ? "bg-neutral-400/50" : "bg-neutral-400/30"} ${maxCombos > 250 ? "border-0" : maxCombos > 100 ? "border-r-[0.25px] md:border-r-[0.5px] lg:border-r-[1px]" : "border-r md:border-r-[1.5px] lg:border-r-2"}`}
                >
                  <div
                    className={`${i < currentComboIndex ? "invisible-fade group-hover:visible-fade" : "hidden"} absolute bottom-4 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-md border-2 border-neutral-400/40 bg-neutral-50 p-2 text-center text-xs shadow-sm dark:bg-black md:text-sm`}
                  >
                    <div className="flex gap-3 px-1 text-neutral-500 dark:text-neutral-400">
                      <p>Pair {i + 1}</p>
                      <p
                        className={`${winnersHistory[i] === 2 ? "" : "hidden"} w-full text-right italic`}
                      >
                        Skipped
                      </p>
                    </div>
                    {i < currentComboIndex ? (
                      <div className="mt-1 flex flex-col gap-0.5">
                        <p
                          className={`${
                            winnersHistory[i] != 2 &&
                            utensilsArray[combosArray[i][winnersHistory[i]]][
                              "title"
                            ] === utensilsArray[combosArray[i][0]]["title"]
                              ? "bg-orange-400/60 dark:bg-orange-500/60"
                              : ""
                          } rounded-md px-2 py-0.5 text-left`}
                        >
                          {utensilsArray[combosArray[i][0]]["title"]}
                        </p>
                        <p
                          className={`${
                            winnersHistory[i] != 2 &&
                            utensilsArray[combosArray[i][winnersHistory[i]]][
                              "title"
                            ] === utensilsArray[combosArray[i][1]]["title"]
                              ? "bg-blue-400/60 dark:bg-blue-500/60"
                              : ""
                          } rounded-md px-2 py-0.5 text-left`}
                        >
                          {utensilsArray[combosArray[i][1]]["title"]}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <p
                    className={`${i === currentComboIndex ? "" : "hidden"} absolute left-1/2 top-4 -translate-x-1/2 transform whitespace-nowrap text-center text-xs text-neutral-600 dark:text-neutral-400 md:text-sm`}
                  >
                    {currentComboIndex + 1} / {maxCombos}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* final ranking screen */}
          <div
            className={`${flowView === "ranking" ? "" : "hidden"} mt-24 md:mt-48`}
          >
            <div className="max-h-screen w-full overflow-hidden">
              <div className="section mb-10 lg:mb-12">
                <RankingBoard
                  ranking={{
                    id: -1,
                    rankedUtensils: utensilsArray,
                    name: "Your final ranking",
                    type: rankingType,
                  }}
                  index1={0} // rankingPlace starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the ranking
                  showAllUtensils
                  savedRankings={[]}
                />

                <p className="mt-1 text-pretty px-2 text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={`${
                      rankingType === "hurry"
                        ? "text-orange-500 dark:text-orange-400"
                        : "text-blue-500 dark:text-blue-400"
                    } mr-2`}
                    aria-hidden
                  />
                  This ranking has been saved.
                </p>

                <div className="mt-4 flex gap-2 lg:mt-6">
                  <button
                    onClick={() => {
                      setConfirmRestartModalSubtext(
                        profile
                          ? "This ranking has already been saved, so it will not be lost."
                          : "This ranking has been saved, but you won't to see the full ranking unless you create an account.",
                      );
                      setConfirmRestartModalVisibility(true);
                    }}
                    className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      className="mr-1.5 text-xs md:mr-2 md:text-sm"
                      aria-labelledby="restart-button-text-2"
                    />
                    <span id="restart-button-text-2">Restart</span>
                  </button>

                  <Link
                    href="/rankings"
                    className="flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-sm transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:px-3 md:py-2 md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className="mr-1.5 text-xs md:mr-2 md:text-sm"
                      aria-labelledby="all-rankings-button-text"
                    />
                    <span id="all-rankings-button-text">See all rankings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
