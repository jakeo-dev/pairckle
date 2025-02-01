import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-gradient-to-b lg:bg-gradient-to-r from-orange-200 via-gray-200 to-blue-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
