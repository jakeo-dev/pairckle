import { useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function SignIn() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: emailInput,
        options: {
          shouldCreateUser: true, // automatically signs up user
          captchaToken: captchaToken,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: usernameInput,
          },
        },
      });

      if (error) {
        console.log("error", data, error);
      } else {
        console.log("sign up successful!");
      }
    } catch (error) {
      console.error("error:", error);
    } finally {
      turnstileRef.current?.reset();
      setCaptchaToken("");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex w-full items-center justify-center pb-16 lg:min-h-full">
        <div className="w-full">
          <form
            className={`absolute left-1/2 top-0 mt-52 w-[85vw] -translate-x-1/2 md:left-1/2 md:top-1/2 md:mt-0 md:w-96 md:-translate-x-1/2 md:-translate-y-1/3`}
            onSubmit={handleSubmit}
          >
            <label
              className="mb-0.5 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
              htmlFor="email-input"
            >
              Email
            </label>
            <input
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.currentTarget.value);
              }}
              className="w-full bg-neutral-200"
              placeholder="you@example.com"
              required={true}
              id="email-input"
            />
            <label
              className="mb-0.5 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
              htmlFor="password-input"
            >
              Password
            </label>
            <input
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.currentTarget.value);
              }}
              className="w-full bg-neutral-200"
              placeholder="••••••••••"
              required={true}
              id="password-input"
            />
            <label
              className="mb-0.5 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
              htmlFor="username-input"
            >
              Username
            </label>
            <input
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.currentTarget.value);
              }}
              className="w-full bg-neutral-200"
              placeholder="mr.pickle.123"
              required={true}
              id="username-input"
            />

            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => {
                setCaptchaToken(token);
              }}
              className="mt-6"
            />

            <button
              type="submit"
              className={`${
                !captchaToken ||
                isSubmitting ||
                emailInput.length > 50 ||
                passwordInput.length > 30 ||
                usernameInput.length > 30 ||
                emailInput.length < 1 ||
                passwordInput.length < 1 ||
                usernameInput.length < 1
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 md:text-base`}
              disabled={
                !captchaToken ||
                isSubmitting ||
                emailInput.length > 50 ||
                passwordInput.length > 30 ||
                usernameInput.length > 30 ||
                emailInput.length < 1 ||
                passwordInput.length < 1 ||
                usernameInput.length < 1
              }
            >
              Sign up / log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
