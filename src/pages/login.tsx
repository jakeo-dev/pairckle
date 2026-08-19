import CommonHead from "@/components/CommonHead";
import Heading from "@/components/Heading";
import router from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { generateUsername } from "@/lib/utilities";

import { supabase } from "@/lib/supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import { Geist_Mono } from "next/font/google";
import { fetchUsernames } from "@/db";
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Login() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const emailRegex = /.+@.+\..+/;

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signin" | "verify">("signin");
  const [type, setType] = useState<"login" | "signup">("login");

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");

  const [usernames, setUsernames] = useState<string[]>([]);

  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      emailInput.length > 255 ||
      emailInput.length < 5 ||
      !emailRegex.test(emailInput)
    ) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (type === "signup" && usernameInput.length > 30) {
      setMessage("Username is too long.");
      return;
    }
    if (type === "signup" && usernameInput.length < 2) {
      setMessage("Username is too short.");
      return;
    }
    if (type === "signup" && usernames.includes(usernameInput)) {
      setMessage("Username is already taken.");
      return;
    }
    if (!captchaToken || isSubmitting) {
      setMessage("An unexpected error occurred. Try again in a few seconds.");
      return;
    }
    setMessage("");

    setIsSubmitting(true);

    // create user in database and email code
    const { error: loginError } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: {
        shouldCreateUser: true, // automatically signs up user if email not in database
        captchaToken: captchaToken,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username: usernameInput || generateUsername(),
        },
      },
    });

    if (loginError) {
      console.log("Error logging in:", loginError);
    } else {
      console.log("sign up successful!");
      setStep("verify");
    }

    turnstileRef.current?.reset();
    setCaptchaToken("");
    setIsSubmitting(false);
  }

  // verify one time passcode
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error: verifyOTPError } = await supabase.auth.verifyOtp({
      token: otp,
      type: "email",
      email: emailInput,
    });

    setIsSubmitting(false);
    if (verifyOTPError) {
      console.error("error:", verifyOTPError.message);
    } else {
      console.log("authentication successful!");
      // Session is set in Supabase SDK automatically
      router.push("/auth/callback");
    }
  };

  useEffect(() => {
    async function getUsernames() {
      const usernamesList = await fetchUsernames();
      setUsernames(usernamesList);
      console.log(usernames);
    }

    getUsernames();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center pb-16 lg:min-h-full">
        <div className="w-full">
          <Heading
            icon={faRightToBracket}
            text={type === "login" ? "Log in" : "Sign up"}
          />

          {step === "signin" ? (
            <form
              onSubmit={handleSubmit}
              className={`absolute left-1/2 top-0 mt-72 w-[85vw] -translate-x-1/2 md:left-1/2 md:top-1/2 md:mt-0 md:w-96 md:-translate-x-1/2 md:-translate-y-1/3`}
            >
              <label
                className="mb-0.5 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
                htmlFor="email-input"
              >
                Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.currentTarget.value);
                  setMessage("");
                }}
                className="w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm transition hover:bg-neutral-400/20 focus:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
                placeholder="you@example.com"
                required={true}
                id="email-input"
                max={254}
              />
              {type === "signup" && (
                <>
                  <label
                    className="mb-0.5 mt-4 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
                    htmlFor="username-input"
                  >
                    Username
                  </label>
                  <input
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.currentTarget.value);
                      setMessage("");
                    }}
                    className="w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm transition hover:bg-neutral-400/20 focus:bg-neutral-400/20 active:bg-neutral-400/30 md:text-base"
                    placeholder="pickle_123"
                    required={true}
                    id="username-input"
                    maxLength={30}
                  />
                </>
              )}

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                }}
                className="mt-8 flex items-center justify-center"
              />

              {message && <p className="mt-2 text-red-500">{message}</p>}
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 md:text-base"
              >
                Get code
              </button>

              <div className="mt-2 flex items-center justify-center gap-1 text-sm md:text-base">
                <p className="text-neutral-600 dark:text-neutral-300">
                  {type === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <button
                  className="font-semibold text-blue-500 transition hover:text-orange-500"
                  onClick={() => {
                    setType(type === "login" ? "signup" : "login");
                  }}
                >
                  {type === "login" ? "Create one" : "Log in"}
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyOtp}
              className="absolute left-1/2 top-0 mt-72 w-[85vw] -translate-x-1/2 md:left-1/2 md:top-1/2 md:mt-0 md:w-96 md:-translate-x-1/2 md:-translate-y-1/3"
            >
              <p className="text-pretty text-center md:text-lg">
                Code sent to <span className="font-semibold">{emailInput}</span>
                .{" "}
              </p>
              <p className="mt-1 text-pretty text-center text-xs text-black/60 dark:text-white/60 md:text-sm">
                {`Make sure to check your spam inbox. If you still don't see the
                email, go back and try sending the code again.`}
              </p>
              <div className="mt-6">
                <label
                  className="mb-0.5 mt-4 block text-pretty px-2 text-xs text-black/60 dark:text-white/60 lg:text-sm"
                  htmlFor="otp-input"
                >
                  Verification code
                </label>
                <input
                  id="otp-input"
                  type="number"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 8))}
                  placeholder="12345678"
                  className={`w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-7 py-4 text-center text-2xl tracking-[0.5em] transition hover:bg-neutral-400/20 focus:bg-neutral-400/20 active:bg-neutral-400/30 md:text-3xl ${geistMono.className}`}
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded-full bg-neutral-700/90 px-4 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 md:text-base"
                  onClick={() => {
                    setStep("signin");
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 8}
                  className={`${
                    otp.length !== 8 ? "cursor-not-allowed opacity-50" : ""
                  } w-full rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70 md:text-base`}
                >
                  {isSubmitting
                    ? "Verifying..."
                    : type === "login"
                      ? "Finish login"
                      : "Finish sign up"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
