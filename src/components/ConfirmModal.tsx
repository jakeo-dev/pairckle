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
  primaryButtonText: string;
  secondaryButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className={`bg-black/40 flex justify-center items-center fixed top-0 left-0 z-30 w-full h-full overflow-auto ${
        visibility ? "visibleFade" : "invisibleFade"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onCancel();
        }
      }}
      tabIndex={0}
    >
      <div className="bg-gray-200 relative rounded-xl w-11/12 lg:max-w-xl shadow-md px-8 py-8 lg:px-11 lg:py-10">
        <button
          className="absolute top-7 right-8 text-lg hover:text-gray-500 transition"
          onClick={() => {
            onCancel();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1 className="text-xl font-medium pr-4">{titleText}</h1>
        <p className="mt-4">{subtitleText}</p>
        <div className="flex gap-2 mt-6">
          <button
            className="bg-gray-400/30 hover:bg-gray-400/40 active:bg-gray-400/50 rounded-md px-3.5 py-2 transition"
            onClick={onConfirm}
          >
            {primaryButtonText}
          </button>
          <button
            className="bg-transparent hover:bg-gray-400/20 active:bg-gray-400/30 rounded-md border-2 border-gray-500/30 px-3.5 py-2 transition"
            onClick={onCancel}
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
