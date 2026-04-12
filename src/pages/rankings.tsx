import CommonHead from "@/components/CommonHead";
import ConfirmModal from "@/components/ConfirmModal";
import RankingBoard from "@/components/RankingBoard";
import { Ranking } from "@/types";
import { randomElement, shuffle } from "@/utilities";
import { useEffect, useState } from "react";

export default function Rankings() {
  const [savedRankings, setSavedRankings] = useState<Ranking[]>([]);

  const [currentRanking, setCurrentRanking] = useState<Ranking>({
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
        titleText={`Are you sure you want to delete "${currentRanking.rankingName}"?`}
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
              <RankingBoard
                key={index1}
                className="mb-8 md:mb-10"
                ranking={ranking}
                onReRank={(event) => {
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
                        ranking.rankedUtensils.map((utensil) => utensil.title),
                      ).join("\n"),
                    );
                  }
                }}
                onEditTitle={() => {
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
                    ranking.rankingName.includes("New ranking #")
                      ? randomNewRankingName
                      : ranking.rankingName,
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
                      rankingDate: ranking.rankingDate,
                      rankingType: ranking.rankingType,
                      rankedUtensils: ranking.rankedUtensils,
                    };

                    setSavedRankings(rankingsArray);

                    localStorage.setItem(
                      "savedRankings",
                      JSON.stringify(rankingsArray),
                    );
                  }
                }}
                onDelete={() => {
                  setCurrentRanking(ranking);
                  setConfirmDeleteModalVisibility(true);
                }}
                index1={index1}
              />
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
