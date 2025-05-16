import { trpc } from "@/lib/trpc";
import GameCard from "@/app/play/Games/GameCard";
import { CircleCheck, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useManageRoster } from "@/hooks/fml/useManageRoster";
import { useArtistTraits } from "@/hooks/fml/useArtistTraits";
import { cn } from "@/lib/utils";
export default function EligibleGamesList({
  leagueId,
  className,
}: {
  leagueId: string;
  className?: string;
}) {
  const { data: games } = trpc.fml.contests.getByLeagueId.useQuery({
    leagueId,
  });

  const { currentRoster } = useManageRoster(leagueId);

  const { artistTraits } = useArtistTraits(
    currentRoster?.filter((id) => id !== null) ?? [],
  );

  const rosterTraitIds = artistTraits.map((trait) => trait.traitId);

  const isGameEligible = (traits: Array<{ id: string }>) => {
    if (!traits || traits.length === 0) {
      return false;
    }

    const gameTraitIds = traits.map((trait) => trait.id);
    return gameTraitIds.some((traitId) => rosterTraitIds.includes(traitId));
  };

  return (
    <div className={cn("grid grid-cols-1 gap-4", className)}>
      {games?.map((game) => {
        const eligible = isGameEligible(game.traits);

        return (
          <GameCard
            key={game.id}
            game={game}
            showEligibleRoster={false}
            primaryAction={
              <div className="flex flex-row gap-2">
                {eligible ? <Eligible /> : <Ineligible />}
              </div>
            }
          />
        );
      })}
    </div>
  );
}

const Eligible = () => (
  <Badge
    variant="outline"
    className="text-[#479BE2] gap-1 py-1 border border-[#1D71B81A] bg-[#1D71B81A]"
  >
    <CircleCheck size={16} color="white" className="fill-[#1D71B8]" />
    Game eligible
  </Badge>
);

const Ineligible = () => (
  <Badge
    variant="outline"
    className="text-[#8B8C8D] gap-1 py-1 border border-[#1D71B81A] bg-[#545556]"
  >
    <CircleX size={16} className="fill-[#8B8C8D] stroke-white/30" />
    Not eligible
  </Badge>
);
