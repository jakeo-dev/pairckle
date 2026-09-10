import Link from "next/link";
import Image from "next/image";

export default function Footer({ fixed }: { fixed: boolean }) {
  return (
    <footer
      className={`${
        fixed ? "fixed bottom-0" : ""
      } z-10 mt-auto w-full border-t-2 border-neutral-400/15 bg-neutral-400/5 p-4 backdrop-blur-xs md:mt-0`}
    >
      <div className="wide-section text-center text-xs md:text-sm">
        <div className="flex items-center justify-center gap-2.5 md:float-left">
          <a
            className="-mt-0.5 -mr-2 flex items-center drop-shadow-black/50 transition hover:drop-shadow-md active:drop-shadow-none dark:drop-shadow-white/50"
            href="https://jakeo.dev"
            target="_blank"
            aria-label="Go to JakeO.dev"
          >
            <Image
              src="https://www.jakeo.dev/logos/jakeo-wordmark.png"
              className="w-13 md:w-15 dark:hidden"
              alt="JakeO.dev logo"
              width={764}
              height={310}
            />
            <Image
              src="https://www.jakeo.dev/logos/jakeo-wordmark-light.png"
              className="hidden w-13 md:w-15 dark:inline"
              alt="JakeO.dev logo"
              width={764}
              height={310}
            />
          </a>
          <span className="text-neutral-500">Made by a human</span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 md:float-right md:mt-0 md:gap-5">
          <Link className="link" href="/privacy" target="_blank">
            Privacy
          </Link>
          <Link className="link" href="/terms" target="_blank">
            Terms
          </Link>
          <Link className="link" href="/about" target="_blank">
            About
          </Link>
          <a
            className="link"
            href="https://github.com/jakeo-dev/pairckle"
            target="_blank"
          >
            GitHub
          </a>
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
