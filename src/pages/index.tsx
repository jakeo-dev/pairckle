import CommonHead from "@/components/CommonHead";
import ResponsiveTextArea from "@/components/ResponsiveTextArea";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faBarsStaggered,
  faBolt,
  faBookmark,
  faBullseye,
  faForward,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  // rankingPlace starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the ranking
  let rankingPlace = 1;

  const [startVisibility, setStartVisibility] = useState<string>("visibleFade");
  const [selectionVisibility, setSelectionVisibility] =
    useState<string>("invisibleFade");
  const [finalRankingVisibility, setFinalRankingVisibility] =
    useState<string>("invisibleFade");

  const [confirmRestartModalVisibility, setConfirmRestartModalVisibility] =
    useState<boolean>(false);
  const [confirmRestartModalSubtext, setConfirmRestartModalSubtext] =
    useState<string>(
      "If you restart, you'll lose all of your progress so far in this ranking."
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

  const [utensilInput, setUtensilInput] = useState<string>("");

  // array of utensils (each option inputted) from utensilInput, each starts with a score of 0
  const [utensilsArray, setUtensilsArray] = useState<
    {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }[]
  >([{ title: "", score: 0, wins: 0, losses: 0 }]);

  // randomized array of combos, each number in a combo corresponds to a utensil
  const [combosArray, setCombosArray] = useState<number[][]>([[]]);

  useEffect(() => {
    // set initial input empty if not already saved
    setUtensilInput(localStorage.getItem("utensilInput") ?? "");

    if (
      // dont check for winnersHistory, because it could be null if no decisions have been made yet even though the ranking has been started
      localStorage.getItem("maxCombos") &&
      localStorage.getItem("rankingType") &&
      localStorage.getItem("utensilsArray") &&
      localStorage.getItem("combosArray")
    ) {
      const savedMaxCombos = Number(localStorage.getItem("maxCombos") ?? "1");
      const savedRankingType = localStorage.getItem("rankingType") ?? "";
      const savedUtensilsArray = JSON.parse(
        localStorage.getItem("utensilsArray") ?? "[]"
      );
      const savedCombosArray = JSON.parse(
        localStorage.getItem("combosArray") ?? "[]"
      );
      const savedWinnersHistory = JSON.parse(
        localStorage.getItem("winnersHistory") ?? "[]"
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
        savedMaxCombos
      );

      setSelectionVisibility("visibleFade");
      setStartVisibility("invisibleFade");
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
        localStorage.getItem("combosArray") == null ||
        localStorage.getItem("combosArray") == "[]"
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

  function sortUtensils(
    a: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    },
    b: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }
  ) {
    // sort by SCORE, highest to lowest
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    // sort by WIN RATE, highest to lowest
    if (b.wins / (b.wins + b.losses) !== a.wins / (a.wins + a.losses)) {
      return b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses);
    }

    // sort by NUMBER OF WINS, highest to lowest
    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    }

    // sort alphabetically
    return a.title.localeCompare(b.title);
  }

  function generateCombos(
    array: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }[]
  ) {
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

  // https://stackoverflow.com/a/2450976
  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function setNextCombo(
    combosArray: number[][],
    utensilsArray: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }[],
    currentComboIndex: number,
    maxCombos: number,
    winnersHistory?: number[] // winnersHistory only needed if setNextCombo is called when the ranking could be finished next combo
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
      setSelectionVisibility("invisibleFade");
      setFinalRankingVisibility("visibleFade");
      setCurrentComboIndex(-1);
      setWinnersHistory([]);
      localStorage.setItem("winnersHistory", JSON.stringify([]));
      localStorage.setItem("combosArray", JSON.stringify([]));
      localStorage.setItem("utensilsArray", JSON.stringify([]));
      localStorage.setItem("maxCombos", "1");
      localStorage.setItem("rankingType", "");

      const savedRankingsArray = JSON.parse(
        localStorage.getItem("savedRankings") ?? "[]"
      );

      const rankingsArray = Array.isArray(savedRankingsArray)
        ? savedRankingsArray
        : [];

      rankingsArray.unshift({
        rankingName: "New ranking #" + (savedRankingsArray.length + 1),
        rankingDate: {
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
          year: new Date().getFullYear(),
        },
        rankingType: rankingType,
        rankedUtensils: [...utensilsArray].sort(sortUtensils),
        rankingCombos: combosArray,
        rankingWinnersHistory: winnersHistory,
      });

      localStorage.setItem("savedRankings", JSON.stringify(rankingsArray));
    }
  }

  function setPrevCombo(
    combosArray: number[][],
    utensilsArray: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }[]
  ) {
    // go to previous combo in array
    const prevComboIndex = currentComboIndex - 1;
    setCurrentComboIndex(prevComboIndex);

    // set options to the selected combo
    setFirstOption(utensilsArray[combosArray[prevComboIndex][0]]["title"]);
    setSecondOption(utensilsArray[combosArray[prevComboIndex][1]]["title"]);
  }

  /* function getNumCombos(numUtensils: number) {
    let sum = 0;
    for (let i = 1; i < numUtensils; i++) {
      sum += i;
    }
    return sum;
  } */

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
          setSelectionVisibility("invisibleFade");
          setFinalRankingVisibility("invisibleFade");
          setStartVisibility("visibleFade");
          setCurrentComboIndex(-1);
          setWinnersHistory([]);
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

      <div className="flex justify-center items-center h-screen lg:min-h-screen">
        <div className="relative w-full h-screen mt-48 md:mt-0">
          {/* utensil input start screen */}
          <div
            className={`${startVisibility} absolute top-0 left-1/2 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-[85vw] md:w-96`}
          >
            <label
              className="block text-black/60 dark:text-white/60 text-xs lg:text-sm text-pretty px-2"
              htmlFor="utensil-input"
            >
              Enter a list of things separated by line or comma
            </label>
            <ResponsiveTextArea
              value={utensilInput}
              onInput={(e) => {
                setUtensilInput(e.currentTarget.value);
                localStorage.setItem("utensilInput", e.currentTarget.value);
              }}
              className="min-h-[20.5rem] max-h-[21rem] md:max-h-[28rem] w-full text-sm leading-6 md:leading-7 md:text-base" // 1 line = 2.125 rem
              placeholder="Enter a list here..."
              maxLength={-1}
              required={true}
              id="utensil-input"
            />
            <Link
              href="/sets"
              className="block w-full bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 rounded-md text-sm lg:text-base text-center transition px-3 py-2 lg:py-3 mt-0.5"
            >
              <FontAwesomeIcon
                icon={faBarsStaggered}
                className="mr-2"
                aria-labelledby="browse-lists-text"
              />
              <span id="browse-lists-text">Browse starter sets</span>
            </Link>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  if (
                    utensilInput.trim() == "" ||
                    (utensilInput.trim().split("\n").length < 2 &&
                      utensilInput.trim().split(",").length < 2)
                  ) {
                    alert("Enter a list of things separated by line or comma");
                  } else {
                    const newUtensilsArray = [];

                    // if input is not separated by lines, then assume its separated by commas
                    // lines trump commas
                    let splitKey = "\n";
                    if (
                      utensilInput.trim().split("\n").length < 2 &&
                      utensilInput.trim().split(",").length > 1
                    ) {
                      splitKey = ",";
                    }

                    for (const utensilTitle of utensilInput
                      .trim()
                      .split(splitKey)) {
                      newUtensilsArray.push({
                        title: utensilTitle.trim(),
                        score: 0,
                        wins: 0,
                        losses: 0,
                      });
                    }

                    const newCombosArray = generateCombos(newUtensilsArray);

                    setMaxCombos(Math.ceil(newCombosArray.length / 2));

                    setRankingType("hurry");

                    setUtensilsArray(newUtensilsArray);
                    setCombosArray(newCombosArray);

                    localStorage.setItem(
                      "maxCombos",
                      String(Math.ceil(newCombosArray.length / 2))
                    );
                    localStorage.setItem("rankingType", "hurry");
                    localStorage.setItem(
                      "utensilsArray",
                      JSON.stringify(newUtensilsArray)
                    );
                    localStorage.setItem(
                      "combosArray",
                      JSON.stringify(newCombosArray)
                    );

                    setNextCombo(
                      newCombosArray,
                      newUtensilsArray,
                      currentComboIndex,
                      maxCombos
                    );

                    setSelectionVisibility("visibleFade");
                    setStartVisibility("invisibleFade");
                  }
                }}
                className="w-full bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 rounded-md transition px-3 py-4 lg:py-6"
              >
                <div className="flex items-center justify-center lg:block mb-1 lg:mb-0">
                  <FontAwesomeIcon
                    icon={faBolt}
                    className="block text-lg md:text-xl lg:text-3xl text-orange-500 mr-1.5 lg:mx-auto"
                    aria-hidden
                  />
                  <span className="block text-sm md:text-base lg:mt-2">
                    Hurry
                  </span>
                </div>
                <span className="block text-xs md:text-sm text-neutral-800 dark:text-neutral-300">
                  Quicker session
                </span>
              </button>
              <button
                onClick={() => {
                  if (
                    utensilInput.trim() == "" ||
                    (utensilInput.trim().split("\n").length < 2 &&
                      utensilInput.trim().split(",").length < 2)
                  ) {
                    alert("Enter a list of things separated by line or comma");
                  } else {
                    const newUtensilsArray = [];

                    // if input is not separated by lines, then assume its separated by commas
                    // lines trump commas
                    let splitKey = "\n";
                    if (
                      utensilInput.trim().split("\n").length < 2 &&
                      utensilInput.trim().split(",").length > 1
                    ) {
                      splitKey = ",";
                    }

                    for (const utensilTitle of utensilInput
                      .trim()
                      .split(splitKey)) {
                      newUtensilsArray.push({
                        title: utensilTitle.trim(),
                        score: 0,
                        wins: 0,
                        losses: 0,
                      });
                    }

                    const newCombosArray = generateCombos(newUtensilsArray);

                    setMaxCombos(newCombosArray.length);

                    setRankingType("concentrate");

                    setUtensilsArray(newUtensilsArray);
                    setCombosArray(newCombosArray);

                    localStorage.setItem(
                      "maxCombos",
                      String(newCombosArray.length)
                    );
                    localStorage.setItem("rankingType", "concentrate");
                    localStorage.setItem(
                      "utensilsArray",
                      JSON.stringify(newUtensilsArray)
                    );
                    localStorage.setItem(
                      "combosArray",
                      JSON.stringify(newCombosArray)
                    );

                    setNextCombo(
                      newCombosArray,
                      newUtensilsArray,
                      currentComboIndex,
                      maxCombos
                    );

                    setSelectionVisibility("visibleFade");
                    setStartVisibility("invisibleFade");
                  }
                }}
                className="w-full bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 rounded-md transition px-3 py-4 lg:py-6"
              >
                <div className="flex items-center justify-center lg:block mb-1 lg:mb-0">
                  <FontAwesomeIcon
                    icon={faBullseye}
                    className="block text-lg md:text-xl lg:text-3xl text-blue-500 mr-1.5 lg:mx-auto"
                    aria-hidden
                  />
                  <span className="block text-sm md:text-base lg:mt-2">
                    Concentrate
                  </span>
                </div>
                <span className="block text-xs md:text-sm text-neutral-800 dark:text-neutral-300">
                  More accurate
                </span>
              </button>
            </div>
          </div>

          {/* selection process screen */}
          <div
            className={`${selectionVisibility} absolute top-0 left-1/2 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-[85vw] md:w-auto`}
          >
            <p className="text-xs md:text-sm text-center text-neutral-600 dark:text-neutral-400 text-pretty px-2 mb-4">
              <FontAwesomeIcon
                icon={faBookmark}
                className={`${
                  rankingType == "hurry"
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-blue-500 dark:text-blue-400"
                } mr-2`}
                aria-hidden
              />
              Progress auto-saved. It is safe to leave and continue later.
            </p>

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
              <button
                ref={firstOptionRef}
                className="w-full min-h-[10rem] lg:w-[25rem] lg:h-[12rem] xl:w-[30rem] xl:h-[14rem] rounded-2xl text-white bg-orange-500/90 hover:bg-orange-500/90 active:bg-orange-500/80 md:hover:bg-orange-500/80 active:hover:bg-orange-500/70 shadow-sm hover:shadow-sm active:shadow-none md:hover:shadow-md md:active:shadow-none hover:scale-100 active:scale-[0.98] md:hover:scale-[1.02] md:active:scale-100 flex justify-center items-center p-6 lg:p-8 transition duration-200"
                onClick={() => {
                  const updatedUtensilsArray = [...utensilsArray].map(
                    (item, index) => {
                      // add 1 to wins and add 1 to score for first option
                      if (index === combosArray[currentComboIndex][0]) {
                        return {
                          ...item,
                          score: item.score + 1,
                          wins: item.wins + 1,
                        };
                        // add 1 to losses and remove 1 from score for second option
                      } else if (index === combosArray[currentComboIndex][1]) {
                        return {
                          ...item,
                          score: item.score - 1,
                          losses: item.losses + 1,
                        };
                      }
                      return item;
                    }
                  );
                  setUtensilsArray(updatedUtensilsArray);
                  localStorage.setItem(
                    "utensilsArray",
                    JSON.stringify(updatedUtensilsArray)
                  );
                  setWinnersHistory((ogArray) => [...ogArray, 0]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 0])
                  );

                  setNextCombo(
                    combosArray,
                    updatedUtensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 0]
                  );
                }}
              >
                <span className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-center line-clamp-3 lg:line-clamp-4 overflow-ellipsis xl:py-1">
                  {firstOption}
                </span>
              </button>
              <button
                ref={secondOptionRef}
                className="w-full min-h-[10rem] lg:w-[25rem] lg:h-[12rem] xl:w-[30rem] xl:h-[14rem] rounded-2xl text-white bg-blue-500/90 hover:bg-blue-500/90 active:bg-blue-500/80 md:hover:bg-blue-500/80 active:hover:bg-blue-500/70 shadow-sm hover:shadow-sm active:shadow-none md:hover:shadow-md md:active:shadow-none hover:scale-100 active:scale-[0.98] md:hover:scale-[1.02] md:active:scale-100 flex justify-center items-center p-6 lg:p-8 transition duration-200"
                onClick={() => {
                  const updatedUtensilsArray = [...utensilsArray].map(
                    (item, index) => {
                      // add 1 to wins and add 1 to score for second option
                      if (index === combosArray[currentComboIndex][1]) {
                        return {
                          ...item,
                          score: item.score + 1,
                          wins: item.wins + 1,
                        };
                        // add 1 to losses and remove 1 from score for first option
                      } else if (index === combosArray[currentComboIndex][0]) {
                        return {
                          ...item,
                          score: item.score - 1,
                          losses: item.losses + 1,
                        };
                      }
                      return item;
                    }
                  );
                  setUtensilsArray(updatedUtensilsArray);
                  localStorage.setItem(
                    "utensilsArray",
                    JSON.stringify(updatedUtensilsArray)
                  );
                  setWinnersHistory((ogArray) => [...ogArray, 1]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 1])
                  );

                  setNextCombo(
                    combosArray,
                    updatedUtensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 1]
                  );
                }}
              >
                <span className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-center line-clamp-3 lg:line-clamp-4 overflow-ellipsis xl:py-1">
                  {secondOption}
                </span>
              </button>
            </div>

            <div className="flex gap-2 justify-center items-center mt-4 lg:mt-6">
              <button
                ref={previousOptionRef}
                className="w-8 h-8 lg:w-32 lg:h-auto rounded-full lg:rounded-md bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 hover:shadow-sm active:shadow-none px-3 py-1.5 transition"
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
                                score: item.score - 1,
                                wins: item.wins - 1,
                              };
                              // undo previous action by removing 1 from losses and adding 1 to score for the previous loser
                            } else if (
                              index ===
                              combosArray[currentComboIndex - 1][
                                Math.abs(
                                  winnersHistory[currentComboIndex - 1] - 1
                                )
                              ]
                            ) {
                              return {
                                ...item,
                                score: item.score + 1,
                                losses: item.losses - 1,
                              };
                            }
                            return item;
                          }
                        );

                        localStorage.setItem(
                          "utensilsArray",
                          JSON.stringify(newUtensilsArray)
                        );

                        return newUtensilsArray;
                      });
                    }

                    setWinnersHistory((ogArray) => ogArray.slice(0, -1));
                    localStorage.setItem(
                      "winnersHistory",
                      JSON.stringify([...winnersHistory].slice(0, -1))
                    );

                    setPrevCombo(combosArray, utensilsArray);
                  }
                }}
              >
                <div className="flex justify-center items-center">
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
                className="w-8 h-8 lg:w-32 lg:h-auto rounded-full lg:rounded-md bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 hover:shadow-sm active:shadow-none px-3 py-1.5 transition"
                onClick={() => {
                  setConfirmRestartModalSubtext(
                    "If you restart, you'll lose all of your progress so far in this ranking."
                  );
                  setConfirmRestartModalVisibility(true);
                }}
              >
                <div className="flex justify-center items-center">
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
                className="w-8 h-8 lg:w-32 lg:h-auto rounded-full lg:rounded-md bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 hover:shadow-sm active:shadow-none px-3 py-1.5 transition"
                onClick={() => {
                  setWinnersHistory((ogArray) => [...ogArray, 2]);
                  localStorage.setItem(
                    "winnersHistory",
                    JSON.stringify([...winnersHistory, 2])
                  );

                  setNextCombo(
                    combosArray,
                    utensilsArray,
                    currentComboIndex,
                    maxCombos,
                    [...winnersHistory, 2]
                  );
                }}
              >
                <div className="flex justify-center items-center">
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

            <div className="flex items-center justify-center mt-6">
              <progress
                className="progress-bar w-[20rem] sm:w-[25rem] lg:w-full h-2"
                value={currentComboIndex / maxCombos}
              />
            </div>
            <p className="text-sm md:text-base text-center mt-2">
              Pair {currentComboIndex + 1} / {maxCombos}
            </p>
          </div>

          {/* final ranking screen */}
          <div
            className={`${finalRankingVisibility} absolute top-0 left-1/2 -translate-x-1/2 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-[85vw] md:w-auto`}
          >
            <div className="flex w-full px-2 mb-1">
              <h2 className="text-sm md:text-base leading-6 font-medium lg:line-clamp-1 overflow-ellipsis">
                Final ranking
              </h2>
            </div>
            <div className="h-max overflow-y-auto overflow-x-hidden border-neutral-400/40 border-2 rounded-lg thin-scrollbar">
              <ul className="max-h-[19rem] md:max-h-[28.25rem] w-full md:w-[45rem]">
                {/* create shallow copy of utensilsArray (so it wont actually change the utensilsArray variable), sort utensils by their score */}
                {[...utensilsArray].sort(sortUtensils).map((utensil, index) => (
                  <li
                    key={index}
                    // make the utensil a darker color if the place is odd (multiple utensils can have the same place)
                    className={`flex items-center gap-3 first:rounded-t-md last:rounded-b-md px-2 md:px-2.5 py-1 md:py-1.5 ${
                      [...utensilsArray].sort(sortUtensils)[index - 1] &&
                      [...utensilsArray].sort(sortUtensils)[index - 1][
                        "score"
                      ] == utensil["score"]
                        ? (rankingPlace - 1) % 2 !== 0
                          ? "bg-neutral-500/10 dark:bg-neutral-500/25"
                          : ""
                        : rankingPlace % 2 !== 0
                        ? "bg-neutral-500/10 dark:bg-neutral-500/25"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {/* shows place in ranking */}
                      <span className="text-xs lg:text-sm font-semibold">
                        {[...utensilsArray].sort(sortUtensils)[index - 1] &&
                        [...utensilsArray].sort(sortUtensils)[index - 1][
                          "score"
                        ] == utensil["score"]
                          ? rankingPlace - 1
                          : rankingPlace++}
                        .
                      </span>
                      {/* show "(tie)" if tied */}
                      <span
                        className={`text-xs lg:text-sm text-neutral-700 dark:text-neutral-400 ml-1 md:ml-1.5 ${
                          ([...utensilsArray].sort(sortUtensils)[index - 1] &&
                            [...utensilsArray].sort(sortUtensils)[index - 1][
                              "score"
                            ] == utensil["score"]) ||
                          ([...utensilsArray].sort(sortUtensils)[index + 1] &&
                            [...utensilsArray].sort(sortUtensils)[index + 1][
                              "score"
                            ] == utensil["score"])
                            ? "mr-1 md:mr-1.5"
                            : ""
                        }`}
                      >
                        {([...utensilsArray].sort(sortUtensils)[index - 1] &&
                          [...utensilsArray].sort(sortUtensils)[index - 1][
                            "score"
                          ] == utensil["score"]) ||
                        ([...utensilsArray].sort(sortUtensils)[index + 1] &&
                          [...utensilsArray].sort(sortUtensils)[index + 1][
                            "score"
                          ] == utensil["score"])
                          ? "(tie)"
                          : ""}
                      </span>
                      <p className="w-fit text-sm md:text-base">
                        {utensil["title"]}
                      </p>
                    </div>

                    <div className="relative flex ml-auto">
                      <progress
                        className="win-rate-bar w-32 md:w-72 lg:w-96 appearance-none h-6"
                        value={
                          typeof utensil["wins"] === "number"
                            ? utensil["wins"] /
                              (utensil["wins"] + utensil["losses"])
                            : utensil["score"] / utensilsArray.length
                        }
                      />

                      <div className="absolute inset-0 flex justify-between text-xs lg:text-sm text-white dark:text-black px-1">
                        <span className="px-2 py-1 lg:py-0.5">
                          {typeof utensil["wins"] === "number"
                            ? `${utensil["wins"]} won`
                            : `${utensil["score"]} won`}
                        </span>
                        <span
                          className={`px-2 py-1 lg:py-0.5 
                                  ${
                                    typeof utensil["losses"] === "number"
                                      ? ""
                                      : "hidden"
                                  }
                                `}
                        >
                          {typeof utensil["losses"] === "number"
                            ? `${utensil["losses"]} lost`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden lg:block text-xs md:text-sm text-neutral-600 dark:text-neutral-400 text-pretty px-2 mt-1">
              <FontAwesomeIcon
                icon={faBookmark}
                className={`${
                  rankingType == "hurry"
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-blue-500 dark:text-blue-400"
                } mr-2`}
                aria-hidden
              />
              {`This ranking has been saved. Go to "Your rankings" to see it.`}
            </p>
            <p className="lg:hidden text-xs md:text-sm text-neutral-600 dark:text-neutral-400 text-pretty px-2 mt-1">
              <FontAwesomeIcon
                icon={faBookmark}
                className={`${
                  rankingType == "hurry"
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-blue-500 dark:text-blue-400"
                } mr-2`}
                aria-hidden
              />
              {`This ranking has been saved. Go to "Saved" to see it.`}
            </p>

            <button
              onClick={() => {
                setConfirmRestartModalSubtext(
                  'This ranking has already been saved in "Your rankings," so it will not be lost.'
                );
                setConfirmRestartModalVisibility(true);
              }}
              className="w-full flex justify-center items-center bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 rounded-md h-min text-sm md:text-base transition px-2.5 py-1.5 lg:px-3 lg:py-2 mt-4"
            >
              <FontAwesomeIcon
                icon={faRotateRight}
                className="text-sm mr-2"
                aria-labelledby="restart-button-text-2"
              />
              <span id="restart-button-text-2">Restart</span>
            </button>
            {/* <button
              onClick={() => {
                let text = "Pairckle ranking \nhttps://pairckle.jakeo.dev \n\n";
                [...utensilsArray]
                  .sort(sortUtensils)
                  .forEach(
                    (utensil) =>
                      (text +=
                        "#" +
                        ([...utensilsArray]
                          .sort(sortUtensils)
                          .indexOf(utensil) +
                          1) +
                        " " +
                        utensil.title +
                        "\n")
                  );
                navigator.clipboard.writeText(text);
              }}
              className="w-full bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 rounded-md h-min transition px-3 py-2 mt-2"
            >
              Share
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
