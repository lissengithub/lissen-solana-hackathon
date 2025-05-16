"use client";

import React from "react";
import ContestCard from "./ContestCard";
import { useContests } from "@/hooks/fml/useContests";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ContestGrid({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { contests, isLoading } = useContests({ startDate, endDate });
  const router = useRouter();

  if (contests.length === 0 && !isLoading) {
    return <Empty />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard
            key={contest.id}
            id={contest.id}
            timeRemaining={contest.timeRemaining}
            prizeAmount={contest.prizeAmount}
            name={contest.name}
            backgroundImage={contest.backgroundImage}
            isJoined={contest.isJoined}
            onClick={() => {
              router.push(`/play?contestId=${contest.id}`, {
                scroll: false,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

const Empty = () => {
  return (
    <div className="flex flex-row justify-center mt-12 md:mt-16 lg:mt-20">
      <div className="flex flex-col items-center max-w-[284px] md:max-w-[320px] lg:max-w-[360px] opacity-70">
        <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px] bg-zinc-800/10 border border-zinc-700 rounded-full flex justify-center items-center mb-2 md:mb-3 lg:mb-4">
          <Image
            src="/images/contest-empty-trophy-icon.png"
            alt="No contests"
            width={28}
            height={28}
            className="object-cover md:w-[32px] md:h-[32px] lg:w-[36px] lg:h-[36px]"
          />
        </div>
        <h3 className="mb-2 md:mb-3 lg:mb-4 text-lg md:text-xl lg:text-2xl font-semibold text-white">
          No Contests Available
        </h3>
        <p className="text-zinc-400 text-center text-sm md:text-base lg:text-lg">
          There are no contests scheduled for the selected week. Please choose a
          different week or check back later.
        </p>
      </div>
    </div>
  );
};
