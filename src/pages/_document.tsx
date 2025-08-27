import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-neutral-100 dark:bg-black dark:text-neutral-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
