import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { League } from "@/components/fml/leagues/types";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useManageRosterSheet } from "@/components/fml/ManageRosterSheet";
import { useMyRoster } from "@/hooks/fml/useMyRoster";
import { useAuth } from "@/lib/firebase/auth-context";

interface LeagueCardProps {
  league: League;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  const params = useParams<{ leagueId: string }>();
  const leagueId = params.leagueId;
  const isActive = leagueId === league.id;

  return (
    <Link href={`/play/leagues/${league.id}`} scroll={false} className="block">
      <div
        className={cn(
          "border-[3px] rounded-3xl p-4 min-w-[273px] h-[150px] transition-all cursor-pointer flex flex-col justify-between",
          isActive ? "border-[#1D71B8] shadow-lg" : "border-transparent",
        )}
        style={{ backgroundColor: league.color ?? "#7dd3fc" }}
      >
        <div className="flex flex-row justify-between items-start gap-2 sm:gap-6">
          <h1 className="font-inter font-extrabold text-[22px] sm:text-[25px] lg:text-[29.27px] leading-[28px] sm:leading-[33.46px] tracking-[-0.02em]">
            {league.displayName}
          </h1>
          <Badge className="flex gap-px justify-center items-center self-start text-[11px] sm:text-[12.5px] font-bold rounded-xl bg-zinc-800 hover:bg-zinc-800 p-1.5 sm:p-2 text-white fml-game-prize-badge tracking-[-0.02em] leading-[14.64px] backdrop-blur-md shadow-2xl">
            <Trophy size={12} />
            <span className="whitespace-nowrap">
              ${league.totalPrizePool} in prize
            </span>
          </Badge>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 sm:gap-6">
          <div className="flex flex-row gap-1 sm:gap-2 items-center">
            <Team leagueId={league.id} />
            <div className="font-inter font-medium text-[12px] sm:text-[14.64px] leading-[16px] sm:leading-[18.82px] tracking-[-0.02em] text-right whitespace-nowrap">
              {league.participantsCount} player
              {league.participantsCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="font-inter font-medium text-[12px] sm:text-[14.64px] leading-[16px] sm:leading-[18.82px] tracking-[-0.02em] text-right whitespace-nowrap">
            {league.contests.length} game
            {league.contests.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
    </Link>
  );
}

const Team = ({ leagueId }: { leagueId: string }) => {
  const { isAuthenticated } = useAuth();
  const {
    query: { data: roster, isFetched },
  } = useMyRoster(leagueId);
  const { manageRoster } = useManageRosterSheet();

  const openManageRoster = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    manageRoster(leagueId);
  };

  if (!roster && isAuthenticated === null && !isFetched) {
    return <div className="h-8 w-24 bg-gray-600 rounded animate-pulse" />;
  }

  if (!roster || roster.length === 0) {
    return (
      <Button
        type="button"
        variant="outline"
        className="hover:bg-white/10 bg-white/5 border-white/10 text-xs sm:text-sm h-8 sm:h-9 animate-in fade-in duration-700"
        onClick={openManageRoster}
      >
        Create team
      </Button>
    );
  }

  return (
    <button
      className="flex flex-row items-center pl-5"
      onClick={openManageRoster}
    >
      {roster.map(({ scArtistId }, index) => (
        <div key={scArtistId} style={{ zIndex: 5 - index }} className="-ml-5">
          <ArtistAvatar scArtistId={scArtistId} />
        </div>
      ))}
    </button>
  );
};

export const ArtistAvatar = ({ scArtistId }: { scArtistId: string }) => {
  const { data: artist } = trpc.fml.artists.getById.useQuery({
    scArtistId,
  });

  return (
    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-black first:ml-0 shadow-md">
      <AvatarImage src={artist?.image ?? "/images/avatar-fallback.webp"} />
    </Avatar>
  );
};
