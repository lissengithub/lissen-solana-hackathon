import { trpcServer } from "@/lib/trpc/serverClient";
import ManageRosterSheet from "@/components/fml/ManageRosterSheet";
import { headers } from "next/headers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import LeaguePicker from "./LeaguePicker";

export default async function LeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  headers();
  await trpcServer.fml.leagues.getAll.prefetch();
  const dehydratedState = dehydrate(trpcServer.queryClient);

  return (
    <div className="flex flex-col flex-grow">
      <div className="md:sticky md:top-[6rem] md:z-10 mb-4 md:container md:bg-background">
        <HydrationBoundary state={dehydratedState}>
          <LeaguePicker />
        </HydrationBoundary>
      </div>

      <div className="container">{children}</div>

      <ManageRosterSheet />
    </div>
  );
}
