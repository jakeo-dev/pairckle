import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function CreateRankingModal({
  visibility,
  onCancel,
}: {
  visibility: boolean;
  onCancel?: () => void;
}) {
  return (
    <div
      className={`fixed top-0 left-0 z-30 flex h-full w-full items-center justify-center overflow-auto bg-black/50 ${
        visibility ? "visible-fade" : "invisible-fade"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel?.();
      }}
      tabIndex={0}
    >
      <div className="relative w-[90vw] rounded-xl bg-neutral-100 px-8 py-8 shadow-md md:max-w-xl lg:p-10 dark:border-2 dark:border-neutral-800 dark:bg-black">
        <button
          className="absolute top-7 right-8 cursor-pointer text-lg transition hover:text-neutral-500 active:text-neutral-400 dark:active:text-neutral-600"
          onClick={() => {
            onCancel?.();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1 className="pr-4 text-lg font-medium text-pretty md:text-xl">
          Create a ranking
        </h1>
        <p className="mt-4 text-sm text-pretty md:text-base">
          Either choose from a wide range of sets or create your own from
          scratch to start ranking.
        </p>
        <div className="float-right mt-6 flex gap-2">
          <Link
            className="flex items-center rounded-full border-2 border-neutral-400/40 bg-transparent px-5 py-2 text-sm transition hover:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
            href="/sets"
            onClick={() => {
              onCancel?.();
            }}
          >
            Find an existing set
          </Link>
          <Link
            className="flex items-center rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 md:text-base dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70"
            href="/create"
            onClick={() => {
              onCancel?.();
            }}
          >
            Create your own
          </Link>
        </div>
      </div>
    </div>
  );
}
