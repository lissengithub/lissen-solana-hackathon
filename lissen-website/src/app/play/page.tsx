import { trpcUtils } from "@/lib/trpc";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function PlayPage() {
  headers();
  const leagues = await trpcUtils.fml.leagues.getAll.fetch();

  redirect(`/play/leagues/${leagues[0].id}`);
}
