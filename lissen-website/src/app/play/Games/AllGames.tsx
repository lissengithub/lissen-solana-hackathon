"use client";

import { trpc } from "@/lib/trpc";
import GamesList from "@/app/play/Games/GamesList";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import Feed from "../Feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AllGames() {
  const { leagueId } = useParams<{ leagueId: string }>();

  const games = trpc.fml.contests.getByLeagueId.useQuery(
    {
      leagueId: leagueId ?? "",
      startDate: dayjs().utc().startOf("week").toISOString(),
      endDate: dayjs().utc().endOf("week").toISOString(),
    },
    {
      enabled: !!leagueId,
    },
  );

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Tabs - only visible on small screens */}
      <div className="md:hidden">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger
              value="feed"
              className={cn(
                "data-[state=active]:bg-white data-[state=active]:text-black",
              )}
            >
              Feed
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className={cn(
                "data-[state=active]:bg-white data-[state=active]:text-black",
              )}
            >
              Games
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed" className="flex-grow min-h-0">
            <div className="flex flex-col min-h-0 mt-4">
              <Feed leagueId={leagueId ?? ""} />
            </div>
          </TabsContent>
          <TabsContent value="games" className="flex-grow min-h-0">
            <div className="mt-6">
              <GamesList games={games.data ?? []} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view - side by side layout */}
      <div className="hidden md:grid grid-cols-[40fr_60fr] gap-6 flex-grow min-h-0">
        <div className="sticky top-[17rem] self-start">
          <GamesList games={games.data ?? []} />
        </div>
        <div className="flex flex-col min-h-0 border-l border-gray-700">
          <Feed leagueId={leagueId ?? ""} />
        </div>
      </div>
    </div>
  );
}
