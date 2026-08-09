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
  icon: IconDefinition;
  rotateIcon?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-r from-orange-300 to-blue-300 dark:from-orange-800 dark:to-blue-800">
      <div className="mb-12 flex w-full items-center border-b-2 border-neutral-400/10 bg-gradient-to-b from-white/40 via-white/50 to-neutral-50 pb-8 pt-28 dark:border-neutral-500/10 dark:from-black/40 dark:via-black/50 dark:to-black md:pb-12 md:pt-48">
        <div className="section flex items-center gap-2 md:gap-3">
          <div className="flex items-start gap-3 md:gap-3.5">
            <FontAwesomeIcon
              icon={props.icon}
              className={`text-2xl text-neutral-600/50 dark:text-neutral-400/50 md:text-3xl ${props.rotateIcon ? "rotate-90" : ""}`}
            />
            <div>
              <h1
                className={`text-xl leading-6 text-neutral-900 dark:text-neutral-50 md:text-2xl ${gabarito.className}`}
              >
                {props.text}
              </h1>
              <div className="mt-1 flex gap-2 md:gap-2.5">
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

          <div className="ml-auto">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
