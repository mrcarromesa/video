import "../styles/globals.scss";

import type { AppProps } from "next/app";
import Head from "next/head";
import { withUnleashProvider } from "next-unleash";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default withUnleashProvider(MyApp);
