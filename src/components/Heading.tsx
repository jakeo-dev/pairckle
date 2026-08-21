import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Heading(props: {
  title: string;
  subtitle?: string;
  subtext1?: string;
  subtext2?: string;
  icon?: IconDefinition;
  rotateIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  childrenDivClassName?: string;
  subtextClassName?: string;
  tabs?: {
    title: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}) {
  return (
    <div className="bg-linear-to-r from-orange-300 to-blue-300 dark:from-orange-800 dark:to-blue-800">
      <div
        className={`relative mb-12 flex w-full items-center justify-center border-b-2 border-neutral-400/10 bg-linear-to-b from-white/40 via-white/50 to-neutral-50 pt-24 md:pt-32 dark:border-neutral-500/10 dark:from-black/40 dark:via-black/50 dark:to-black ${props.tabs ? "pb-16 md:pb-24" : "pb-8 md:pb-12"}`}
      >
        <div className="section flex items-center gap-2 md:gap-3">
          <div className={`flex items-start gap-3 md:gap-4 ${props.className}`}>
            {props.icon && (
              <FontAwesomeIcon
                icon={props.icon}
                className={`text-2xl text-neutral-600/50 md:text-4xl dark:text-neutral-400/50 ${props.rotateIcon ? "rotate-90" : ""}`}
              />
            )}
            <div>
              <h1
                className={`text-2xl leading-6 text-neutral-900 md:text-3xl md:leading-10 dark:text-neutral-50 ${gabarito.className}`}
              >
                {props.title.split("\\n").map((t, i) => {
                  return (
                    <span key={i} className="block">
                      {t}
                    </span>
                  );
                })}
              </h1>
              {props.subtitle && (
                <h2 className="mt-4 text-sm font-light text-neutral-600 md:text-base dark:text-neutral-300">
                  {props.subtitle}
                </h2>
              )}
              {(props.subtext1 || props.subtext2) && (
                <div
                  className={`mt-0.5 flex gap-2 md:mt-1 md:gap-2.5 ${props.subtextClassName}`}
                >
                  {props.subtext1 && (
                    <p className="text-xs font-semibold text-neutral-600 md:text-sm dark:text-neutral-300">
                      {props.subtext1}
                    </p>
                  )}
                  {props.subtext2 && (
                    <p className="text-xs text-neutral-500 md:text-sm dark:text-neutral-400">
                      {props.subtext2}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={`ml-auto ${props.childrenDivClassName}`}>
            {props.children}
          </div>
        </div>

        <div
          className={`section absolute bottom-0 flex items-end justify-start gap-2 ${gabarito.className}`}
        >
          {props.tabs?.map((tab, i) => {
            return (
              <div key={i}>
                {tab.href ? (
                  <Link
                    key={tab.title}
                    href={tab.href}
                    className={`group mb-2 line-clamp-1 rounded-full border-2 px-3 py-0.5 text-sm leading-6 break-all transition md:px-3.5 md:py-1 md:text-lg ${tab.active ? "border-transparent bg-neutral-400/25 dark:bg-neutral-500/25" : "border-neutral-400/15 hover:border-transparent hover:bg-neutral-400/20 active:bg-neutral-400/25 dark:hover:bg-neutral-500/20 dark:active:bg-neutral-500/25"}`}
                  >
                    {tab.title}
                  </Link>
                ) : (
                  <button
                    key={tab.title}
                    onClick={tab.onClick}
                    className={`group mb-2 line-clamp-1 cursor-pointer rounded-full border-2 px-3 py-0.5 text-sm leading-6 break-all transition md:px-3.5 md:py-1 md:text-lg ${tab.active ? "border-transparent bg-neutral-400/25 dark:bg-neutral-500/25" : "border-neutral-400/15 hover:border-transparent hover:bg-neutral-400/20 active:bg-neutral-400/25 dark:hover:bg-neutral-500/20 dark:active:bg-neutral-500/25"}`}
                  >
                    {tab.title}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
