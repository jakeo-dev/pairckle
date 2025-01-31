import { useState } from "react";

export default function Home() {
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

    return shuffle(combinations);
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

  // https://stackoverflow.com/a/2450976
  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
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

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <div>
            <textarea
              placeholder="Enter a list of things separated by line"
              onChange={(e) => setUtensilInput(e.currentTarget.value)}
              value={utensilInput}
              className="border-2 border-gray-300 p-2"
            ></textarea>
            <button
              onClick={() => {
                if (utensilInput.trim() == "") {
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
                }
              }}
              className="bg-green-500 p-2 mb-1"
            >
              CLICK TO START/RESTART
            </button>
          </div>
          <h1 className="text-center text-3xl my-8">Indecisive</h1>
          <div className="flex gap-8">
            <div className="w-[30rem] h-[14rem] text-white bg-orange-500/90 rounded-2xl flex justify-center items-center p-4 transition">
              <h1 className="text-3xl font-semibold text-center">
                {firstOption}
              </h1>
            </div>
            <div className="w-[30rem] h-[14rem] text-white bg-blue-500/90 rounded-2xl flex justify-center items-center p-4 transition">
              <h1 className="text-3xl font-semibold text-center">
                {secondOption}
              </h1>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 mt-8">
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
              className="w-24 h-24 rounded-full border-4 border-orange-500/50 hover:bg-orange-500/10 active:hover:bg-orange-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
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
              className="w-24 h-24 rounded-full border-4 border-orange-500/30 hover:bg-orange-500/10 active:hover:bg-orange-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
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
              className="w-24 h-24 rounded-full border-4 border-gray-300 hover:bg-gray-200 active:bg-gray-300 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
              onClick={() => {
                setRandomCombo(combosArray, utensilsArray);
              }}
            >
              <span className="text-xl">+0</span>
            </button>
            <button
              className="w-24 h-24 rounded-full border-4 border-blue-500/30 hover:bg-blue-500/10 active:hover:bg-blue-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
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
              className="w-24 h-24 rounded-full border-4 border-blue-500/50 hover:bg-blue-500/10 active:hover:bg-blue-500/30 shadow-sm hover:shadow-md active:shadow-none p-2 transition"
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
            <button
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
          </div>
          <h2 className="text-center mt-4">
            Click how much you prefer either option
          </h2>
          <ul>
            {utensilsArray.map((utensil, index) => (
              <li key={index}>
                {utensil["title"]}: {utensil["score"]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
