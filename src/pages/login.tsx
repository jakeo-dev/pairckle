import CommonHead from "@/components/CommonHead";
import Link from "next/link";
import router from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { generateUsername } from "@/lib/utilities";
import { fetchUsernames } from "@/db";

import { supabase } from "@/lib/supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import { Geist_Mono } from "next/font/google";
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
    if (type === "signup" && usernameInput.length > 25) {
      setMessage("Username is too long.");
      return;
    }
    if (type === "signup" && usernameInput.length < 2) {
      setMessage("Username is too short.");
      return;
    }
    if (
      type === "signup" &&
      (usernames.includes(usernameInput) || usernameInput === "guest")
    ) {
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
      console.error("Error logging in:", loginError);
    } else {
      console.log("Sign up successful!");
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
    if (verifyOTPError && verifyOTPError.code === "otp_expired") {
      setMessage("Incorrect passcode.");
    } else if (verifyOTPError) {
      console.error("Error:", verifyOTPError.message);
    } else {
      setMessage("");
      console.log("Authentication successful!");
      // Session is set in Supabase SDK automatically
      router.push("/auth/callback");
    }
  };

  useEffect(() => {
    async function getUsernames() {
      const usernamesList = await fetchUsernames();
      setUsernames(usernamesList);
    }

    getUsernames();
  }, []);

  return (
    <>
      <CommonHead />

      <div className="flex w-full items-center justify-center bg-linear-to-br from-orange-200 to-blue-200 pb-16 dark:from-orange-950 dark:to-blue-950">
        <div className="min-h-screen w-full lg:min-h-[93.7vh]">
          <h1
            className={`section mt-44 text-center text-3xl md:mt-52 ${gabarito.className}`}
          >
            {step === "verify" ? (
              "Verify your email"
            ) : type === "login" ? (
              "Welcome back"
            ) : (
              <>
                <span className="hidden md:inline">
                  Create a Pairckle account
                </span>
                <span className="block md:hidden">Create a</span>
                <span className="block md:hidden">Pairckle account</span>
              </>
            )}
          </h1>

          {step === "signin" && (
            <div className="mt-2 flex items-center justify-center gap-1 text-sm md:text-base">
              <p className="text-neutral-600 dark:text-neutral-300">
                {type === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                className="cursor-pointer font-semibold text-blue-500 transition hover:text-orange-500"
                onClick={() => {
                  setType(type === "login" ? "signup" : "login");
                }}
              >
                {type === "login" ? "Sign up" : "Log in"}
              </button>
            </div>
          )}

          {step === "signin" ? (
            <form onSubmit={handleSubmit} className="narrow-section mt-8">
              <label
                className="mb-0.5 block px-2 text-xs text-pretty text-black/60 lg:text-sm dark:text-white/60"
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
                className="w-full rounded-lg border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm outline-hidden transition placeholder:text-neutral-500/50 hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base"
                placeholder="you@example.com"
                required={true}
                id="email-input"
                max={254}
              />
              {type === "signup" && (
                <>
                  <label
                    className="mt-4 mb-0.5 block px-2 text-xs text-pretty text-black/60 lg:text-sm dark:text-white/60"
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
                    className="w-full rounded-lg border-2 border-neutral-400/40 bg-transparent px-3.5 py-2 text-sm outline-hidden transition placeholder:text-neutral-500/50 hover:bg-neutral-400/10 focus:bg-neutral-400/10 focus:ring-2 focus:ring-blue-300/75 active:bg-neutral-400/20 md:text-base"
                    placeholder="pickle_123"
                    required={true}
                    id="username-input"
                    maxLength={25}
                  />
                </>
              )}

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                }}
                className="mt-8"
              />

              {message && <p className="mt-2 text-red-500">{message}</p>}
              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 md:text-base dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70"
              >
                Get code
              </button>

              <div className="mt-2 gap-1 text-center text-xs md:text-sm">
                <p className="text-pretty text-neutral-600 dark:text-neutral-300">
                  By {type === "login" ? "logging in" : "signing up"}, you agree
                  to our{" "}
                  <Link className="link" href="/terms" target="_blank">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link className="link" href="/terms" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="narrow-section mt-8">
              <p className="text-center text-sm text-pretty md:text-base">
                Code sent to <span className="font-semibold">{emailInput}</span>
                .{" "}
              </p>
              <p className="mt-1 text-center text-xs text-pretty text-black/60 md:text-sm dark:text-white/60">
                {`Make sure to check your spam inbox. If you still don't see the
                email, go back and try sending the code again.`}
              </p>
              <div className="mx-auto mt-6 max-w-80">
                <label
                  className="mt-4 mb-0.5 block px-2 text-xs text-pretty text-black/60 lg:text-sm dark:text-white/60"
                  htmlFor="otp-input"
                >
                  Verification code
                </label>
                <input
                  id="otp-input"
                  type="number"
                  required
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.slice(0, 8));
                    setMessage("");
                  }}
                  placeholder="12345678"
                  className={`w-full rounded-md border-2 border-neutral-400/40 bg-transparent px-5 py-4 text-center text-2xl tracking-[0.5em] transition hover:bg-neutral-400/20 focus:bg-neutral-400/20 active:bg-neutral-400/30 md:text-3xl ${geistMono.className}`}
                />
              </div>
              {message && (
                <p className="mx-auto mt-2 max-w-80 text-red-500">{message}</p>
              )}
              <div className="mx-auto mt-2 flex max-w-80 gap-2">
                <button
                  className="cursor-pointer rounded-full bg-neutral-700/90 px-4 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 md:text-base dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70"
                  onClick={() => {
                    setStep("signin");
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="submit"
                  aria-disabled={otp.length !== 8}
                  className={`${
                    otp.length !== 8 ? "cursor-not-allowed opacity-50" : ""
                  } w-full cursor-pointer rounded-full bg-neutral-700/90 px-5 py-2 text-sm text-white transition hover:bg-neutral-700/80 active:bg-neutral-700/70 md:text-base dark:bg-neutral-300/90 dark:text-black dark:hover:bg-neutral-300/80 dark:active:bg-neutral-300/70`}
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
