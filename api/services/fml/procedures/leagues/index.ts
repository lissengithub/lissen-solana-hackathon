import { router } from "../../../../trpc";
import getAll from "./getAll";

export const leaguesRouter = router({
  getAll,
});
