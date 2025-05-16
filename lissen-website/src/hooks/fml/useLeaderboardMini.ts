import { useAuth } from "@/lib/firebase/auth-context";
import { RouterOutputs, trpc } from "@/lib/trpc";

export type ContestData = RouterOutputs["fml"]["contests"]["list"][number];

export const useLeaderboardMini = (contestId: string) => {
  const { user } = useAuth();
  const query = trpc.fml.contests.leaderboard.getMini.useQuery(
    {
      contestId,
      userId: user?.uid ?? "",
    },
    {
      refetchOnMount: "always",
      enabled: user !== null,
    },
  );
  return { query };
};
