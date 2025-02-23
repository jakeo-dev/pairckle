import Head from "next/head";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function Rankings() {
  const [savedRankings, setSavedRankings] = useState<
    {
      rankingName: string;
      rankedUtensils: { title: string; score: number }[];
    }[]
  >([]);

  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(savedRankings.length).fill(1);

  const [currentRanking, setCurrentRanking] = useState<{
    rankingName: string;
    rankedUtensils: {
      title: string;
      score: number;
    }[];
  }>({
    rankingName: "",
    rankedUtensils: [
      {
        title: "",
        score: 0,
      },
    ],
  });

  const [confirmDeleteModalVisibility, setConfirmDeleteModalVisibility] =
    useState<boolean>(false);

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

  function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

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

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pairckle: Your rankings</title>
        <meta property="og:title" content="Pairckle: Your rankings" />
        <meta
          property="og:description"
          content="Easily rank your favorite things through simple pairwise comparisons."
        />
        <meta name="theme-color" content="#f97316" />
      </Head>

      {/* confirm to delete modal */}
      <ConfirmModal
        visibility={confirmDeleteModalVisibility}
        titleText={`Are you sure you want to delete "${currentRanking["rankingName"]}"?`}
        subtitleText="This ranking will be lost forever!"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onConfirm={() => {
          const newSavedRankings = savedRankings.filter(
            (r) => r !== currentRanking
          );
          setSavedRankings(newSavedRankings);
          localStorage.setItem(
            "savedRankings",
            JSON.stringify(newSavedRankings)
          );

          setConfirmDeleteModalVisibility(false);
        }}
        onCancel={() => {
          setConfirmDeleteModalVisibility(false);
        }}
      />

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="w-full h-full flex justify-center items-center mt-48 px-4 pb-16">
          <div className={savedRankings.length < 1 ? "hidden" : ""}>
            <div
              className={`grid grid-cols-1 ${
                savedRankings.length != 1 ? "lg:grid-cols-2" : ""
              } gap-8 lg:gap-10 w-full`}
            >
              {[...savedRankings].map((ranking, index1) => (
                <div className="w-80 lg:w-96" key={index1}>
                  <h2 className="font-medium w-full lg:line-clamp-1 overflow-ellipsis px-2 mb-1">
                    {ranking["rankingName"]}
                  </h2>
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
                  <div className="flex gap-2">
                    <Link
                      className="h-min w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md text-sm transition px-2.5 py-1.5 mt-2"
                      href="/"
                      onClick={() => {
                        localStorage.setItem(
                          "utensilInput",
                          shuffle(
                            ranking["rankedUtensils"].map(
                              (utensil) => utensil.title
                            )
                          ).join("\n")
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChartSimple}
                        className="text-gray-800 rotate-90 mr-2"
                        aria-labelledby="re-rank-text"
                      />
                      <span id="re-rank-text">Re-rank</span>
                    </Link>

                    <button
                      className="h-min w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md text-sm transition px-2.5 py-1.5 mt-2"
                      onClick={() => {
                        const randomNewRankingName =
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

                        const rankingNewNameInput = prompt(
                          "Enter a title for this ranking",
                          ranking["rankingName"].includes("New ranking #")
                            ? randomNewRankingName
                            : ranking["rankingName"]
                        );
                        let rankingNewName = "";

                        if (rankingNewNameInput !== null) {
                          rankingNewName = rankingNewNameInput;

                          const savedRankingsArray = JSON.parse(
                            localStorage.getItem("savedRankings") ?? "[]"
                          );

                          const rankingsArray = Array.isArray(
                            savedRankingsArray
                          )
                            ? savedRankingsArray
                            : [];

                          rankingsArray[index1] = {
                            rankingName: rankingNewName,
                            rankedUtensils: ranking["rankedUtensils"],
                          };

                          setSavedRankings(rankingsArray);

                          localStorage.setItem(
                            "savedRankings",
                            JSON.stringify(rankingsArray)
                          );
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-gray-800 mr-2"
                        aria-labelledby="edit-title-text"
                      />
                      <span id="edit-title-text">Edit title</span>
                    </button>
                    <button
                      className="h-min w-full flex justify-center items-center bg-gray-400/20 hover:bg-gray-400/30 active:bg-gray-400/40 rounded-md text-sm transition px-2.5 py-1.5 mt-2"
                      onClick={() => {
                        setCurrentRanking(ranking);
                        setConfirmDeleteModalVisibility(true);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-gray-800 mr-2"
                        aria-labelledby="delete-text"
                      />
                      <span id="delete-text">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={savedRankings.length < 1 ? "" : "hidden"}>
            <h2 className="text-gray-600 text-xl lg:text-3xl text-center">
              {`You haven't saved any rankings yet...`}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
