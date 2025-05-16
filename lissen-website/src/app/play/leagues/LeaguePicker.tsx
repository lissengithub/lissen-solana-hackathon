"use client";
import LeagueList from "@/components/fml/leagues/LeagueList";
import { trpc } from "@/lib/trpc";

export default function LeaguePicker() {
  const { data: leagues } = trpc.fml.leagues.getAll.useQuery();

  return <LeagueList leagues={leagues ?? []} className="px-8 md:px-0" />;
}
