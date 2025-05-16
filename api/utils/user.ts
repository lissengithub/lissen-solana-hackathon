import { and, db, eq, managers } from "@libs/neon";
import { TRPCError } from "@trpc/server";

export const verifyManagerOfArtist = async (
  userId: string,
  artistId: string,
) => {
  // Check userId is a manager of the artistId
  const managersData = await db.user.query.managers.findFirst({
    where: and(
      eq(managers.userId, userId),
      eq(managers.entityId, artistId),
      eq(managers.entityType, "artist"),
    ),
  });

  if (managersData === undefined) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "userId does not manage artistId",
    });
  }
};

export const userIsManagerOfArtist = async (
  userId: string,
  artistId: string,
): Promise<boolean> => {
  try {
    await verifyManagerOfArtist(userId, artistId);
    return true;
  } catch {
    return false;
  }
};
