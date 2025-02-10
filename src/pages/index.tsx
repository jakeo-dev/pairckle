import Head from "next/head";
import ResponsiveTextArea from "@/components/ResponsiveTextArea";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBookmark,
  faBullseye,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [startVisibility, setStartVisibility] = useState<string>("visibleFade");
  const [selectionVisibility, setSelectionVisibility] =
    useState<string>("invisibleFade");
  const [rankVisibility, setRankVisibility] = useState<string>("invisibleFade");

  const [currentCombo, setCurrentCombo] = useState<number[]>([-1, -1]);
  const [firstOption, setFirstOption] = useState<string>();
  const [secondOption, setSecondOption] = useState<string>();

  const [maxCombos, setMaxCombos] = useState<number>(1);

  const [utensilInput, setUtensilInput] = useState<string>("");
  const [utensilsArray, setUtensilsArray] = useState<
    {
      title: string;
      score: number;
    }[]
  >([{ title: "", score: 0 }]);

  const [combosArray, setCombosArray] = useState<number[][]>([[]]);

  function sortUtensils(
    a: {
      title: string;
      score: number;
    },
    b: {
      title: string;
      score: number;
    }
  ) {
    // sort by score, highest to lowest
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    const aIndex = utensilsArray.indexOf(a);
    const bIndex = utensilsArray.indexOf(b);

    // sort by how the utensils were inputted, lower index to higher index
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // sort alphabetically
    return a.title.localeCompare(b.title);
  }

  function generateCombos(
    array: {
      title: string;
      score: number;
    }[]
  ) {
    const combinations: number[][] = [];

    for (const utensil1 of array) {
      const firstUtensil = array.indexOf(utensil1);

      for (const utensil2 of array) {
        const secondUtensil = array.indexOf(utensil2);

        if (
          // checks if combo is the same utensil twice
          firstUtensil != secondUtensil &&
          // checks if duplicate combos in other orders already exists in combinations
          !combinations
            .map((combo) => JSON.stringify(combo))
            .includes(JSON.stringify([secondUtensil, firstUtensil]))
        ) {
          combinations.push([firstUtensil, secondUtensil]);
        }
      }
    }

    // shuffles order of numbers in each combo
    combinations.forEach((combo) => shuffle(combo));

    return combinations;
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

  function setRandomCombo(
    combosArray: number[][],
    utensilsArray: {
      title: string;
      score: number;
    }[]
  ) {
    if (getNumCombos(utensilsArray.length) - combosArray.length < maxCombos) {
      // gets random combo
      const randomCombo =
        combosArray[Math.floor(Math.random() * combosArray.length)];
      setCurrentCombo(randomCombo);

      // set options to the randomly selected combo
      setFirstOption(utensilsArray[randomCombo[0]]["title"]);
      setSecondOption(utensilsArray[randomCombo[1]]["title"]);

      // remove selected random combo so it cant be selected again
      setCombosArray(combosArray.filter((combo) => combo !== randomCombo));
    } else {
      // done with all combos
      setSelectionVisibility("invisibleFade");
      setRankVisibility("visibleFade");
    }
  }

  function getNumCombos(numUtensils: number) {
    let sum = 0;
    for (let i = 1; i < numUtensils; i++) {
      sum += i;
    }
    return sum;
  }

  function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pairckle</title>
        <meta property="og:title" content="Pairckle" />
        <meta
          property="og:description"
          content="Easily rank your favorite things through simple pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      <div className="flex justify-center items-center min-h-screen">
        <div className="relative pb-16">
          <div
            className={`${startVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 lg:mt-0`}
          >
            <label className="block text-black/60 text-xs lg:text-sm px-2">
              Enter a list of things separated by line or comma
            </label>
            <ResponsiveTextArea
              value={utensilInput}
              onInput={(e) => setUtensilInput(e.currentTarget.value)}
              className="min-h-[17rem] max-h-[35vh] lg:max-h-[46vh] w-[85vw] lg:w-96" // 1 line = 2.125 rem
              placeholder="Enter a list here..."
              maxLength={-1}
              required={true}
            />
            <div className="flex gap-2 mt-0.5">
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
                      });
                    }

                    const newCombosArray = generateCombos(newUtensilsArray);

                    setMaxCombos(Math.ceil(newCombosArray.length / 2));

                    setUtensilsArray(newUtensilsArray);
                    setCombosArray(newCombosArray);
                    setRandomCombo(newCombosArray, newUtensilsArray);

                    setSelectionVisibility("visibleFade");
                    setStartVisibility("invisibleFade");
                  }
                }}
                className="w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md transition px-3 py-4 lg:py-6"
              >
                <FontAwesomeIcon
                  icon={faBolt}
                  className="block text-3xl text-orange-500 mx-auto"
                />
                <span className="block mt-2">Hurry</span>
                <span className="block text-sm text-gray-800">
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
                      });
                    }

                    const newCombosArray = generateCombos(newUtensilsArray);

                    setMaxCombos(newCombosArray.length);

                    setUtensilsArray(newUtensilsArray);
                    setCombosArray(newCombosArray);
                    setRandomCombo(newCombosArray, newUtensilsArray);

                    setSelectionVisibility("visibleFade");
                    setStartVisibility("invisibleFade");
                  }
                }}
                className="w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md transition px-3 py-4 lg:py-6"
              >
                <FontAwesomeIcon
                  icon={faBullseye}
                  className="block text-3xl text-blue-500 mx-auto"
                />
                <span className="block mt-2">Concentrate</span>
                <span className="block text-sm text-gray-800">
                  More accurate results
                </span>
              </button>
            </div>
          </div>

          <div
            className={`${selectionVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
              <button
                className="w-[20rem] lg:w-[25rem] lg:h-[12rem] xl:w-[30rem] xl:h-[14rem] rounded-2xl text-white bg-orange-500/90 hover:bg-orange-500/80 active:bg-orange-500/70 shadow-sm hover:shadow-md active:shadow-none flex justify-center items-center p-8 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[0]) {
                        return { ...item, score: item.score + 1 };
                      }
                      return item;
                    });
                  });
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-3xl xl:text-4xl font-semibold text-center">
                  {firstOption}
                </span>
              </button>
              <div className="lg:-mb-2 xl:-mb-4">
                <button
                  className="flex lg:block lg:w-20 lg:h-20 rounded-full lg:border-4 border-gray-500/30 bg-gray-500/20 lg:bg-transparent hover:bg-gray-500/10 active:hover:bg-gray-500/30 shadow-sm hover:shadow-md active:shadow-none px-3 py-2 lg:p-2 transition mx-auto"
                  onClick={() => {
                    setRandomCombo(combosArray, utensilsArray);
                  }}
                >
                  <span className="lg:text-lg">Skip</span>
                </button>
              </div>
              <button
                className="w-[20rem] lg:w-[25rem] lg:h-[12rem] xl:w-[30rem] xl:h-[14rem] rounded-2xl text-white bg-blue-500/90 hover:bg-blue-500/80 active:bg-blue-500/70 shadow-sm hover:shadow-md active:shadow-none flex justify-center items-center p-8 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[1]) {
                        return { ...item, score: item.score + 1 };
                      }
                      return item;
                    });
                  });
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-3xl xl:text-4xl font-semibold text-center">
                  {secondOption}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center">
              <progress
                className="progress-bar w-full h-2 mt-6"
                value={
                  (getNumCombos(utensilsArray.length) -
                    combosArray.length -
                    1) /
                  (maxCombos == getNumCombos(utensilsArray.length)
                    ? getNumCombos(utensilsArray.length)
                    : Math.ceil(getNumCombos(utensilsArray.length) / 2))
                }
              ></progress>
            </div>
            <h3 className="text-center mt-2">
              Pair {getNumCombos(utensilsArray.length) - combosArray.length} /{" "}
              {maxCombos == getNumCombos(utensilsArray.length)
                ? getNumCombos(utensilsArray.length)
                : Math.ceil(getNumCombos(utensilsArray.length) / 2)}
            </h3>
          </div>

          <div
            className={`${rankVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="flex w-full">
              <span className="block text-black/60 text-xs lg:text-sm px-2">
                Element
              </span>
              <span className="block w-full text-right text-black/60 text-xs lg:text-sm px-2">
                Number of matchups won
              </span>
            </div>
            <div className="w-max overflow-y-auto border-gray-400/40 border-2 rounded-lg thin-scrollbar">
              <ul className="min-h-[17rem] max-h-[35vh] lg:max-h-[46vh] w-80 lg:w-[30rem]">
                {/* create shallow copy of utensilsArray (so it wont actually change the utensilsArray variable), sort utensils by their score, display them as a horizoontal list */}
                {[...utensilsArray].sort(sortUtensils).map((utensil, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-center odd:bg-gray-400/20 first:rounded-t-md last:rounded-b-md px-2.5 lg:px-3 py-1.5 lg:py-2"
                  >
                    <span className="text-lg lg:text-xl w-full">
                      {utensil["title"]}
                    </span>
                    <span className="lg:text-lg font-semibold text-right ml-4">
                      {utensil["score"]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                setRankVisibility("invisibleFade");
                setStartVisibility("visibleFade");
              }}
              className="w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md h-min transition px-3 py-2 mt-2"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-sm mr-2" />
              Restart
            </button>
            <button
              onClick={() => {
                //const randomRankingName = "New ranking #" + (savedRankings.length + 1);

                const randomRankingName =
                  randomElement(["Best", "Greatest", "Top"]) +
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
                    "jalapeno poppers",
                    "stuffed mushrooms",
                    "deviled eggs",
                    "bruschettas",
                    "caprese salads",
                    "chicken tenders",
                  ]) +
                  " " +
                  randomElement([
                    "of all time",
                    "ever",
                    "of the year",
                    "of the century",
                    "in history",
                    "in the country",
                    "in the world",
                    "on Earth",
                  ]);

                const rankingNameInput = prompt(
                  "Enter a title for this ranking",
                  randomRankingName
                );
                let rankingName = "";
                if (rankingNameInput !== null) {
                  rankingName = rankingNameInput;

                  const savedRankingsArray = JSON.parse(
                    localStorage.getItem("savedRankings") ?? "[]"
                  );

                  const rankingsArray = Array.isArray(savedRankingsArray)
                    ? savedRankingsArray
                    : [];

                  rankingsArray.unshift({
                    rankingName: rankingName,
                    rankedUtensils: [...utensilsArray].sort(sortUtensils),
                  });

                  localStorage.setItem(
                    "savedRankings",
                    JSON.stringify(rankingsArray)
                  );
                }
              }}
              className="w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md h-min transition px-3 py-2 mt-2"
            >
              <FontAwesomeIcon icon={faBookmark} className="text-sm mr-2" />
              Save this ranking
            </button>
            {/* <button
              onClick={() => {
                let text =
                  "Ranking from Pairckle \nhttps://pairckle.jakeo.dev \n\n";
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
              className="w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md h-min transition px-3 py-2 mt-2"
            >
              Share
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
