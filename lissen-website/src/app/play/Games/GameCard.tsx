"use client";

import { Badge } from "@/components/ui/badge";
import { Timer, Trophy, Users2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { trpc, trpcUtils } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Game } from "./types";
import { useAuth } from "@/lib/firebase/auth-context";
import { useMyRoster } from "@/hooks/fml/useMyRoster";
import { ArtistAvatar } from "@/components/fml/leagues/LeagueCard";
import { useArtistTraits } from "@/hooks/fml/useArtistTraits";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useManageRosterSheet } from "@/components/fml/ManageRosterSheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

dayjs.extend(relativeTime);

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export interface GameCardProps {
  game: Game;
  primaryAction?: React.ReactNode;
  className?: string;
  showEligibleRoster?: boolean;
}

export default function GameCard({
  game,
  primaryAction,
  className,
  showEligibleRoster = true,
}: GameCardProps) {
  const { id } = game;
  const { user, isAuthenticated } = useAuth();
  const { manageRoster } = useManageRosterSheet();

  const {
    query: { data: myRoster },
  } = useMyRoster(game.league?.id);

  const { artistTraits } = useArtistTraits(
    myRoster?.map(({ scArtistId }) => scArtistId) ?? [],
  );

  const eligibleArtistIdsInRosterForGame = useMemo(() => {
    // Get the trait IDs required for this game
    const gameTraitIds = game.traits.map((trait) => trait.id);

    // Find artist IDs that have at least one of the required traits
    const eligibleArtistIds = artistTraits
      .filter((artistTrait) =>
        // Check if this artist has any of the game's required traits
        gameTraitIds.includes(artistTrait.traitId),
      )
      .map((artistTrait) => artistTrait.artistId);

    // Remove duplicates using object keys
    const uniqueEligibleArtistIds = Object.keys(
      eligibleArtistIds.reduce<Record<string, boolean>>((acc, id) => {
        acc[id] = true;
        return acc;
      }, {}),
    );

    return uniqueEligibleArtistIds;
  }, [artistTraits, game.traits]);

  const joinStatusQuery = trpc.fml.contests.getJoinStatus.useQuery(
    { contestId: id },
    {
      enabled: !!user,
    },
  );

  const joinMutation = trpc.fml.contests.join.useMutation({
    onSuccess: () => {
      trpcUtils.fml.contests.getJoinStatus.setData(
        { contestId: id },
        { isJoined: true },
      );
    },
    onError: () => {
      toast.error("Failed to join the game. Please try again.");
    },
  });

  const handleJoin = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!myRoster || myRoster.length === 0) {
        manageRoster(game.league?.id ?? "", {
          onSave: () => {
            joinMutation.mutate({
              contestId: id,
              scArtistIds: eligibleArtistIdsInRosterForGame,
            });
          },
        });
        toast.error("Please create your roster to join the game.");
        return;
      }

      joinMutation.mutate({
        contestId: id,
        scArtistIds: eligibleArtistIdsInRosterForGame,
      });
    },
    [eligibleArtistIdsInRosterForGame, id],
  );

  // Check if user has joined
  const isJoined = !!user && (joinStatusQuery.data?.isJoined ?? false);
  const isGameEnded = dayjs(game.endDate).isBefore(dayjs());
  const tags = [
    `${game.league?.displayName ?? ""} League`,
    ...game.traits.map((trait) => trait.value),
  ];

  const [open, setOpen] = React.useState(false);

  const leaderboardQuery = trpc.fml.contests.leaderboard.get.useQuery(
    { gameId: game.id },
    { enabled: open },
  );

  const userRank = useMemo(() => {
    return leaderboardQuery.data?.find((u) => u.userId === user?.uid)?.rank;
  }, [leaderboardQuery.data, user?.uid]);

  const userRankOrdinalText = useMemo(() => {
    if (!userRank) return "";
    const english_ordinal_rules = new Intl.PluralRules("en", {
      type: "ordinal",
    });
    const suffixes = {
      zero: "th",
      one: "st",
      two: "nd",
      few: "rd",
      many: "th",
      other: "th",
    };
    const category = english_ordinal_rules.select(userRank);
    const suffix = suffixes[category];
    return userRank + suffix;
  }, [userRank]);

  // Helper to prevent modal open when clicking Join
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on a button or inside a button, do not open modal
    if ((e.target as HTMLElement).closest("button")) return;
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex overflow-hidden flex-col justify-center rounded-xl border border-solid bg-sky-700 bg-opacity-20 border-white border-opacity-20 w-full cursor-pointer hover:opacity-90 transition-opacity",
            className,
          )}
          onClick={handleCardClick}
          tabIndex={0}
          role="button"
          aria-label={`Open details for ${game.name}`}
        >
          {/* Game info */}
          <section className="flex gap-1 items-start p-3 w-full text-xs font-semibold tracking-normal leading-none text-white">
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                {index > 0 && tags.length > 1 && (
                  <span className="text-zinc-400">•</span>
                )}
                <span className="capitalize">{tag}</span>
              </React.Fragment>
            ))}
          </section>

          {/* Game thumbnail */}
          <div className="flex overflow-hidden relative w-full rounded-lg bg-zinc-900">
            <Image
              src={game.image ?? "/images/avatar-fallback.webp"}
              alt="Game thumbnail"
              width={500}
              height={500}
              className="object-cover shrink-0 aspect-[0.92] w-[120px]"
            />

            <section className="z-0 flex-1 p-3 pt-4 flex flex-col justify-between">
              <div className="flex flex-row w-full text-white">
                <div className="flex flex-col w-full text-white">
                  <h2 className="text-base font-bold tracking-normal leading-none mb-2">
                    {game.name}
                  </h2>
                  <Badge className="bg-zinc-800 hover:bg-zinc-800 text-white gap-1 text-[10px] w-fit font-medium rounded-md p-1.5 py-0.5">
                    <Timer size={10} />
                    <span>
                      {dayjs(game.endDate).isBefore(dayjs())
                        ? "Ended"
                        : dayjs(game.startDate).isAfter(dayjs())
                          ? `Starts ${dayjs(game.startDate).fromNow()}`
                          : `Ends ${dayjs(game.endDate).fromNow()}`}
                    </span>
                  </Badge>
                </div>

                {showEligibleRoster && (
                  <EligibleRosterArtists
                    scArtistIds={eligibleArtistIdsInRosterForGame}
                  />
                )}
              </div>

              <div className="flex gap-10 justify-between items-center w-full text-[10px] font-bold tracking-normal leading-none text-center whitespace-nowrap mt-4">
                {primaryAction ? (
                  primaryAction
                ) : (
                  <>
                    {isAuthenticated === null ? (
                      <div className="h-6 w-16 bg-zinc-800 animate-pulse rounded-full" />
                    ) : (
                      <button
                        onClick={handleJoin}
                        disabled={
                          joinMutation.isPending || isGameEnded || isJoined
                        }
                        className={cn(
                          "flex gap-1 justify-center items-center h-6 px-4 py-1 text-black rounded-full disabled:cursor-not-allowed",
                          isJoined
                            ? "bg-[#9BE15D] opacity-100"
                            : "bg-zinc-100 disabled:opacity-50",
                        )}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </section>

            <Badge className="absolute top-2 z-0 left-2 bg-zinc-800 hover:bg-zinc-800 text-white gap-1 text-[10px] font-medium rounded-md p-1.5 py-0.5">
              <Users2 size={10} />
              <span>{game.participantCount}</span>
            </Badge>

            <Badge className="absolute bottom-2 z-0 left-2 bg-zinc-800 hover:bg-zinc-800 text-white gap-1 text-[10px] font-medium rounded-md p-1.5 py-0.5  fml-game-prize-badge">
              <Trophy size={14} />
              <span>${game.prizeAmount}</span>
            </Badge>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent style={{ backgroundColor: "#111112" }}>
        <div className="relative mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Top row: Title + Score circle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">{game.name}</span>
            </div>
            <div className="relative">
              {userRank && (
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-pink-500 to-yellow-400 flex items-center justify-center font-bold text-white">
                  <div className="w-12 h-12 rounded-full bg-[#111112] flex items-center justify-center">
                    <span>{userRankOrdinalText}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Prize Information Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="prizes"
              className="border border-white/10 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="text-white bg-neutral-700 px-4 py-2">
                Rules
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="space-y-6">
                  {/* Prizes Box */}
                  <div className="border border-white/10 rounded-lg p-4">
                    <span className="text-white/80 font-semibold mb-4 text-lg block">
                      Prizes
                    </span>
                    <div className="space-y-2">
                      {game.prizes?.map((prize) => (
                        <div key={prize.id}>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">
                              {prize.prizeDescription}
                            </span>
                            <span className="text-white font-semibold">
                              {prize.prizeType === "cash" ? "£" : ""}
                              {prize.prizeValue}
                            </span>
                          </div>
                          <Separator className="my-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traits Box */}
                  <div className="border border-white/10 rounded-lg p-4">
                    <span className="text-white/80 font-semibold mb-4 text-lg block">
                      Required Artist Traits
                    </span>
                    <div className="space-y-2">
                      {game.traits.map((trait) => (
                        <div key={trait.id}>
                          <div className="flex items-center justify-between">
                            <span className="text-white/80">
                              {capitalizeFirstLetter(trait.type)}
                            </span>
                            <span className="text-white font-semibold">
                              {capitalizeFirstLetter(trait.value)}
                            </span>
                          </div>
                          <Separator className="my-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Leaderboard Table */}
          <p className="text-white text-base font-bold">Leaderboard</p>
          <div className="bg-white/5 rounded-xl p-2">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-400 font-semibold">
                  <th className="text-center px-2 py-1 w-8">#</th>
                  <th className="text-left px-2 py-1">User</th>
                  <th className="text-right px-2 py-1">Artist Points</th>
                  <th className="text-right px-2 py-1">User Points</th>
                  <th className="text-right pl-4 px-2 py-1 font-bold">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <Separator className="my-1" />
                  </td>
                </tr>
                {leaderboardQuery.isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-400">
                      Loading...
                    </td>
                  </tr>
                ) : leaderboardQuery.isError ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-red-400">
                      Failed to load leaderboard
                    </td>
                  </tr>
                ) : (
                  <>
                    {leaderboardQuery.data?.map((entry) => (
                      <tr
                        key={entry.userId}
                        className={cn(
                          "transition",
                          entry.userId === user?.uid
                            ? "bg-white/5 text-orange-300 font-bold"
                            : "hover:bg-white/5",
                        )}
                      >
                        <td className="px-2 py-3 text-center w-8">
                          {entry.rank}
                        </td>
                        <td className="px-2 py-3">
                          <span className="flex items-center gap-2">
                            {entry.user.image ? (
                              <img
                                src={entry.user.image}
                                alt={entry.user.name}
                                className="w-6 h-6 rounded-full object-cover border border-white/20"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-zinc-700 border border-white/20" />
                            )}
                            <span className="truncate">
                              {entry.userId === user?.uid
                                ? "YOU"
                                : entry.user.name}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 py-3 text-right w-14">
                          {entry.artistPoints}
                        </td>
                        <td className="px-2 py-3 text-right w-14">
                          {entry.userPoints}
                        </td>
                        <td className="px-2 py-3 text-right w-14 font-bold">
                          {entry.totalPoints}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const EligibleRosterArtists = ({ scArtistIds }: { scArtistIds: string[] }) => {
  return (
    <div className="flex flex-row items-center pl-5">
      {scArtistIds.map((artistId, index) => (
        <div key={artistId} style={{ zIndex: 5 - index }} className="-ml-5">
          <ArtistAvatar scArtistId={artistId} />
        </div>
      ))}
    </div>
  );
};
