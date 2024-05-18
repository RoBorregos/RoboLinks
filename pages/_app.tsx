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

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default api.withTRPC(MyApp);
