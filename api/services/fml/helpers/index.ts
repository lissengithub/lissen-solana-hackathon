import { db, eq, fmlContestParticipants, countDistinct } from "@libs/neon";

export const getParticipantCount = async (contestId: string) => {
  let participantCount = 0;

  await db.user
    .select({ count: countDistinct(fmlContestParticipants.userId) })
    .from(fmlContestParticipants)
    .where(eq(fmlContestParticipants.contestId, contestId))
    .then((res) => {
      participantCount = res.at(0)?.count ?? 0;
    });

  return participantCount;
};
