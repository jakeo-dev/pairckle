import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBullseye,
  faChartSimple,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function Rankings() {
  const [savedRankings, setSavedRankings] = useState<
    {
      rankingName: string;
      rankingDate: { month: number; day: number; year: number };
      rankingType: string;
      rankedUtensils: {
        title: string;
        score: number;
        wins: number;
        losses: number;
      }[];
    }[]
  >([]);

  // each number element in rankingPlaces represents the rankingPlace for each saved ranking; the number starts at 1 and adds 1 for each utensil (if theres not a tie) when going through the corresponding saved ranking
  const rankingPlaces = new Array(savedRankings.length).fill(1);

  const [currentRanking, setCurrentRanking] = useState<{
    rankingName: string;
    rankingDate: { month: number; day: number; year: number };
    rankingType: string;
    rankedUtensils: {
      title: string;
      score: number;
      wins: number;
      losses: number;
    }[];
  }>({
    rankingName: "",
    rankingDate: { month: -1, day: -1, year: -1 },
    rankingType: "",
    rankedUtensils: [
      {
        title: "",
        score: 0,
        wins: 0,
        losses: 0,
      },
    ],
  });

  const [confirmDeleteModalVisibility, setConfirmDeleteModalVisibility] =
    useState<boolean>(false);
  const [errorRankingModalVisibility, setErrorRankingModalVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    setSavedRankings(JSON.parse(localStorage.getItem("savedRankings") ?? "[]"));
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

  function monthName(num: number) {
    if (num == 1) return "January";
    else if (num == 2) return "February";
    else if (num == 3) return "March";
    else if (num == 4) return "April";
    else if (num == 5) return "May";
    else if (num == 6) return "June";
    else if (num == 7) return "July";
    else if (num == 8) return "August";
    else if (num == 9) return "September";
    else if (num == 10) return "October";
    else if (num == 11) return "November";
    else if (num == 12) return "December";
    else return "";
  }

  return (
    <>
      <CommonHead />

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

      {/* error ranking modal */}
      <ConfirmModal
        visibility={errorRankingModalVisibility}
        titleText="Ranking already in progress"
        subtitleText="You already have a ranking in progress. Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="w-full h-full flex justify-center items-center mt-24 md:mt-48 px-6 pb-16">
          <div
            className={`w-full md:w-auto ${
              savedRankings.length < 1 ? "hidden" : ""
            }`}
          >
            {[...savedRankings].map((ranking, index1) => (
              <div className="w-full lg:w-[45rem] mb-8 lg:mb-10" key={index1}>
                <div className="flex gap-3 items-end px-2 mb-0.5 md:mb-1">
                  <h2
                    className={`text-base md:text-lg flex items-center font-medium leading-6 lg:line-clamp-1 overflow-ellipsis ${gabarito.className}`}
                  >
                    <FontAwesomeIcon
                      icon={faBolt}
                      className={`${
                        ranking["rankingType"] == "hurry" ? "" : "hidden"
                      } text-orange-500 dark:text-orange-400 mr-1.5`}
                      aria-label="Type: hurry"
                      title="Type: hurry"
                    />
                    <FontAwesomeIcon
                      icon={faBullseye}
                      className={`${
                        ranking["rankingType"] == "concentrate" ? "" : "hidden"
                      } text-blue-500 dark:text-blue-400 mr-1.5`}
                      aria-label="Type: concentrate"
                      title="Type: concentrate"
                    />
                    {ranking["rankingName"]}
                  </h2>
                  <h3 className="text-xs md:text-sm leading-6 text-neutral-700 dark:text-neutral-400 text-right min-w-max ml-auto">
                    {ranking["rankingDate"]
                      ? `${monthName(ranking["rankingDate"]["month"]).slice(
                          0,
                          3
                        )}. ${ranking["rankingDate"]["day"]}, ${
                          ranking["rankingDate"]["year"]
                        }`
                      : ""}
                  </h3>
                </div>
                <ul className="h-max overflow-y-auto border-neutral-400/40 border-2 rounded-lg">
                  {/* create shallow copy of ranking["rankedUtensils"] (so it wont actually change the ranking["rankedUtensils"] variable), sort utensils by their score */}
                  {[...ranking["rankedUtensils"]]
                    .sort(sortUtensils)
                    .map((utensil, index2) => (
                      <li
                        key={index2}
                        // make the utensil a darker color if the place is odd (multiple utensils can have the same place)
                        className={`flex items-center gap-3 first:rounded-t-md last:rounded-b-md px-2 md:px-2.5 py-1 md:py-1.5 ${
                          [...ranking["rankedUtensils"]].sort(sortUtensils)[
                            index2 - 1
                          ] &&
                          [...ranking["rankedUtensils"]].sort(sortUtensils)[
                            index2 - 1
                          ]["score"] == utensil["score"]
                            ? (rankingPlaces[index1] - 1) % 2 !== 0
                              ? "bg-neutral-500/10 dark:bg-neutral-500/20"
                              : ""
                            : rankingPlaces[index1] % 2 !== 0
                            ? "bg-neutral-500/10 dark:bg-neutral-500/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {/* shows place in ranking */}
                          <span className="text-xs md:text-sm font-semibold">
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
                            className={`text-xs md:text-sm text-neutral-700 dark:text-neutral-400 mr-1 md:mr-1.5 ${
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
                                ? "ml-1 md:ml-1.5"
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
                                : utensil["score"] /
                                  (ranking["rankedUtensils"].length - 1)
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
                <div className="flex gap-2">
                  <Link
                    className="h-min w-full flex justify-center items-center bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 rounded-md text-xs md:text-sm text-left transition px-2.5 py-1.5 mt-2"
                    href="/"
                    onClick={(event) => {
                      if (
                        localStorage.getItem("combosArray") &&
                        localStorage.getItem("combosArray") !== "[]"
                      ) {
                        event.preventDefault();
                        setErrorRankingModalVisibility(true);
                      } else {
                        localStorage.setItem(
                          "utensilInput",
                          shuffle(
                            ranking["rankedUtensils"].map(
                              (utensil) => utensil.title
                            )
                          ).join("\n")
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="text-neutral-800 dark:text-neutral-300 rotate-90 mr-1.5 md:mr-2"
                      aria-labelledby="re-rank-button-text"
                    />
                    <span id="re-rank-button-text">Re-rank</span>
                  </Link>

                  <button
                    className="h-min w-full flex justify-center items-center bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 rounded-md text-xs md:text-sm text-left transition px-2.5 py-1.5 mt-2"
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

                        const rankingsArray = Array.isArray(savedRankingsArray)
                          ? savedRankingsArray
                          : [];

                        rankingsArray[index1] = {
                          rankingName: rankingNewName,
                          rankingDate: ranking["rankingDate"],
                          rankingType: ranking["rankingType"],
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
                      className="text-neutral-800 dark:text-neutral-300 mr-1.5 md:mr-2"
                      aria-labelledby="edit-title-button-text"
                    />
                    <span id="edit-title-button-text">Edit title</span>
                  </button>
                  <button
                    className="h-min w-full flex justify-center items-center bg-neutral-400/20 hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 rounded-md text-xs md:text-sm text-left transition px-2.5 py-1.5 mt-2"
                    onClick={() => {
                      setCurrentRanking(ranking);
                      setConfirmDeleteModalVisibility(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="text-neutral-800 dark:text-neutral-300 mr-1.5 md:mr-2"
                      aria-labelledby="delete-button-text"
                    />
                    <span id="delete-button-text">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={savedRankings.length < 1 ? "" : "hidden"}>
            <h2 className="text-neutral-600 dark:text-neutral-400 text-xl md:text-3xl text-center">
              {`You haven't saved any rankings yet...`}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
