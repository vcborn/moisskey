import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head />
      <body className="relative">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
