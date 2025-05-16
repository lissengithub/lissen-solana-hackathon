import { useAuth } from "@/lib/firebase/auth-context";
import { trpc } from "@/lib/trpc";

export const useMe = () => {
  const { user: firebaseUser } = useAuth();
  const query = trpc.website.user.me.useQuery(undefined, {
    enabled: !!firebaseUser,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    query,
  };
};
