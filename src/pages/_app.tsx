import { Lexend } from "next/font/google";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

const lexend = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={lexend.className}>
      <Component {...pageProps} />
    </main>
  );
}
