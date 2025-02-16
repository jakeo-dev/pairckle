import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  return (
    <footer className="bg-gray-400/10 fixed bottom-0 left-0 w-full p-3 md:p-4">
      <div className="flex justify-center items-center text-xs md:text-sm text-center">
        <a
          className="hover:drop-shadow-md active:drop-shadow-none transition"
          href="https://jakeo.dev"
          target="_blank"
        >
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
            className="w-[3.25rem] md:w-16"
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
          />
        </a>
      </div>
    </footer>
  );
}
