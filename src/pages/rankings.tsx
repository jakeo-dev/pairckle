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
        <title>Pairckle</title>
        <meta property="og:title" content="Pairckle" />
        <meta
          property="og:description"
          content="Easily rank your favorite things through simple pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      <div className="min-h-screen lg:min-h-full">
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
                      className="w-min flex justify-end items-center h-min text-sm text-right bg-gray-400/20 rounded-md hover:text-red-500 active:text-red-600 transition px-1.5 py-0.5"
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
                      <FontAwesomeIcon icon={faXmark} className="mr-1" />
                      Delete
                    </button>
                  </div>
                  <ul className="h-[13.5rem] lg:h-[21.5rem] overflow-y-auto border-gray-400/40 border-2 rounded-lg">
                    {/* create shallow copy of ranking["rankedUtensils"] (so it wont actually change the ranking["rankedUtensils"] variable), sort utensils by their score, display them as a horizoontal list */}
                    {[...ranking["rankedUtensils"]]
                      .sort(sortUtensils)
                      .map((utensil, index2) => (
                        <li
                          key={index2}
                          className="flex items-center justify-center odd:bg-gray-400/20 first:rounded-t-md last:rounded-b-md px-2 py-1"
                        >
                          <span className="w-full">{utensil["title"]}</span>
                          <span className="font-semibold text-right ml-3">
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
              You haven't saved any rankings yet...
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
