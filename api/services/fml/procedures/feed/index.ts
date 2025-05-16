import { router } from "../../../../trpc";
import getFeed from "./get";
import getNewerFeedItems from "./getNewer";
import toggleLike from "./toggleLike";
import getLiked from "./getLiked";

export const feedRouter = router({
  get: getFeed,
  getNewer: getNewerFeedItems,
  toggleLike,
  getLiked,
});
