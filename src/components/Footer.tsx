import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } bg-gray-400/10 w-full p-3 lg:p-4 mt-auto lg:mt-0`}
    >
      <div className="flex justify-center items-center text-xs lg:text-sm text-center">
        <a
          className="hover:drop-shadow-md active:drop-shadow-none transition"
          href="https://jakeo.dev"
          target="_blank"
          aria-label="Go to JakeO.dev"
        >
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
            className="w-[3.25rem] lg:w-16 dark:hidden"
            alt="JakeO.dev logo"
          />
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark-light.png"
            className="w-[3.25rem] lg:w-16 hidden dark:inline"
            alt="JakeO.dev logo"
          />
        </a>
        <span className="mx-3">•</span>
        <a
          className="text-gray-800 hover:text-gray-700 active:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400 transition"
          href="https://github.com/jakeo-dev/pairckle"
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faGithub}
            className="text-xs lg:text-sm mr-1"
            aria-hidden
          />
          GitHub
        </a>
        <span className="mx-3">•</span>
        <button
          className="text-gray-800 hover:text-gray-700 active:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300 dark:active:text-gray-400 transition"
          onClick={() => {
            if (localStorage.getItem("theme") === "dark") {
              document.documentElement.classList.remove("dark");
              localStorage.setItem("theme", "light");
            } else {
              document.documentElement.classList.add("dark");
              localStorage.setItem("theme", "dark");
            }
          }}
        >
          <FontAwesomeIcon icon={faSun} className="dark:hidden" />
          <FontAwesomeIcon icon={faMoon} className="hidden dark:inline" />
          <span className="ml-1">Theme</span>
        </button>
      </div>
    </footer>
  );
}
