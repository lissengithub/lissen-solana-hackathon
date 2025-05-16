import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
  AuthError,
} from "firebase/auth";
import { auth } from "./config";
import { trpc, trpcUtils } from "@/lib/trpc";

interface AuthenticateParams {
  email?: string;
  password?: string;
  provider?: "google" | "apple";
}

export interface AuthenticateResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean | null;
  authenticate: (params: AuthenticateParams) => Promise<AuthenticateResult>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const authMutation = trpc.user.auth.useMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const getAuthErrorMessage = (error: AuthError): string => {
    if (error.code === "auth/weak-password") {
      return "Your password must be at least 6 characters long.";
    }

    if (
      error.code === "auth/email-already-in-use" ||
      error.code === "auth/invalid-login-credentials" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      return "Invalid email or password. If you signed up with your social account, please use social buttons below.";
    }

    if (error.code === "auth/invalid-email") {
      return "That email address is invalid";
    }

    if (error.code === "auth/too-many-requests") {
      return "Failed to log in too many times.\n\nPlease try again later.";
    }

    if (error.code === "cancelled") {
      return "";
    }

    return "Something went wrong, please try again later.";
  };

  const signInWithGoogle =
    useCallback(async (): Promise<AuthenticateResult> => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // Create user in database
        await authMutation.mutateAsync();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: "Failed to sign in with Google" };
      }
    }, [authMutation]);

  const signInWithApple = useCallback(async (): Promise<AuthenticateResult> => {
    try {
      const provider = new OAuthProvider("apple.com");

      await signInWithPopup(auth, provider);
      // Create user in database
      await authMutation.mutateAsync();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Failed to sign in with Apple" };
    }
  }, [authMutation]);

  const authenticate = useCallback(
    async ({
      email,
      password,
      provider,
    }: AuthenticateParams): Promise<AuthenticateResult> => {
      try {
        if (provider === "google") {
          return await signInWithGoogle();
        }

        if (provider === "apple") {
          return await signInWithApple();
        }

        if (!email || !password) {
          return {
            success: false,
            error: "Email and password are required",
          };
        }

        try {
          // First try to sign in
          await signInWithEmailAndPassword(auth, email, password);
          await authMutation.mutateAsync();
          return { success: true };
        } catch (error: any) {
          // If user doesn't exist, try to sign up
          if (
            error.code === "auth/user-not-found" ||
            error.code === "auth/invalid-login-credentials"
          ) {
            try {
              await createUserWithEmailAndPassword(auth, email, password);
              await authMutation.mutateAsync();
              return { success: true };
            } catch (signUpError: any) {
              return {
                success: false,
                error: getAuthErrorMessage(signUpError),
              };
            }
          }

          return {
            success: false,
            error: getAuthErrorMessage(error),
          };
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        return {
          success: false,
          error: "An unexpected error occurred",
        };
      }
    },
    [authMutation, signInWithGoogle],
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    await trpcUtils.website.user.me.invalidate(undefined, {
      refetchType: "none",
    });

    await trpcUtils.fml.contests.getJoinStatus.invalidate(undefined, {
      refetchType: "none",
    });
    await trpcUtils.fml.feed.getLiked.invalidate(undefined, {
      refetchType: "none",
    });
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmailFirebase(auth, email);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    authenticate,
    logout,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
