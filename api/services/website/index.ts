import { router } from "../../trpc";
import me from "./procedures/user/me";

export const websiteRouter = router({
  user: {
    me,
  },
});
