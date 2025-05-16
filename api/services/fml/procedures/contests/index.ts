import { router } from "../../../../trpc";
import list from "./list";
import getById from "./getById";
import getTotalPrizePoolById from "./getTotalPrizePoolById";
import getTotalPrizePool from "./getTotalPrizePool";
import { leaderboardRouter } from "./leaderboard";
import { prizesRouter } from "./prizes";
import discover from "./discover";
import join from "./join";
import getByLeagueId from "./getByLeagueId";
import getJoinStatus from "./getJoinStatus";
import getByArtistId from "./getByArtistId";

export const contestsRouter = router({
  list,
  getById,
  getTotalPrizePoolById,
  getTotalPrizePool,
  leaderboard: leaderboardRouter,
  prizes: prizesRouter,
  discover,
  join,
  getByLeagueId,
  getJoinStatus,
  getByArtistId,
});
