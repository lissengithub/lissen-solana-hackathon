import { trpc } from "@/lib/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { timeDiffText } from "@/utils/formatting/timeDiff";

dayjs.extend(utc);

export const useContests = ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
} = {}) => {
  const { data: contests, isLoading } = trpc.fml.contests.list.useQuery(
    startDate && endDate
      ? {
          startDate,
          endDate,
        }
      : undefined,
  );

  const transformedContests = contests?.map((contest) => {
    return {
      ...contest,
      timeRemaining: timeDiffText(contest.endDate),
      isJoined: dayjs().isAfter(contest.startDate),
      backgroundImage: contest.image,
    };
  });

  return {
    contests: transformedContests ?? [],
    isLoading,
  };
};

export type ContestData = ReturnType<typeof useContests>["contests"][number];
