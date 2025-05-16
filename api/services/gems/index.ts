import { router } from "../../trpc";
import getGems from "./procedures/getGems";
import rewardGem from "./procedures/rewardGem";

export const gemsRouter = router({
  getGems,
  rewardGem,
});
