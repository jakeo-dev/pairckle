import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import Ranking from "@/components/Ranking";
import { Utensil } from "@/types";
import { monthName, randomElement, shuffle } from "@/utilities";
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
      rankedUtensils: Utensil[];
    }[]
  >([]);

  const [currentRanking, setCurrentRanking] = useState<{
    rankingName: string;
    rankingDate: { month: number; day: number; year: number };
    rankingType: string;
    rankedUtensils: Utensil[];
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
            (r) => r !== currentRanking,
          );
          setSavedRankings(newSavedRankings);
          localStorage.setItem(
            "savedRankings",
            JSON.stringify(newSavedRankings),
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
        titleText="You already have a ranking in progress"
        subtitleText="Finish or restart the current ranking before beginning a new one."
        primaryButtonText="Got it"
        onConfirm={() => setErrorRankingModalVisibility(false)}
        onCancel={() => setErrorRankingModalVisibility(false)}
      />

      <div className="min-h-screen lg:min-h-[94.6vh]">
        <div className="mt-24 flex h-full w-full items-center justify-center px-6 pb-16 md:mt-48">
          <div
            className={`w-full md:w-auto ${
              savedRankings.length < 1 ? "hidden" : ""
            }`}
          >
            {[...savedRankings].map((ranking, index1) => (
              <div className="mb-8 w-full md:mb-10 md:w-[45rem]" key={index1}>
                <div className="mb-0.5 flex items-end gap-3 px-2 md:mb-1">
                  <h2
                    className={`flex items-center overflow-ellipsis text-base font-medium leading-6 md:text-lg lg:line-clamp-1 ${gabarito.className}`}
                  >
                    <FontAwesomeIcon
                      icon={
                        ranking["rankingType"] == "hurry" ? faBolt : faBullseye
                      }
                      className={`${
                        ranking["rankingType"] == "hurry"
                          ? "text-orange-500 dark:text-orange-400"
                          : ranking["rankingType"] == "concentrate"
                            ? "text-blue-500 dark:text-blue-400"
                            : "hidden"
                      } mr-1.5`}
                      aria-label={
                        ranking["rankingType"] == "hurry"
                          ? "Type: hurry"
                          : "Type: concentrate"
                      }
                      title={
                        ranking["rankingType"] == "hurry"
                          ? "Type: hurry"
                          : "Type: concentrate"
                      }
                    />
                    {ranking["rankingName"]}
                  </h2>
                  <h3 className="ml-auto min-w-max text-right text-xs leading-6 text-neutral-700 dark:text-neutral-400 md:text-sm">
                    {ranking["rankingDate"]
                      ? `${monthName(ranking["rankingDate"]["month"]).slice(
                          0,
                          3,
                        )}. ${ranking["rankingDate"]["day"]}, ${
                          ranking["rankingDate"]["year"]
                        }`
                      : ""}
                  </h3>
                </div>

                <Ranking ranking={ranking["rankedUtensils"]} index1={index1} />

                <div className="flex gap-2">
                  <Link
                    className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
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
                              (utensil) => utensil.title,
                            ),
                          ).join("\n"),
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="mr-1.5 rotate-90 text-neutral-800 dark:text-neutral-300 md:mr-2"
                      aria-labelledby="re-rank-button-text"
                    />
                    <span id="re-rank-button-text">Re-rank</span>
                  </Link>

                  <button
                    className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
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
                          "jalapeño poppers",
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
                          : ranking["rankingName"],
                      );
                      let rankingNewName = "";

                      if (rankingNewNameInput !== null) {
                        rankingNewName = rankingNewNameInput;

                        const savedRankingsArray = JSON.parse(
                          localStorage.getItem("savedRankings") ?? "[]",
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
                          JSON.stringify(rankingsArray),
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPen}
                      className="mr-1.5 text-neutral-800 dark:text-neutral-300 md:mr-2"
                      aria-labelledby="edit-title-button-text"
                    />
                    <span id="edit-title-button-text">Edit title</span>
                  </button>
                  <button
                    className="mt-2 flex h-min w-full items-center justify-center rounded-md bg-neutral-400/20 px-2.5 py-1.5 text-left text-xs transition hover:bg-neutral-400/30 active:bg-neutral-400/40 dark:bg-neutral-400/25 dark:hover:bg-neutral-400/35 dark:active:bg-neutral-400/45 md:text-sm"
                    onClick={() => {
                      setCurrentRanking(ranking);
                      setConfirmDeleteModalVisibility(true);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="mr-1.5 text-neutral-800 dark:text-neutral-300 md:mr-2"
                      aria-labelledby="delete-button-text"
                    />
                    <span id="delete-button-text">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={savedRankings.length < 1 ? "" : "hidden"}>
            <h2 className="text-center text-xl text-neutral-600 dark:text-neutral-400 md:text-3xl">
              {`You haven't saved any rankings yet...`}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
