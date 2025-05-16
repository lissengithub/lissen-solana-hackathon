import { RouterOutputs } from "@/lib/trpc";

export type League = RouterOutputs["fml"]["leagues"]["getAll"][number];
