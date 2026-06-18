import CommonHead from "@/components/CommonHead";
import { STARTER_SETS } from "@/constants";
import { randomElement } from "@/utilities";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [currentSets, setCurrentSets] = useState<
    {
      setName: string;
      utensilSet: {
        title: string;
      }[];
    }[]
  >();
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    setCurrentSets([
      randomElement(STARTER_SETS),
      randomElement(STARTER_SETS),
      randomElement(STARTER_SETS),
      randomElement(STARTER_SETS),
      randomElement(STARTER_SETS),
    ]);

    let startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= 3000) {
        startTime = Date.now();

        setTranslateY(0);

        setCurrentSets((prev) =>
          prev?.slice(1).concat(randomElement(STARTER_SETS)),
        );
      } else {
        setTranslateY(-(elapsedTime / 3000) * (9 * 4)); // each item is h-8, 8*4px
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CommonHead />

      <div className="min-h-screen bg-gradient-to-br from-orange-200 to-blue-200 dark:from-orange-950 dark:to-blue-950">
        <div className="mx-auto mt-48 w-[85rem] px-8 md:w-[60rem]">
          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="min-w-[26rem]">
              <h1 className="mt-8 text-4xl font-bold text-neutral-900 dark:text-neutral-50 md:text-7xl md:leading-[0.9]">
                Rank anything
              </h1>
              <p className="mt-8 text-neutral-700 dark:text-neutral-300 md:text-lg">
                Pairckle makes it easy to create definitive rankings using
                pairwise comparisons.
              </p>
              <div className="group mt-12 flex rotate-[-0.5deg] flex-col gap-4">
                {/* <input
                  type="text"
                  placeholder="Rank anything..."
                  className="flex-1 rounded-full bg-neutral-100 px-5 py-4 text-neutral-900 shadow-md transition placeholder:text-neutral-500 hover:-translate-y-0.5 hover:bg-white focus:-translate-y-0.5 focus:bg-white focus:outline-none dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-300 dark:placeholder:text-neutral-400 dark:hover:bg-neutral-900 dark:focus:bg-neutral-900"
                /> */}
                <div
                  className={`${gabarito.className} max-h-32 w-full overflow-hidden rounded-3xl bg-neutral-100 pl-5 shadow-md transition dark:border-neutral-600 dark:bg-neutral-950`}
                >
                  <div>
                    <div
                      className="flex flex-col overflow-hidden"
                      style={{
                        transform: `translateY(${translateY}px)`,
                      }}
                    >
                      {currentSets?.map((set, i) => (
                        <p
                          key={i}
                          className={`w-75 h-9 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium text-stone-700 transition dark:text-stone-300 ${i == 2 ? "group-hover:text-orange-600 group-hover:dark:text-orange-400" : ""}`}
                        >
                          {set?.setName}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-orange-500 px-5 py-4 font-medium text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-md hover:shadow-orange-500/30 active:translate-y-0"
                    href="/create"
                    onClick={() => {
                      if (
                        localStorage.getItem("combosArray") &&
                        localStorage.getItem("combosArray") !== "[]"
                      ) {
                        // prevent setting utensilInput if there's already ranking in progress
                      } else {
                        localStorage.setItem(
                          "utensilInput",
                          currentSets?.[2]?.utensilSet
                            ?.map((utensil) => utensil.title)
                            .join("\n") || "",
                        );
                      }
                    }}
                  >
                    <span className="relative z-10">Rank it!</span>
                    <div className="animate-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Link>
                  <Link
                    className="flex h-12 min-w-fit items-center rounded-full border-2 border-neutral-400 px-5 py-4 font-medium transition hover:-translate-y-0.5 hover:bg-neutral-400 hover:text-white hover:shadow-md active:translate-y-0 dark:border-neutral-300 dark:hover:bg-neutral-300 dark:hover:text-black"
                    href="/create"
                  >
                    <span>Make your own</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="fade-edges-bottom -mt-6 max-h-screen animate-wiggle overflow-hidden">
              <Image
                src="/pairckle-best-cereals-2.png"
                alt="Ranking of the best cereals"
                width={1796 / 2}
                height={928 / 2}
                className="rounded-xl border-2 border-neutral-200 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
