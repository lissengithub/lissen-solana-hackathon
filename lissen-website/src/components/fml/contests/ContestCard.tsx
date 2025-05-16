import Image from "next/image";
import { Timer, Trophy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/firebase/auth-context";
import { useLeaderboardMini } from "@/hooks/fml/useLeaderboardMini";
import { useLoginModal } from "@/components/LoginModal";

interface ContestCardProps {
  id: string;
  timeRemaining: string;
  prizeAmount: number;
  isJoined?: boolean;
  backgroundImage?: string | null;
  name: string;
  onClick?: () => void;
  showJoinedStatus?: boolean;
  contentClassName?: string;
  titleClassName?: string;
}

export default function ContestCard({
  id,
  timeRemaining,
  prizeAmount,
  isJoined = true,
  backgroundImage,
  name,
  onClick,
  showJoinedStatus = true,
  contentClassName,
  titleClassName,
}: ContestCardProps) {
  const { user } = useAuth();
  const { showLogin } = useLoginModal();

  return (
    <button
      className={cn(
        "w-full rounded-lg overflow-hidden",
        onClick ? "cursor-pointer" : "cursor-default",
      )}
      onClick={onClick}
      disabled={!onClick}
    >
      {/* Image Section */}
      <div className="relative h-[215px] w-full">
        <Image
          src={backgroundImage || "https://picsum.photos/seed/contest1/800/600"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Timer Badge */}
        <div className="absolute top-2.5 left-2.5">
          <div className="bg-white/70 px-2 py-1 rounded-lg border border-white/20 shadow-sm">
            <span className="text-xs font-bold text-black flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              {timeRemaining}
            </span>
          </div>
        </div>

        {/* Prize Badge */}
        <div className="absolute top-2.5 right-2.5">
          <div className="bg-amber-400 px-2 py-1 rounded-lg border border-white/20 shadow-sm">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />£{prizeAmount} in prizes
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        className={cn(
          "relative -mt-20 px-4 pb-4 pt-6 bg-gradient-to-b from-transparent from-0% via-black via-35% to-black to-100%",
          contentClassName,
        )}
      >
        <h2
          className={cn(
            "text-2xl font-bold text-white mb-4 text-center",
            titleClassName,
          )}
        >
          {name}
        </h2>

        {/* Joined Status */}
        {showJoinedStatus && (
          <div className="flex justify-center mb-4">
            {isJoined && user ? (
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-white flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Joined
                </span>
              </div>
            ) : (
              <button
                className="bg-gradient-to-b from-sky-400/20 to-blue-500/20 px-3 py-1 rounded-full border border-sky-400"
                onClick={(e) => {
                  e.stopPropagation();
                  showLogin();
                }}
              >
                <span className="text-sm font-medium text-white flex items-center justify-center">
                  Join Now
                </span>
              </button>
            )}
          </div>
        )}

        <ContestStats contestId={id} />
      </div>
    </button>
  );
}

const ContestStats = ({ contestId }: { contestId: string }) => {
  const { user } = useAuth();
  const {
    query: { data: leaderboardMini },
  } = useLeaderboardMini(contestId);

  if (!leaderboardMini) return null;
  if (!user) return null;

  const myStatusIndex = leaderboardMini?.findIndex(
    (entry) => entry.userId === user.uid,
  );

  const isInContest = myStatusIndex !== -1;
  let userAboveMe;
  let me;
  let diff;
  let diffPercentage;
  if (isInContest) {
    userAboveMe =
      myStatusIndex === 0 ? null : leaderboardMini.at(myStatusIndex - 1);
    me = leaderboardMini[myStatusIndex];
    if (userAboveMe) {
      diff = userAboveMe.totalPoints - me.totalPoints;
      diffPercentage = 100 - (diff / userAboveMe.totalPoints) * 100;
    } else {
      diff = 0;
      diffPercentage = 100;
    }
  } else {
    userAboveMe = null;
    me = {
      rank: "N/A",
      totalPoints: 0,
    };
    diff = null;
    diffPercentage = 1;
  }

  return (
    <>
      {/* Points */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {me.totalPoints} points
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${diffPercentage}%` }}
          />
        </div>

        {/* Rank Information */}
        <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
          <div>
            <span>Your current rank </span>
            <span className="inline-block bg-amber-400 text-amber-950 px-2 py-0.5 rounded-lg font-bold">
              #{me.rank}
            </span>
          </div>
          {isInContest && (
            <div className="text-right">
              {userAboveMe
                ? `${diff} pts to #${userAboveMe.rank}`
                : "You are in the lead!"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
