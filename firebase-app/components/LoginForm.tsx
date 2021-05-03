import { useAuthMethods } from "#/packages/features/auth/auth-context";
import { Button } from "@chakra-ui/button";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
// import { Input } from "@chakra-ui/input";
import { Flex, Heading } from "@chakra-ui/layout";

const LoginForm = () => {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const { login } = useAuthMethods();

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background={formBackground} p={12} rounded={6}>
        <Heading mb={6}>Bem vindo a PodCodar!</Heading>
        <Button colorScheme="red" mb={3} onClick={login}>
          Log In with Google
        </Button>
        <Button onClick={toggleColorMode}>Toggle Theme</Button>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
