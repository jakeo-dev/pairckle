import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function InputModal({
  visibility,
  titleText,
  subtitleText,
  primaryButtonText,
  secondaryButtonText,
  onConfirm,
  onCancel,
  inputValue1Placeholder,
  inputValue1Label,
  inputValue2Placeholder,
  inputValue2Label,
  checkboxValueLabel,
  checkboxValueDescription,
}: {
  visibility: boolean;
  titleText: string;
  subtitleText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onConfirm?: ({
    inputValue1,
    inputValue2,
    checkboxValue,
  }: {
    inputValue1?: string;
    inputValue2?: string;
    checkboxValue?: boolean;
  }) => void;
  onCancel?: () => void;
  inputValue1Placeholder?: string;
  inputValue1Label?: string;
  inputValue2Placeholder?: string;
  inputValue2Label?: string;
  checkboxValueLabel?: string;
  checkboxValueDescription?: string;
}) {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) return;

    setIsSubmitting(true);
    setStatus("");

    try {
      const res = await fetch("../pages/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaToken }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Success! Form submitted.");
        // Reset widget token for security / re-use
        turnstileRef.current?.reset();
        setCaptchaToken("");
      } else {
        setStatus(`Error: ${data.message}`);
        turnstileRef.current?.reset();
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center overflow-auto bg-black/50 ${
        visibility ? "visible-fade" : "invisible-fade"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && onCancel) {
          onCancel();
        }
      }}
      tabIndex={0}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-[90vw] rounded-xl bg-neutral-100 px-8 py-8 shadow-md dark:border-2 dark:border-neutral-800 dark:bg-black md:max-w-xl lg:p-10"
      >
        <button
          className="absolute right-8 top-7 text-lg transition hover:text-neutral-500 active:text-neutral-400 dark:active:text-neutral-600"
          onClick={() => {
            if (onCancel) onCancel();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h1 className="text-pretty pr-4 text-lg font-medium md:text-xl">
          {titleText}
        </h1>
        {subtitleText && (
          <p className="mt-4 text-pretty text-sm md:text-base">
            {subtitleText}
          </p>
        )}

        {inputValue1Placeholder && (
          <div className="mt-6">
            <label
              className="block px-1.5 text-xs text-neutral-500 md:text-sm"
              htmlFor="modal-input-value-1-label"
            >
              {inputValue1Label}
            </label>
            <input
              type="text"
              placeholder={inputValue1Placeholder}
              className="w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-4 py-2 text-sm transition hover:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
              id="modal-input-value-1-label"
              value={inputValue1}
              onChange={(e) => setInputValue1(e.target.value)}
              maxLength={50}
            />
          </div>
        )}

        {inputValue2Placeholder && (
          <div className="mt-6">
            <label
              className="block px-1.5 text-xs text-neutral-500 md:text-sm"
              htmlFor="modal-input-value-2-label"
            >
              {inputValue2Label}
            </label>
            <input
              type="text"
              placeholder={inputValue2Placeholder}
              className="w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-4 py-2 text-sm transition hover:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
              id="modal-input-value-2-label"
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
              maxLength={50}
            />
          </div>
        )}

        {checkboxValueLabel && (
          <div className="mt-6">
            <button
              onClick={() => {
                if (checkboxValue) setCheckboxValue(false);
                else setCheckboxValue(true);
              }}
              className="flex"
            >
              <div
                className={`${
                  checkboxValue
                    ? "bg-blue-500 hover:bg-blue-400 active:bg-blue-300 dark:hover:bg-blue-600 dark:active:bg-blue-700"
                    : "border-2 border-neutral-400/40 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:border-neutral-400/40 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
                } h-6 w-6 rounded-md transition`}
              />
              <label className="cursor-pointer select-none pl-2">
                {checkboxValueLabel}
              </label>
            </button>
            <span className="mt-2 block text-xs text-neutral-500 dark:text-neutral-400">
              {checkboxValueDescription}
            </span>
          </div>
        )}

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => {
            setCaptchaToken(token);
          }}
          className="mt-6"
        />

        <div className="float-right mt-6 flex gap-2">
          <button
            className={`${
              secondaryButtonText ? "" : "hidden"
            } rounded-md border-2 border-neutral-400/40 bg-transparent px-4 py-2 text-sm transition hover:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base`}
            onClick={onCancel}
          >
            {secondaryButtonText}
          </button>
          <button
            type="submit"
            className={`${
              primaryButtonText ? "" : "hidden"
            } ${!captchaToken || isSubmitting ? "cursor-not-allowed opacity-50" : ""} rounded-md bg-neutral-700/90 px-4 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 md:text-base`}
            onClick={
              onConfirm
                ? () => onConfirm({ inputValue1, inputValue2, checkboxValue })
                : undefined
            }
            disabled={!captchaToken || isSubmitting}
          >
            {primaryButtonText}
          </button>
        </div>

        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>
    </div>
  );
}
