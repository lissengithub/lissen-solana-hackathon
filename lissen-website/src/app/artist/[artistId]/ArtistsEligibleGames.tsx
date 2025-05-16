"use client";
import { trpc } from "@/lib/trpc";
import GameCard from "@/app/play/Games/GameCard";

export default function ArtistsEligibleGames({
  scArtistId,
}: {
  scArtistId: string;
}) {
  const { data: eligibleContests } = trpc.fml.contests.getByArtistId.useQuery({
    scArtistId,
  });

  if (!eligibleContests) {
    return null;
  }

  if (eligibleContests.length === 0) {
    return (
      <div className="col-span-full text-center py-10 bg-zinc-900/30 rounded-lg">
        <p className="mt-2 text-gray-400">
          No eligible games found for this artist.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eligibleContests.map((contest) => (
        <GameCard key={contest.id} game={contest} showEligibleRoster={false} />
      ))}
    </div>
  );
}
