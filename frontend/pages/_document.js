import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="StreamFlix - Stream movies and TV series online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-dark text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
