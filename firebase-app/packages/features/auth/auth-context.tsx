import { Status } from "#/packages/api/types";
import { setupFirebase } from "#/packages/config/firebase";
import { useToast } from "@chakra-ui/toast";
import firebase from "firebase";
import { useRouter } from "next/dist/client/router";
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getUserProfile, makeLogin, makeLogout } from "../../api/firebase";
import { UserProfile } from "../../entities/types";

interface AuthMethods {
  readonly logout: () => Promise<void>;
  readonly login: () => Promise<void>;
}

interface AuthState {
  readonly isLogged: boolean;
  readonly isLoading: boolean;
  readonly userProfile: UserProfile | null;
}

interface Props {
  readonly children: ReactNode;
}

const publicRoutes = ["/", "/login"];

const AuthStateCtx = createContext<AuthState>({
  isLogged: false,
  isLoading: false,
  userProfile: null,
});
AuthStateCtx.displayName = "AuthStateCtx";

function missingProviderError() {
  throw TypeError("Missing AuthProvider upwards in the tree");
}
const AuthMethodsCtx = createContext<AuthMethods>({
  login: () => new Promise(missingProviderError),
  logout: () => new Promise(missingProviderError),
});
AuthMethodsCtx.displayName = "AuthMethodsCtx";

export function AuthProvider({ children }: Props): ReactElement {
  const router = useRouter();
  const toast = useToast({ title: "Authentication" });
  const [fetchStatus, setFetchStatus] = useState<Status>("loading");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const methods: AuthMethods = {
    login: async () => {
      setFetchStatus("loading");
      try {
        await makeLogin();
        const userProfileFetched = await getUserProfile();
        setUserProfile(userProfileFetched);
        setFetchStatus("fetched");
      } catch (error) {
        toast({
          status: "error",
          isClosable: true,
          description: "Oops, login failed",
        });
        setFetchStatus("fetched");
      }
    },
    logout: async () => {
      setUserProfile(null);
      await makeLogout();
    },
  };

  useEffect(() => {
    setupFirebase();

    // Observe auth state
    firebase.auth().onAuthStateChanged(async (user) => {
      setFetchStatus("loading");
      if (user != null) {
        // Redirect to dashboard
        const isPublicRoute = publicRoutes.includes(window.location.pathname);
        if (isPublicRoute) {
          await router.replace("/dashboard");
        }

        const user = await getUserProfile();
        setUserProfile(user);

        setFetchStatus("fetched");
      } else {
        // handle redirect
        const isPrivateRoute = !publicRoutes.includes(window.location.pathname);
        if (isPrivateRoute) {
          toast({
            description: `Hey, you aren't logged yet!`,
            status: "warning",
          });
          await router.replace("/login");
        }

        await methods.logout();
        setFetchStatus("idle");
      }
    });
  }, []);

  return (
    <AuthStateCtx.Provider
      value={{
        isLogged: userProfile != null,
        isLoading: fetchStatus === "loading",
        userProfile,
      }}
    >
      <AuthMethodsCtx.Provider value={methods}>
        {children}
      </AuthMethodsCtx.Provider>
    </AuthStateCtx.Provider>
  );
}

export function useAuthState(): AuthState {
  return useContext(AuthStateCtx);
}

export function useAuthMethods(): AuthMethods {
  return useContext(AuthMethodsCtx);
}
