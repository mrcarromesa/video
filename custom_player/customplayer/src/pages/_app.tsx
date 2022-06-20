import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppPlayerProvider from "src/hooks";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppPlayerProvider>
      <Component {...pageProps} />
    </AppPlayerProvider>
  );
}

export default MyApp;
