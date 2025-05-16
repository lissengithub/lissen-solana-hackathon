import { db, eq, users, or, accessTickets } from "@libs/neon";
import { protectedProcedure } from "../../trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
import createUser from "./helpers/createUser";

export default protectedProcedure
  .input(z.object({ songIds: z.array(z.string()).optional() }).optional())
  .output(
    z.object({
      status: z.literal("ok"),
      onboardingStatus: z.enum(["onboarding_complete", "onboarding_required"]),
      isSignup: z.boolean(),
      uid: z.string(),
      email: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx: { uid, territoryCode, logger, email } }) => {
    // Find user by either ID or email
    const user = await db.user.query.users.findFirst({
      where: email
        ? or(eq(users.id, uid), eq(users.email, email))
        : eq(users.id, uid),
      columns: {
        id: true,
      },
    });

    if (user && user.id !== uid) {
      // Update ID if user found by email
      await db.user.update(users).set({ id: uid }).where(eq(users.id, user.id));

      // Update user ID in tickets table
      await db.user
        .update(accessTickets)
        .set({ userId: uid })
        .where(eq(accessTickets.userId, user.id));

      logger.info(`Updated user ID from ${user.id} to ${uid}`);
    } else if (!user) {
      // Create new user if not found
      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No email provided in JWT",
        });
      }

      await createUser({
        email,
        logger,
        uid,
        territoryCode,
      });
    }

    // This endpoint should tell the caller if onboarding is necessary.
    // For now, we hardcode it to onboarding_complete.
    // In the future, it will check if song_ids are provided decide if onboarding is necessary.
    const onboardingStatus = "onboarding_complete";

    return { status: "ok", onboardingStatus, isSignup: !user, uid, email };
  });
