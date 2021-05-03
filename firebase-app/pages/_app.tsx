import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

import {
  ChakraProvider,
  CSSReset,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  AuthProvider,
  useAuthState,
} from "#/packages/features/auth/auth-context";

function providerWrappers(children: ReactNode) {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}

function PageLoader({ children }: { children: ReactElement }): ReactElement {
  const authState = useAuthState();

  if (authState.isLoading)
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Stack textAlign="center" alignItems="center">
          <Text>Esquentando os motores</Text>
          <Spinner />
        </Stack>
      </Flex>
    );

  return children;
}

function AppLayout({ Component, pageProps }: AppProps): ReactElement {
  return providerWrappers(
    <PageLoader>
      <Component {...pageProps} />
    </PageLoader>
  );
}

export default AppLayout;
