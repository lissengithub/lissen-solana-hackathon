import { trpc } from "@/lib/trpc";

export function useArtistTraits(artistIds: string[]) {
  const { data, isLoading, error } = trpc.fml.artistTraits.getByIds.useQuery(
    { artistIds },
    {
      enabled: !!artistIds.length,
    },
  );

  return {
    artistTraits: data || [],
    isLoading,
    error,
    hasTraits: !!data?.length,
  };
}
