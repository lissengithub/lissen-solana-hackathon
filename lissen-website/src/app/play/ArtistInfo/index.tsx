import MetricsGrid from "./MetricsGrid";
import { trpc } from "@/lib/trpc";
import { useManageRoster } from "@/hooks/fml/useManageRoster";

export default function ArtistInfo({ scArtistId }: { scArtistId: string }) {
  const { data: artistStats } = trpc.fml.artistStats.getById.useQuery({
    scArtistId,
  });

  const { currentRoster, toggleAddRemove, canAddOrRemove } = useManageRoster();
  const isInRoster = currentRoster.includes(scArtistId);

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-sky-400 to-blue-500">
      <div className="p-4 bg-neutral-900 rounded-2xl min-h-[237px]">
        <div className="flex justify-between items-center border-b border-neutral-700 pb-2 mb-4">
          <h1 className="text-xl font-medium ">
            Info Box: {artistStats?.name}
          </h1>

          <button
            className={
              "rounded-full px-4 py-2 font-medium uppercase text-sm bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            }
            onClick={() => toggleAddRemove(scArtistId)}
            disabled={!canAddOrRemove(scArtistId)}
          >
            {isInRoster ? "Remove" : "Add"}
          </button>
        </div>

        <MetricsGrid scArtistId={scArtistId} />
      </div>
    </div>
  );
}
