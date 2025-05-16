import { appVersions, db, desc, eq, users } from "@libs/neon";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { matchTerritoryCode, VALID_TERRITORY_CODES } from "@libs/utils";
import semver from "semver";
import dayjs from "dayjs";

const schema = {
  output: z.object({
    blurhash: z.string().nullable(),
    consumer: z
      .object({
        id: z.string(),
        subscription: z.enum(["free", "premium", "premium-trial"]),
      })
      .nullable(),
    countryCode: z.enum(VALID_TERRITORY_CODES).nullable(),
    email: z.string(),
    //deprecated in favour of fcmToken and apnToken
    expoPushToken: z.string().nullable(),
    fcmToken: z.string().nullable(),
    apnToken: z.string().nullable(),
    flags: z.object({
      welcome_seen: z.boolean().optional(),
    }),
    id: z.string(),
    image: z.string().nullable(),
    name: z.string(),
    raffleTickets: z.number().nullable(),
    onboarded: z.boolean(),
    newUpdates: z.object({
      available: z.boolean(),
      showBanner: z.boolean().optional(),
      forceUpdate: z.boolean().optional(),
    }),
    createdAtUnix: z.number(),
    welcomeScreenPath: z.string().nullable(),
  }),
};

const handleCountryCode = (countryCode: string | null) => {
  return matchTerritoryCode(countryCode);
};

const handleAppUpdates = async (appVersionHeader: string) => {
  const [userAppVersion, [latestAppVersion]] = await Promise.all([
    db.user.query.appVersions.findFirst({
      where: eq(appVersions.version, appVersionHeader),
      columns: {
        forceUpdate: true,
        updateMessages: true,
        version: true,
      },
    }),
    db.user
      .select()
      .from(appVersions)
      .orderBy(desc(appVersions.createdAt))
      .limit(1),
  ]);

  const newerVersionAvailable =
    userAppVersion && latestAppVersion
      ? semver.gt(latestAppVersion.version, userAppVersion.version)
      : false;

  const newUpdates = newerVersionAvailable
    ? {
        available: true,
        showBanner: true,
        forceUpdate: userAppVersion?.forceUpdate,
      }
    : {
        available: false,
      };

  return newUpdates;
};

export default protectedProcedure
  .output(schema.output)
  .query(
    async ({ ctx: { logger, uid: userId, appVersion: appVersionHeader } }) => {
      const user = await db.user.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          blurhash: true,
          countryCode: true,
          email: true,
          expoPushToken: true,
          fcmToken: true,
          apnToken: true,
          flags: true,
          id: true,
          image: true,
          name: true,
          onboarded: true,
          createdAt: true,
        },
        with: {
          consumer: {
            with: {
              paymentProfile: true,
              wallet: {
                columns: {
                  eoa: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      logger.info("Got user...", user);

      logger.info("Handling country code...");
      const countryCode = handleCountryCode(user.countryCode);
      logger.info("Country code handled...", {
        userCountryCode: user.countryCode,
        newCountryCode: countryCode,
      });

      const newUpdates = await handleAppUpdates(appVersionHeader);

      const welcomeScreenPath: string | null = null;

      return {
        ...user,
        createdAtUnix: dayjs(user.createdAt).unix(),
        countryCode,
        newUpdates,
        welcomeScreenPath,
        raffleTickets: 0, // Deprecated
      };
    },
  );
