import { RouterOutputs, trpc, trpcUtils } from "@/lib/trpc";
import { useEffect, useMemo } from "react";

export type FMLArtistList =
  RouterOutputs["fml"]["artists"]["listPaginated"]["data"];

export const useFMLArtistList = ({
  searchTerm,
  leagueId,
}: { searchTerm?: string; leagueId?: string } = {}) => {
  const query = trpc.fml.artists.listPaginated.useInfiniteQuery(
    { searchTerm, leagueId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    },
  );

  const artists = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.data) ?? [];
  }, [query.data]);

  useEffect(() => {
    if (artists.length > 0) {
      for (const artist of artists) {
        trpcUtils.fml.artists.getById.setData(
          { scArtistId: artist.scArtistId },
          () => {
            return {
              ...artist,
              name: artist.artistName,
              image: artist.artistImage,
            };
          },
        );
      }
    }
  }, [artists]);
  return { query, artists };
};
