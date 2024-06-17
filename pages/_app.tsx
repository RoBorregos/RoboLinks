import type { AppProps } from "next/app";
import "../styles/globals.css";
import {
  ChakraProvider,
  ColorModeScript,
  ColorModeScriptProps,
} from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { api } from "../utils/trpc";

import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
