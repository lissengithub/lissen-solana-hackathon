import { RouterOutputs } from "@/lib/trpc";

export type Game = RouterOutputs["fml"]["contests"]["getByLeagueId"][number];
