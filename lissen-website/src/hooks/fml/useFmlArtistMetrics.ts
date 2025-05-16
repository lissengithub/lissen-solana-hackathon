import { RouterOutputs, trpc } from "@/lib/trpc";

export type FMLArtistMetrics =
  RouterOutputs["fml"]["artistMetrics"]["getByArtistId"];

export const useFmlArtistMetrics = (scArtistId: string) => {
  const query = trpc.fml.artistMetrics.getByArtistId.useQuery(
    { scArtistId },
    {
      enabled: !!scArtistId,
    },
  );

  return { query };
};
