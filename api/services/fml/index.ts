import { router } from "../../trpc";

// Import sub-routers from their respective index files
import { contestsRouter } from "./procedures/contests";
import { rosterRouter } from "./procedures/roster";
import { artistMetricsRouter } from "./procedures/artistMetrics";
import { leaguesRouter } from "./procedures/leagues";
import { artistTraitsRouter } from "./procedures/artistTraits";
import { feedRouter } from "./procedures/feed"; // This should now include get and getNewer via its own index.ts
import { artistsRouter } from "./procedures/artists";

// Removed direct procedure imports that were causing errors:
// import getRoster from "./procedures/roster/get";
// import addArtistToRoster from "./procedures/roster/addArtist";
// import removeArtistFromRoster from "./procedures/roster/removeArtist";
// import getFeed from "./procedures/feed/get";
// import getNewerFeedItems from "./procedures/feed/getNewer";

export const fmlRouter = router({
  contests: contestsRouter,
  roster: rosterRouter,
  artistMetrics: artistMetricsRouter,
  leagues: leaguesRouter,
  artistTraits: artistTraitsRouter,
  feed: feedRouter,
  artists: artistsRouter,
});
