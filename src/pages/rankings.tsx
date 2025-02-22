import Head from "next/head";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Rankings() {
  const [savedRankings, setSavedRankings] = useState<
    {
      rankingName: string;
      rankedUtensils: { title: string; score: number }[];
    }[]
  >([]);

  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(savedRankings.length).fill(1);

  useEffect(() => {
    setSavedRankings(JSON.parse(localStorage.getItem("savedRankings") ?? "[]"));
  }, []);

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

    // sort alphabetically
    return a.title.localeCompare(b.title);
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pairckle: Saved rankings</title>
        <meta property="og:title" content="Pairckle: Saved rankings" />
        <meta
          property="og:description"
          content="Easily rank your favorite things through simple pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="w-full h-full flex justify-center items-center mt-48 px-4 pb-16">
          <div className={savedRankings.length < 1 ? "hidden" : ""}>
            <div
              className={`grid grid-cols-1 ${
                savedRankings.length != 1 ? "lg:grid-cols-2" : ""
              } gap-6 lg:gap-8 w-full`}
            >
              {[...savedRankings].map((ranking, index1) => (
                <div className="w-80 lg:w-96" key={index1}>
                  <div className="flex gap-2 items-end px-2 mb-1">
                    <h2 className="font-medium w-full lg:line-clamp-1 overflow-ellipsis">
                      {ranking["rankingName"]}
                    </h2>
                    <button
                      className="w-min flex justify-end items-center h-min text-sm text-right bg-gray-400/20 rounded-full hover:text-red-500 active:text-red-600 transition px-1.5 py-1"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete " +
                              ranking["rankingName"] +
                              "?"
                          )
                        ) {
                          const newSavedRankings = savedRankings.filter(
                            (r) => r !== ranking
                          );
                          setSavedRankings(newSavedRankings);
                          localStorage.setItem(
                            "savedRankings",
                            JSON.stringify(newSavedRankings)
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        aria-label={`Delete ${ranking["rankingName"]}`}
                      />
                    </button>
                  </div>
                  <ul className="h-[13.5rem] lg:h-[21.5rem] overflow-y-auto border-gray-400/40 border-2 rounded-lg">
                    {/* create shallow copy of ranking["rankedUtensils"] (so it wont actually change the ranking["rankedUtensils"] variable), sort utensils by their score */}
                    {[...ranking["rankedUtensils"]]
                      .sort(sortUtensils)
                      .map((utensil, index2) => (
                        <li
                          key={index2}
                          // make the utensil a darker color if the place is odd (multiple utensils can have the same place)
                          className={`flex items-center justify-center first:rounded-t-md last:rounded-b-md px-2 py-1 ${
                            [...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 - 1
                            ] &&
                            [...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 - 1
                            ]["score"] == utensil["score"]
                              ? (rankingPlaces[index1] - 1) % 2 !== 0
                                ? "bg-gray-400/20"
                                : ""
                              : rankingPlaces[index1] % 2 !== 0
                              ? "bg-gray-400/20"
                              : ""
                          }`}
                        >
                          {/* shows place in ranking */}
                          <span className="text-xs lg:text-sm font-semibold">
                            {[...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 - 1
                            ] &&
                            [...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 - 1
                            ]["score"] == utensil["score"]
                              ? rankingPlaces[index1] - 1
                              : rankingPlaces[index1]++}
                            .
                          </span>
                          {/* show "(tie)" if tied */}
                          <span
                            className={`text-xs lg:text-sm mr-1.5 ${
                              ([...ranking["rankedUtensils"]].sort(
                                sortUtensils
                              )[index2 - 1] &&
                                [...ranking["rankedUtensils"]].sort(
                                  sortUtensils
                                )[index2 - 1]["score"] == utensil["score"]) ||
                              ([...ranking["rankedUtensils"]].sort(
                                sortUtensils
                              )[index2 + 1] &&
                                [...ranking["rankedUtensils"]].sort(
                                  sortUtensils
                                )[index2 + 1]["score"] == utensil["score"])
                                ? "ml-1.5"
                                : ""
                            }`}
                          >
                            {([...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 - 1
                            ] &&
                              [...ranking["rankedUtensils"]].sort(sortUtensils)[
                                index2 - 1
                              ]["score"] == utensil["score"]) ||
                            ([...ranking["rankedUtensils"]].sort(sortUtensils)[
                              index2 + 1
                            ] &&
                              [...ranking["rankedUtensils"]].sort(sortUtensils)[
                                index2 + 1
                              ]["score"] == utensil["score"])
                              ? "(tie)"
                              : ""}
                          </span>
                          <span className="w-full">{utensil["title"]}</span>
                          <span className="text-right ml-3">
                            {utensil["score"]}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={savedRankings.length < 1 ? "" : "hidden"}>
            <h2 className="text-gray-600 text-3xl">
              {`You haven't saved any rankings yet...`}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
