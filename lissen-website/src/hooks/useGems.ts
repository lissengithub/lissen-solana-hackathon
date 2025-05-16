import { useAuth } from "@/lib/firebase/auth-context";
import { trpc } from "@/lib/trpc";
import { RouterOutputs } from "@/lib/trpc";

export type GemsData = RouterOutputs["gems"]["getGems"];

export const useGems = () => {
  const { user } = useAuth();
  const query = trpc.gems.getGems.useQuery(undefined, {
    enabled: user !== null,
  });
  const utils = trpc.useUtils();
  const invalidate = () => utils.gems.getGems.invalidate();

  return { query, invalidate };
};
