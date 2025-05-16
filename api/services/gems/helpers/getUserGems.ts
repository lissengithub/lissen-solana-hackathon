import { db, eq, usersGems } from "@libs/neon";

export const getUserGems = async (uid: string) => {
  const userGems = await db.user.query.usersGems.findFirst({
    columns: {
      gems: true,
    },
    where: eq(usersGems.userId, uid),
  });

  if (!userGems) {
    await db.user.insert(usersGems).values({ userId: uid, gems: 0 });
    return { gems: 0 };
  }

  return userGems;
};
