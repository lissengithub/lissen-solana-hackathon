import { Game } from "./types";
import GameCard from "./GameCard";

export default function GamesList({ games }: { games: Game[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
