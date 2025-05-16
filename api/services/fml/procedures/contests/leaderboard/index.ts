import { router } from "../../../../../trpc";
import getAll from "./getAll";
import getMini from "./getMini";
import get from "./get";

export const leaderboardRouter = router({
  getAll,
  getMini,
  get,
});
