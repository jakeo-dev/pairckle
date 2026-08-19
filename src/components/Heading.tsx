import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Heading(props: {
  text: string;
  subtext1?: string;
  subtext2?: string;
  icon?: IconDefinition;
  rotateIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  childrenDivClassName?: string;
  subtextClassName?: string;
  tabs?: { title: string; href: string; active?: boolean }[];
}) {
  return (
    <div className="bg-gradient-to-r from-orange-300 to-blue-300 dark:from-orange-800 dark:to-blue-800">
      <div className="relative mb-12 flex h-64 w-full items-center justify-center border-b-2 border-neutral-400/10 bg-gradient-to-b from-white/40 via-white/50 to-neutral-50 pt-24 dark:border-neutral-500/10 dark:from-black/40 dark:via-black/50 dark:to-black md:h-72">
        <div className="section flex items-center gap-2 md:gap-3">
          <div className={`flex items-start gap-3 md:gap-4 ${props.className}`}>
            {props.icon && (
              <FontAwesomeIcon
                icon={props.icon}
                className={`text-2xl text-neutral-600/50 dark:text-neutral-400/50 md:text-4xl ${props.rotateIcon ? "rotate-90" : ""}`}
              />
            )}
            <div>
              <h1
                className={`text-2xl leading-6 text-neutral-900 dark:text-neutral-50 md:text-3xl ${gabarito.className}`}
              >
                {props.text.split("\\n").map((t, i) => {
                  return (
                    <span key={i} className="block">
                      {t}
                    </span>
                  );
                })}
              </h1>
              <div
                className={`mt-1 flex gap-2 md:gap-2.5 ${props.subtextClassName}`}
              >
                {props.subtext1 && (
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 md:text-sm">
                    {props.subtext1}
                  </p>
                )}
                {props.subtext2 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 md:text-sm">
                    {props.subtext2}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={`ml-auto ${props.childrenDivClassName}`}>
            {props.children}
          </div>
        </div>

        <div
          className={`section absolute bottom-0 flex items-end justify-start gap-1.5 ${gabarito.className}`}
        >
          {props.tabs?.map((tab) => {
            return (
              <Link
                key={tab.title}
                href={tab.href}
                className={`group mb-2 line-clamp-1 break-all rounded-full px-3 py-1 text-sm font-medium leading-6 transition md:px-4 md:py-1 md:text-lg ${tab.active ? "bg-neutral-400/25 active:bg-neutral-400/35 dark:bg-neutral-600/25 dark:active:bg-neutral-600/35" : "hover:bg-neutral-400/25 active:bg-neutral-400/35 dark:hover:bg-neutral-600/25 dark:active:bg-neutral-600/35"} `}
              >
                {tab.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
