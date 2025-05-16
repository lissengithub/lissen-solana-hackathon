import { relations } from "drizzle-orm";
import { pgTable, varchar, jsonb, text, boolean } from "drizzle-orm/pg-core";
import { ValidTerritoryCode } from "@libs/utils";
import { timestamps } from "../../utils/fields";
import { consumers } from "./consumers";
import { usersGems } from "./users_gems";

export const users = pgTable("users", {
  ...timestamps,
  id: varchar("id", { length: 28 }).notNull().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  //deprecated in favour of fcmToken and apnToken
  expoPushToken: varchar("expo_push_token", { length: 70 }),
  fcmToken: varchar("fcm_token", { length: 255 }),
  apnToken: varchar("apn_token", { length: 255 }),
  countryCode: text("country_code").$type<ValidTerritoryCode>(),
  originalCountryCode: text("original_country_code"),
  image: text("image"),
  flags: jsonb("flags")
    .$type<{
      welcome_seen?: boolean;
    }>()
    .notNull(),
  consumerId: varchar("consumer_id", { length: 36 }),
  blurhash: varchar("blurhash", { length: 200 }),
  referredBy: varchar("referred_by", { length: 36 }),
  lastSession: jsonb("last_session").$type<{
    timestamp: string | null;
    appVersion: string | null;
    appBuildNumber: string | null;
    updateId: string | null;
    channel: string | null;
    os: string | null;
    osVersion: string | null;
    device: string | null;
    deviceVersion: string | null;
  }>(),
  stripeCustomerId: varchar("stripe_customer_id"),
  onboarded: boolean("onboarded").default(false).notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  consumer: one(consumers, {
    fields: [users.consumerId],
    references: [consumers.id],
  }),
  usersGems: one(usersGems, {
    fields: [users.id],
    references: [usersGems.userId],
  }),
}));
