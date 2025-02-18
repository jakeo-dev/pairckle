import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } bg-gray-400/10 w-full p-3 md:p-4 mt-auto lg:mt-0`}
    >
      <div className="flex justify-center items-center text-xs md:text-sm text-center">
        <a
          className="hover:drop-shadow-md active:drop-shadow-none transition"
          href="https://jakeo.dev"
          target="_blank"
          aria-label="Go to JakeO.dev"
        >
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
            className="w-[3.25rem] md:w-16"
            alt="JakeO.dev logo"
          />
        </a>
        <span className="mx-2">•</span>
        <a
          className="hover:text-blue-600 underline hover:decoration-wavy hover:decoration-1 transition-all"
          href="https://github.com/jakeo-dev/pairckle"
          target="_blank"
        >
          GitHub
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="md:text-sm ml-1.5"
            aria-hidden
          />
        </a>
      </div>
    </footer>
  );
}
