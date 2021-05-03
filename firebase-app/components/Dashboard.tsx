import {
  useAuthMethods,
  useAuthState,
} from "#/packages/features/auth/auth-context";
import { Button } from "@chakra-ui/button";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { Flex, Heading } from "@chakra-ui/layout";

const LoginForm = () => {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const { logout } = useAuthMethods();
  const { userProfile } = useAuthState();

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background={formBackground} p={12} rounded={6}>
        <Heading mb={6}>Bem vindo {userProfile?.displayName}!</Heading>
        <Button mb={3} onClick={logout}>
          Logout
        </Button>
        <Button onClick={toggleColorMode}>Toggle Theme</Button>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
