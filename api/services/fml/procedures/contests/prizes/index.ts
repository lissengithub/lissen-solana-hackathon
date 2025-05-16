import { router } from "../../../../../trpc";
import listByContestId from "./listByContestId";

export const prizesRouter = router({
  listByContestId,
});
