import Head from "next/head";
import ResponsiveTextArea from "@/components/ResponsiveTextArea";
import { useState } from "react";

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
          /* checks if combo is the same utensil twice */
          firstUtensil != secondUtensil &&
          /* checks if duplicate combos in other orders already exists in combinations */
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

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pairckle</title>
        <meta property="og:title" content="Pairckle" />
        <meta
          property="og:description"
          content="Easily rank your favorite things with simple pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      <div className="flex justify-center items-center min-h-screen">
        <div className="absolute top-0 w-full text-center cursor-default pt-10 px-8">
          <h1 className="block text-5xl font-bold">
            <span className="text-orange-500">Pair</span>
            <span className="text-blue-500">ckle</span>
          </h1>
          <h2 className="block mt-1">
            Create a ranking through simple comparisons
          </h2>
        </div>

        <div className="relative">
          <div
            className={`${startVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <label className="block text-black/60 text-sm px-2">
              Enter a list of things separated by line or comma
            </label>
            <ResponsiveTextArea
              value={utensilInput}
              onInput={(e) => setUtensilInput(e.currentTarget.value)}
              className="min-h-[17rem] max-h-[55vh] lg:max-h-[70vh] w-80 lg:w-96" // 1 line = 2.125 rem
              placeholder="Enter a list of things separated by line or comma..."
              maxLength={-1}
              required={true}
            />
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
              className="block w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md transition px-3 py-2"
            >
              Hurry (quicker session)
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
              className="block w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md transition px-3 py-2 mt-1"
            >
              Concentrate (more accurate results)
            </button>
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
              <div className="lg:-mb-10 xl:-mb-12">
                <button
                  className="flex lg:block lg:w-20 lg:h-20 rounded-full lg:border-4 border-gray-500/30 bg-gray-500/20 lg:bg-transparent hover:bg-gray-500/10 active:hover:bg-gray-500/30 shadow-sm hover:shadow-md active:shadow-none px-3 py-2 lg:p-2 transition mx-auto"
                  onClick={() => {
                    setRandomCombo(combosArray, utensilsArray);
                  }}
                >
                  <span className="lg:text-lg">Skip</span>
                </button>
                <h3 className="lg:text-lg text-center mt-3">
                  {getNumCombos(utensilsArray.length) - combosArray.length} /{" "}
                  {maxCombos == getNumCombos(utensilsArray.length)
                    ? getNumCombos(utensilsArray.length)
                    : Math.ceil(getNumCombos(utensilsArray.length) / 2)}
                </h3>
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
          </div>

          <div
            className={`${rankVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="w-max overflow-y-auto border-gray-400/40 border-2 rounded-lg z-10 thin-scrollbar">
              <ul className="min-h-[17rem] max-h-[55vh] lg:max-h-[70.85vh] w-80 lg:w-96">
                {/* create shallow copy of utensilsArray (so it wont actually change the utensilsArray variable), sort utensils by their score, display them as a horizoontal list */}
                {[...utensilsArray].sort(sortUtensils).map((utensil, index) => (
                  <li
                    key={index}
                    className="flex odd:bg-gray-400/20 first:rounded-t-md last:rounded-b-md px-2 py-1"
                  >
                    <span className="w-full">{utensil["title"]}</span>
                    <span className="font-semibold text-right ml-2">
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
              className="w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md h-min transition px-3 py-2 mt-2"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
