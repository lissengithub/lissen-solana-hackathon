import { useAuth } from "@/lib/firebase/auth-context";
import { trpc } from "@/lib/trpc";
import { RouterOutputs } from "@/lib/trpc";

export type RosterArtistData =
  RouterOutputs["fml"]["roster"]["getByLeagueId"][number];

export const useMyRoster = (leagueId: string | undefined) => {
  const { user } = useAuth();
  const query = trpc.fml.roster.getByLeagueId.useQuery(
    {
      userId: user?.uid ?? "",
      leagueId: leagueId ?? "",
    },
    {
      enabled: user !== null && leagueId !== undefined,
    },
  );
  const utils = trpc.useUtils();
  const invalidate = () => utils.fml.roster.getByLeagueId.invalidate();

  return { query, invalidate };
};
