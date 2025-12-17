import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } z-10 mt-auto w-full border-t-2 border-neutral-200 bg-neutral-100 p-3 dark:border-neutral-800 dark:border-t-neutral-800 dark:bg-neutral-900 lg:mt-0 lg:p-4`}
    >
      <div className="flex items-center justify-center text-center text-xs lg:text-sm">
        <a
          className="flex items-center transition hover:drop-shadow-md active:drop-shadow-none"
          href="https://jakeo.dev"
          target="_blank"
          aria-label="Go to JakeO.dev"
        >
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
            className="w-[3.25rem] dark:hidden lg:w-16"
            alt="JakeO.dev logo"
          />
          <img
            src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark-light.png"
            className="hidden w-[3.25rem] dark:inline lg:w-16"
            alt="JakeO.dev logo"
          />
        </a>
        <span className="mx-3">•</span>
        <a
          className="text-neutral-800 transition hover:text-neutral-600 active:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:active:text-neutral-500"
          href="https://github.com/jakeo-dev/pairckle"
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faGithub}
            className="mr-1 text-xs lg:text-sm"
            aria-hidden
          />
          GitHub
        </a>
      </div>
    </footer>
  );
}
