"use client";

import LeagueCard from "./LeagueCard";
import { League } from "./types";
import { cn } from "@/lib/utils";

export default function LeagueList({
  leagues,
  className,
}: {
  leagues: League[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row gap-4 overflow-x-auto pb-2 no-scrollbar",
        className,
      )}
    >
      {leagues.map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  );
}
