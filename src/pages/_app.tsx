import { Lexend } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { useEffect } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lexend = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, []);

  return (
    <main
      className={`${lexend.className} flex flex-col min-h-screen bg-gray-200 dark:bg-black dark:text-gray-100`}
    >
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <Footer fixed={router.pathname == "/" ? true : false} />
    </main>
  );
}
