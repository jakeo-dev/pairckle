import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-neutral-50 dark:bg-black dark:text-neutral-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
