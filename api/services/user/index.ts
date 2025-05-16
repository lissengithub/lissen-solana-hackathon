import { router } from "../../trpc";
import me from "./procedures/me";
import getCDNKey from "./procedures/getCDNKey";
import auth from "./auth";

export const userRouter = router({
  me,
  auth,
  getCDNKey,
});
