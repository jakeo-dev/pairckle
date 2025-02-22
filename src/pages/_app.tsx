import { Lexend } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lexend = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <main
      className={`${lexend.className} flex flex-col min-h-screen bg-gradient-to-b lg:bg-gradient-to-r from-orange-200 via-gray-200 to-blue-200`}
    >
      <Header />
      <Component {...pageProps} />
      <Analytics />
      <Footer fixed={router.pathname == "/" ? true : false} />
    </main>
  );
}
