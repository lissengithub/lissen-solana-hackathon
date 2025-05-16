import "./loadEnv"; // THIS MUST BE THE VERY FIRST IMPORT

import * as functions from "@google-cloud/functions-framework";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { createContext } from "./trpc";
import appRouter from "./router";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import cors from "cors";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const firebaseApp = initializeApp();

const app = express();

const trpc = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createContext,
});

app.use(cors());

app.use("/api/trpc", (req, res, next) => {
  if (req.path.includes("v1")) {
    req.url = req.url.replace("v1/", "");
  }
  return trpc(req, res, next);
});

if (process.env.NODE_ENV === "development") {
  app.use("/get-token", async (req, res) => {
    const uid = req.body.uid;
    const token = await getAuth(firebaseApp).createCustomToken(uid);
    res.send({
      token,
    });
  });
}

functions.http("api", app);
