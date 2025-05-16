import Logger from "@libs/logger";
import {
  mappedTerritoryCode,
  matchTerritoryCode,
  ValidTerritoryCode,
} from "@libs/utils";
import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import fbAdmin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";
import { ZodError } from "zod";

const IS_LOCAL_DEV =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const LOCAL_DEV_LOGGER_SETTINGS = [
  {
    path: "user.recommendations.getForYou",
    logsEnabled: true,
    logResponseData: false,
  },
];

const getFirebaseAuth = async (
  token: string,
): Promise<{ email?: string; isAdmin: boolean; uid: string | null }> => {
  try {
    const decodedToken = await fbAdmin.auth().verifyIdToken(token);
    const email = decodedToken.email;
    const isAdmin: boolean = decodedToken.isAdmin || false;
    const uid = decodedToken.uid;
    return { email, isAdmin, uid };
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return { isAdmin: false, uid: null };
  }
};

const verifyBackendToken = async (
  token: string,
  hostname: string,
): Promise<boolean> => {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(hostname);
    const result = await client.verifyIdToken({
      idToken: token.split(" ")[1],
    });

    return !!result;
  } catch (error) {
    console.error("Error verifying backend token:", error);
    return false;
  }
};

export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const logger = new Logger({ endpoint: req.url, headers: req.headers });

  async function getUIDFromHeader() {
    const authResult: {
      email?: string;
      isAdmin: boolean;
      isBackend: boolean;
      uid: string | null;
    } = {
      isAdmin: false,
      isBackend: false,
      uid: null,
    };

    const authHeader =
      (req.headers["x-forwarded-authorization"] as string | undefined) ||
      req.headers.authorization;

    const originalAuthHeader = req.headers.authorization;
    if (authHeader) {
      const userToken = authHeader.split(" ")[1];
      const { isAdmin, email, uid } = await getFirebaseAuth(userToken);
      authResult.isAdmin = isAdmin;
      authResult.email = email;
      authResult.uid = uid;
    }

    if (!authResult.uid && originalAuthHeader) {
      authResult.isBackend = await verifyBackendToken(
        originalAuthHeader,
        req.hostname,
      );
    }
    return authResult;
  }

  const opts = await getUIDFromHeader();
  const appVersion = req.headers["app-version"] as string;

  // Note: We expect the Country-Code header to have been set based upon the country_code value
  // stored for the user within the users db.
  let territoryCode = matchTerritoryCode(req.headers["country-code"]);

  // Note: territory code mapping allows us to enable additional content for Worldwide users since
  // by default, catalog queries already include Worldwide content filtering and at present, we
  // only use the territoryCode for catalog queries.
  territoryCode = mappedTerritoryCode(territoryCode);

  const ctx: {
    email?: string;
    isAdmin: boolean;
    isBackend: boolean;
    logger: Logger;
    territoryCode: ValidTerritoryCode;
    uid: string | null;
    appVersion: string;
  } = {
    email: opts?.email,
    isAdmin: opts?.isAdmin || false,
    isBackend: opts?.isBackend || false,
    logger,
    territoryCode,
    uid: opts?.uid || null,
    appVersion: appVersion,
  };

  // logger.info("Created ctx:", ctx);

  return ctx;
};

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
  transformer: {
    input: {
      serialize: (object) => {
        // TRPC client sending data
        // TRPC client sends data as string with quotes when batching is off so we are overriding the serialize method to send data as object
        // Also since TRPC client sets content-type to application/json, we need to actually send valid JSON
        if (typeof object === "string") {
          return { internalData: object };
        } else {
          return object;
        }
      },
      deserialize: (object) => {
        // TRPC server receiving data
        if (typeof object === "object" && "internalData" in object) {
          return object.internalData;
        } else {
          return object;
        }
      },
    },
    output: {
      // TRPC server sending data
      serialize: (object) => object,
      // TRPC client receiving data
      deserialize: (object) => object,
    },
  },
});

const trpcLogger = t.procedure.use(async (opts) => {
  const { ctx, input, next, path, type } = opts;
  const { logger, uid } = ctx;

  logger.addMeta({ input, method: type, uid });

  if (IS_LOCAL_DEV) {
    const localDevSettings = LOCAL_DEV_LOGGER_SETTINGS.find(
      (x) => x.path === path,
    );
    if (localDevSettings?.logsEnabled) {
      logger.info(`Procedure started: ${path}`);
    }
  } else {
    logger.info(`Procedure started: ${path}`);
  }

  const start = Date.now();

  const result = await next({
    ctx: {
      ...ctx,
      logger,
    },
  });

  const durationMs = Date.now() - start;

  logger.addMeta({ durationMs });

  if (result.ok) {
    if (IS_LOCAL_DEV) {
      const localDevSettings = LOCAL_DEV_LOGGER_SETTINGS.find(
        (x) => x.path === path,
      );

      //if there's no specific setting, we log without data
      if (!localDevSettings) {
        logger.info(`Procedure completed: ${path} - ${durationMs}ms`, {
          _: "not-logging-in-local",
        });
      } else {
        if (localDevSettings?.logsEnabled) {
          if (localDevSettings?.logResponseData) {
            logger.info(
              `Procedure completed: ${path} - ${durationMs}ms`,
              result.data,
            );
          } else {
            logger.info(`Procedure completed: ${path} - ${durationMs}ms`, {
              _: "not-logging-in-local",
            });
          }
        }
      }
    } else {
      logger.info(
        `Procedure completed: ${path} - ${durationMs}ms`,
        result.data,
      );
    }
  } else {
    logger.error(`Procedure failed: ${path} - ${durationMs}ms`, result.error);
  }

  return result;
});

export const router = t.router;
export const publicProcedure = trpcLogger;

export const protectedProcedure = trpcLogger.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.uid) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!ctx.territoryCode) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
  return opts.next({
    ctx: {
      territoryCode: ctx.territoryCode,
      uid: ctx.uid,
    },
  });
});

export const adminProcedure = trpcLogger.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.uid || !ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      territoryCode: ctx.territoryCode,
      uid: ctx.uid,
    },
  });
});

export const backendProcedure = trpcLogger.use(async function isBackend(opts) {
  const { ctx } = opts;
  if (!ctx.isBackend) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next();
});
