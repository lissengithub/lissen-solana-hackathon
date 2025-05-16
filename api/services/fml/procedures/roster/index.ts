import { router } from "../../../../trpc";
import getByUserId from "./getByUserId";
import getByLeagueId from "./getByLeagueId";
import update from "./update";

export const rosterRouter = router({
  getByUserId,
  getByLeagueId,
  update,
});
