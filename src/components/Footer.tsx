import Link from "next/link";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } z-10 mt-auto w-full border-t-2 border-neutral-400/15 bg-neutral-400/5 p-3 backdrop-blur-xs lg:mt-0 lg:p-4`}
    >
      <div className="wide-section text-center text-xs lg:text-sm">
        <div className="float-left">
          <a
            className="-mt-0.5 -mr-2 flex items-center transition hover:drop-shadow-md active:drop-shadow-none dark:shadow-white"
            href="https://jakeo.dev"
            target="_blank"
            aria-label="Go to JakeO.dev"
          >
            <img
              src="https://www.jakeo.dev/logos/jakeo-wordmark.png"
              className="w-13 lg:w-15 dark:hidden"
              alt="JakeO.dev logo"
            />
            <img
              src="https://www.jakeo.dev/logos/jakeo-wordmark-light.png"
              className="hidden w-13 lg:w-15 dark:inline"
              alt="JakeO.dev logo"
            />
          </a>
        </div>
        <div className="float-right">
          <Link className="link" href="/privacy" target="_blank">
            Privacy
          </Link>
          <span className="mx-3 text-neutral-400 dark:text-neutral-600">•</span>
          <Link className="link" href="/terms" target="_blank">
            Terms
          </Link>
          <span className="mx-3 text-neutral-400 dark:text-neutral-600">•</span>
          <a
            className="link"
            href="https://github.com/jakeo-dev/pairckle"
            target="_blank"
          >
            GitHub
          </a>
          <span className="mx-3 text-neutral-400 dark:text-neutral-600">•</span>
          <a className="link" href="mailto:support@jakeo.dev" target="_blank">
            Contact
          </a>
        </div>
        {/* <div className="mt-2">
          <p className="text-[0.675rem] text-neutral-500 md:text-xs">
            © {new Date().getFullYear()} Pairckle
          </p>
        </div> */}
      </div>
    </footer>
  );
}
