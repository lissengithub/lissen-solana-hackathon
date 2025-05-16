import { RouterOutputs, trpc } from "@/lib/trpc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const useContest = (id: string) => {
  const { data: contest } = trpc.fml.contests.getById.useQuery(id, {
    enabled: !!id,
  });

  const { data: prizesData } =
    trpc.fml.contests.prizes.listByContestId.useQuery(id, {
      enabled: !!id,
    });

  const totalPrizePool =
    prizesData?.reduce((acc, prize) => acc + prize.prizeValue, 0) ?? 0;

  return contest
    ? {
        ...contest,
        timeRemaining: dayjs(contest?.endDate).fromNow(true),
        prizeAmount: totalPrizePool,
        isJoined: dayjs().isAfter(contest?.startDate),
        backgroundImage: contest?.image,
        prizes: prizesData ?? [],
      }
    : undefined;
};

export type ContestData = RouterOutputs["fml"]["contests"]["getById"];
