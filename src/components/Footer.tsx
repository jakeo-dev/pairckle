import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } z-10 bg-neutral-100 dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-800 dark:border-t-neutral-800 w-full p-3 lg:p-4 mt-auto lg:mt-0`}
    >
      <div className="flex justify-center items-center text-xs lg:text-sm text-center">
        <a
          className="hover:drop-shadow-md active:drop-shadow-none transition flex items-center"
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
          className="text-neutral-800 hover:text-neutral-600 active:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:active:text-neutral-500 transition"
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
      </div>
    </footer>
  );
}
