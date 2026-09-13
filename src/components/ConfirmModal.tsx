import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({
  visibility,
  titleText,
  subtitleText,
  primaryButtonText,
  primaryButtonTextClicked,
  secondaryButtonText,
  dangerousAction,
  dangerousActionConfirmationInput,
  onConfirm,
  onCancel,
}: {
  visibility: boolean;
  titleText: string;
  subtitleText?: string;
  primaryButtonText?: string;
  primaryButtonTextClicked?: string;
  secondaryButtonText?: string;
  dangerousAction?: boolean;
  dangerousActionConfirmationInput?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const [primaryButtonTextState, setPrimaryButtonTextState] = useState<
    string | undefined
  >(primaryButtonText);
  const [dangerousActionInput, setDangerousActionInput] = useState<string>("");

  return (
    <div
      className={`fixed top-0 left-0 z-30 flex h-full w-full items-center justify-center overflow-auto bg-black/50 ${
        visibility ? "visible-fade" : "invisible-fade"
      }`}
      onKeyDown={(e) => {
        if (onCancel && e.key === "Escape") {
          setDangerousActionInput("");
          onCancel?.();
        }
      }}
      tabIndex={0}
    >
      <div className="relative w-[90vw] rounded-xl bg-neutral-100 px-8 py-8 shadow-md md:max-w-xl lg:p-10 dark:border-2 dark:border-neutral-800 dark:bg-black">
        {onCancel && (
          <button
            className="absolute top-7 right-8 cursor-pointer text-lg transition hover:text-neutral-500 active:text-neutral-400 dark:active:text-neutral-600"
            onClick={() => {
              setDangerousActionInput("");
              onCancel?.();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}

        <h1 className="pr-4 text-lg font-medium text-pretty md:text-xl">
          {titleText}
        </h1>
        {subtitleText && (
          <p className="mt-4 text-sm text-pretty md:text-base">
            {subtitleText}
          </p>
        )}

        {dangerousAction && (
          <div className="mt-6">
            <label
              className="mb-0.5 block px-2 text-xs text-pretty text-black/60 lg:text-sm dark:text-white/60"
              htmlFor="confirm-input"
            >
              Confirm this action
            </label>
            <input
              type="text"
              value={dangerousActionInput}
              onChange={(e) => {
                setDangerousActionInput(e.currentTarget.value);
              }}
              className="w-full rounded-lg border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm outline-hidden transition placeholder:text-neutral-500/50 hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base"
              required={true}
              id="confirm-input"
            />
          </div>
        )}

        <div className="float-right mt-6 flex gap-2">
          {onCancel && (
            <button
              className="cursor-pointer rounded-full border-2 border-neutral-400/40 bg-transparent px-5 py-2 text-sm transition hover:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
              onClick={() => {
                setDangerousActionInput("");
                onCancel?.();
              }}
            >
              {secondaryButtonText}
            </button>
          )}
          {onConfirm && (
            <button
              className={`${dangerousAction && dangerousActionInput === dangerousActionConfirmationInput ? "cursor-pointer bg-red-400/30 hover:bg-red-700/80 hover:text-white active:bg-red-700/70 active:text-white dark:bg-red-400/25 dark:hover:bg-red-500/80 dark:active:bg-red-500/70" : dangerousAction ? "cursor-not-allowed bg-red-400/10 text-neutral-500/50 dark:bg-red-300/20" : "cursor-pointer bg-neutral-700/90 text-white hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70"} rounded-full px-5 py-2 text-left text-sm transition md:text-base`}
              onClick={() => {
                if (
                  dangerousAction &&
                  dangerousActionInput !== dangerousActionConfirmationInput
                )
                  return;

                onConfirm?.();
                if (primaryButtonTextClicked) {
                  setPrimaryButtonTextState(primaryButtonTextClicked);
                }
              }}
              disabled={
                dangerousAction &&
                dangerousActionInput !== dangerousActionConfirmationInput
              }
            >
              {primaryButtonTextState}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
