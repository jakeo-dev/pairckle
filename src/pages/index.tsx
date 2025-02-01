import ResponsiveTextArea from "@/components/ResponsiveTextArea";
import { useState } from "react";

export default function Home() {
  const [startVisibility, setStartVisibility] = useState<string>("visibleFade");
  const [selectionVisibility, setSelectionVisibility] =
    useState<string>("invisibleFade");
  const [utensilsVisibility, setUtensilsVisibility] =
    useState<string>("invisibleFade");

  const [currentCombo, setCurrentCombo] = useState<number[]>([-1, -1]);
  const [firstOption, setFirstOption] = useState<string>();
  const [secondOption, setSecondOption] = useState<string>();

  const [utensilInput, setUtensilInput] = useState<string>("");
  const [utensilsArray, setUtensilsArray] = useState<
    {
      title: string;
      score: number;
    }[]
  >([{ title: "", score: 0 }]);

  const [combosArray, setCombosArray] = useState<number[][]>([[]]);

  function generateCombos(
    array: {
      title: string;
      score: number;
    }[]
  ) {
    let combinations: number[][] = [];

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

    // shuffles order of combos
    combinations = shuffle(combinations);
    // shuffles order of numbers in each combo
    combinations.forEach((combo) => shuffle(combo));

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

  function setRandomCombo(
    combosArray: number[][],
    utensilsArray: {
      title: string;
      score: number;
    }[]
  ) {
    if (combosArray.length > 0) {
      const randomCombo =
        combosArray[Math.floor(Math.random() * combosArray.length)];

      setCurrentCombo(randomCombo);

      // set options to the randomly selected combo
      setFirstOption(utensilsArray[randomCombo[0]]["title"]);
      setSecondOption(utensilsArray[randomCombo[1]]["title"]);

      // remove selected random combo so it cant be selected again
      setCombosArray(combosArray.filter((combo) => combo !== randomCombo));
    } else {
      setFirstOption("");
      setSecondOption("");
      alert("DONE!");
    }
  }

  function getNumCombos(numUtensils: number) {
    let sum = 0;
    for (let i = 1; i < numUtensils; i++) {
      sum += i;
    }
    return sum;
  }
  // 1: 0 possible combos
  // 2: 1 possible combo
  // 3: 3 possible combos
  // 4: 6 possible combos
  // 5: 10 possible combos
  // 6: 15 possible combos
  // 7: 21 possible combos
  // 8: 28 possible combo
  // 9: 36 possible combos
  // 10: 45 possible combos
  // 11: 55 possible combos
  // 12: 66 possible combos

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="absolute top-0 flex w-full pt-6 px-8">
          <h1 className="text-center text-4xl font-bold mr-8">Paircise</h1>
          <div className={`${utensilsVisibility} w-max overflow-x-auto pt-2`}>
            <ul className="flex whitespace-nowrap space-x-4 scrollbar-hide">
              {utensilsArray.map((utensil, index) => (
                <li
                  key={index}
                  className="bg-gray-500/30 rounded-md px-2 py-0.5 last:mr-4"
                >
                  {utensil["title"]}: {utensil["score"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative">
          <div
            className={`${startVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <ResponsiveTextArea
              value={utensilInput}
              onInput={(e) => setUtensilInput(e.currentTarget.value)}
              className="min-h-[17rem] max-h-[55vh] lg:max-h-[70vh] w-[26rem]" // 1 line = 2.125 rem
              placeholder="Enter a list of things separated by line..."
              maxLength={-1}
              required={true}
            />
            <button
              onClick={() => {
                if (
                  utensilInput.trim() == "" ||
                  utensilInput.trim().split("\n").length < 2
                ) {
                  alert("Enter a list of things separated by line");
                } else {
                  const newUtensilsArray = [];

                  for (const utensilTitle of utensilInput.trim().split("\n")) {
                    newUtensilsArray.push({
                      title: utensilTitle.trim(),
                      score: 0,
                    });
                  }

                  const newCombosArray = generateCombos(newUtensilsArray);

                  setUtensilsArray(newUtensilsArray);
                  setCombosArray(newCombosArray);
                  setRandomCombo(newCombosArray, newUtensilsArray);

                  setSelectionVisibility("visibleFade");
                  setUtensilsVisibility("visibleFade");
                  setStartVisibility("invisibleFade");
                }
              }}
              className="block w-full bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md transition px-3 py-2 mb-1"
            >
              Start
            </button>
          </div>
          <div
            className={`${selectionVisibility} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="flex items-center gap-8">
              <button
                className="w-[30rem] h-[14rem] rounded-2xl text-white bg-orange-500/90 hover:bg-orange-500/80 active:bg-orange-500/70 shadow-sm hover:shadow-md active:shadow-none flex justify-center items-center p-4 transition"
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
                <span className="text-3xl font-semibold text-center">
                  {firstOption}
                </span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-gray-500/30 hover:bg-gray-500/10 active:hover:bg-gray-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">skip</span>
              </button>
              <button
                className="w-[30rem] h-[14rem] rounded-2xl text-white bg-blue-500/90 hover:bg-blue-500/80 active:bg-blue-500/70 shadow-sm hover:shadow-md active:shadow-none flex justify-center items-center p-4 transition"
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
                <span className="text-3xl font-semibold text-center">
                  {secondOption}
                </span>
              </button>
            </div>
            {/* <div className="flex justify-center items-center gap-10 mt-8">
              <button
                className="w-24 h-24 rounded-full border-4 border-orange-500/70 hover:bg-orange-500/10 active:hover:bg-orange-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    // adds +3 to score of selected utensil
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[0])
                        return { ...item, score: item.score + 3 };
                      return item;
                    });
                  });

                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">+3</span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-orange-500/60 hover:bg-orange-500/10 active:hover:bg-orange-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[0]) {
                        return { ...item, score: item.score + 2 };
                      }
                      return item;
                    });
                  });
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">+2</span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-orange-500/40 hover:bg-orange-500/10 active:hover:bg-orange-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition mr-6"
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
                <span className="text-xl">+1</span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-gray-500/30 hover:bg-gray-500/10 active:hover:bg-gray-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">+0</span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-blue-500/40 hover:bg-blue-500/10 active:hover:bg-blue-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition ml-6"
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
                <span className="text-xl">+1</span>
              </button>
              <button
                className="w-24 h-24 rounded-full border-4 border-blue-500/60 hover:bg-blue-500/10 active:hover:bg-blue-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[1]) {
                        return { ...item, score: item.score + 2 };
                      }
                      return item;
                    });
                  });
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">+2</span>
              </button>
              {/* <button
                className="w-24 h-24 rounded-full border-4 border-blue-500/70 hover:bg-blue-500/10 active:hover:bg-blue-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
                onClick={() => {
                  setUtensilsArray((prevArray) => {
                    return prevArray.map((item, index) => {
                      if (index === currentCombo[1]) {
                        return { ...item, score: item.score + 3 };
                      }
                      return item;
                    });
                  });
                  setRandomCombo(combosArray, utensilsArray);
                }}
              >
                <span className="text-xl">+3</span>
              </button>
            </div> */}
            {/* <h2 className="text-center mt-4">
              Click how much you prefer either option
            </h2> */}
            <h3 className="text-center mt-2">
              {getNumCombos(utensilsArray.length) - combosArray.length} /{" "}
              {getNumCombos(utensilsArray.length)}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
