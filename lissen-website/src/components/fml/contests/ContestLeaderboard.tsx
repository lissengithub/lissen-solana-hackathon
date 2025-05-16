import { useLeaderboardMini } from "@/hooks/fml/useLeaderboardMini";
import { useMemo } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { ContestData } from "@/hooks/fml/useContest";
import { cn } from "@/lib/utils";

type ContestLeaderboardProps = {
  contest: ContestData;
  className?: string;
};

const ContestLeaderboard = ({
  contest,
  className,
}: ContestLeaderboardProps) => {
  const { user } = useAuth();
  const {
    query: { data: leaderboard },
  } = useLeaderboardMini(contest.id);

  const data = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0 || !user) {
      return [];
    }

    const myIndex = leaderboard.findIndex((u) => u.userId === user.uid);
    if (myIndex === -1) {
      return leaderboard.slice(0, 3);
    }

    const me = leaderboard[myIndex];
    if (me.rank === 1) {
      return [me, ...leaderboard.slice(1, 2)];
    }

    const aboveMe = leaderboard[myIndex - 1];
    const belowMe = leaderboard[myIndex + 1];
    return [aboveMe, me, belowMe];
  }, [leaderboard, user]);

  if (!user) return null;
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4  border border-white/10 bg-neutral-700 rounded-lg p-2",
        className,
      )}
    >
      <h3 className="text-md font-bold">Leaderboard</h3>
      <div className="flex flex-col gap-3">
        {data.map((u) => (
          <div
            key={u.userId}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-3">
              <span className="text-sm font-medium">{u.rank}</span>
              <span className="text-sm font-medium">
                {u.userId === user.uid ? "YOU" : u.user.name}
              </span>
            </div>
            <div>
              <span className="text-sm text-emerald-500">
                {u.totalPoints} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestLeaderboard;
