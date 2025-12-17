import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({
  visibility,
  titleText,
  subtitleText,
  primaryButtonText,
  secondaryButtonText,
  onConfirm,
  onCancel,
}: {
  visibility: boolean;
  titleText: string;
  subtitleText: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      className={`bg-black/50 flex justify-center items-center fixed top-0 left-0 z-30 w-full h-full overflow-auto ${
        visibility ? "visibleFade" : "invisibleFade"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && onCancel) {
          onCancel();
        }
      }}
      tabIndex={0}
    >
      <div className="bg-neutral-100 dark:bg-black dark:border-2 dark:border-neutral-800 relative rounded-xl w-[90vw] md:max-w-xl shadow-md px-8 py-8 lg:p-10">
        <button
          className="absolute top-7 right-8 text-lg hover:text-neutral-500 active:text-neutral-400 dark:active:text-neutral-600 transition"
          onClick={() => {
            if (onCancel) onCancel();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1 className="text-lg md:text-xl font-medium text-pretty pr-4">
          {titleText}
        </h1>
        <p className="text-sm md:text-base text-pretty mt-4">{subtitleText}</p>
        <div className="flex gap-2 float-right mt-6">
          <button
            className={`${
              secondaryButtonText ? "" : "hidden"
            } bg-transparent hover:bg-neutral-400/20 active:bg-neutral-400/30 rounded-md border-2 border-neutral-400/40 text-sm md:text-base px-4 py-2 transition`}
            onClick={onCancel}
          >
            {secondaryButtonText}
          </button>
          <button
            className={`${
              primaryButtonText ? "" : "hidden"
            } bg-neutral-700/90 hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 text-white dark:text-black text-sm md:text-base rounded-md px-4 py-2 transition`}
            onClick={onConfirm}
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
