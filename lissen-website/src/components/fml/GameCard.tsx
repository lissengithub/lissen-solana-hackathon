"use client";

import { Badge } from "@/components/ui/badge";
import { Share2, Timer, Trophy, Users2 } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface GameCardProps {
  game: {
    league: string;
    theme: string;
    type: string;
    image: string;
    title: string;
    prize: string;
    participants: number;
    timeRemaining: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  const {
    league,
    theme,
    type,
    image,
    title,
    prize,
    participants,
    timeRemaining,
  } = game;

  const handleJoin = () => {
    // Handle join action
  };

  const handleShare = () => {
    // Handle share action
  };

  return (
    <article className="flex overflow-hidden flex-col justify-center rounded-lg border border-solid bg-sky-700 bg-opacity-20 border-white border-opacity-20 w-full">
      {/* Game info */}
      <section className="flex gap-2 items-start p-[6px] w-full text-[8.8px] font-semibold tracking-normal leading-none text-white">
        <span>{league}</span>
        <span className="text-zinc-400">•</span>
        <span>{theme}</span>
        <span className="text-zinc-400">•</span>
        <span>{type}</span>
      </section>

      {/* Game thumbnail */}
      <div className="flex overflow-hidden relative w-full rounded-lg bg-zinc-900">
        <Image
          src={image}
          alt="Game thumbnail"
          width={500}
          height={500}
          className="object-cover shrink-0 aspect-[0.92] w-[71px]"
        />

        <section className="z-0 flex-1 p-1 pt-2 flex flex-col justify-between">
          <div className="flex flex-col w-full text-white">
            <h2 className="text-xs font-bold tracking-normal leading-none">
              {title}
            </h2>
            <Badge className="flex gap-px justify-center items-center self-start mt-1 text-[6.63px] font-medium rounded bg-zinc-800 hover:bg-zinc-800 p-1 text-white">
              <Trophy size={6.5} />
              <span>{prize}</span>
            </Badge>
          </div>

          <div className="flex gap-10 justify-between items-center w-full text-[6.3px] font-bold tracking-normal leading-none text-center whitespace-nowrap mt-2 ">
            <button
              onClick={handleJoin}
              className="flex gap-0.5 justify-center items-center h-4 px-3 py-0.5 text-black bg-zinc-100 rounded-full"
            >
              Join
            </button>
            <button
              onClick={handleShare}
              className="flex gap-0.5 justify-center items-center h-5 px-2 py-0.5 text-white bg-zinc-800 rounded-full"
            >
              <Share2 size={6.7} />
              <span>Share</span>
            </button>
          </div>
        </section>

        <Badge className="absolute top-1 z-0 left-[5px] bg-zinc-800 hover:bg-zinc-800 text-white gap-1 text-[6.3px] font-medium rounded-md p-1 py-0">
          <Users2 size={6.5} />
          <span>{participants}</span>
        </Badge>

        <Badge className="absolute bottom-1 z-0 left-[5px] bg-zinc-800 hover:bg-zinc-800 text-white gap-1 text-[6.3px] font-medium rounded-md p-1 py-0">
          <Timer size={6.5} />
          <span>{timeRemaining}</span>
        </Badge>
      </div>
    </article>
  );
}
