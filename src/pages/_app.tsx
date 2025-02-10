import { Lexend } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Header from "@/components/Header";

const lexend = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={lexend.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  );
}
