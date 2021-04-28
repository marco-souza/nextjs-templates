import { AppProps } from "next/app";
import { ReactElement } from "react";

import { ChakraProvider } from "@chakra-ui/react";

function AppLayout({ Component, pageProps }: AppProps): ReactElement {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default AppLayout;
