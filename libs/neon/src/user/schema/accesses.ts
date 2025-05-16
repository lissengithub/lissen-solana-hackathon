import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps, autoId } from "../../utils/fields";
import { accessCollaborators } from "./access_collaborators";
import { ACCESS_TYPE_OPTIONS } from "@libs/utils";
import { accessTickets } from "./access_tickets";
import { accessBonusGiveawayTickets } from "./access_bonus_giveaway_tickets";
import { accessVouchers } from "./access_vouchers";
import { accessTypeConcert } from "./access_type_concert";
import { accessBonusGiveaways } from "./access_bonus_giveaways";
import { accessTypeMerch } from "./access_type_merch";
import { accessBonusDirects } from "./access_bonus_directs";
import { accessTypeSong } from "./access_type_song";

export const accesses = pgTable("accesses", {
  ...timestamps,
  ...autoId,

  // common required
  artistId: varchar("artist_id", { length: 36 }).notNull(),

  // external required
  extLink: text("ext_link").notNull().default(""),

  // internal required
  defaultPrice: decimal("default_price").notNull(),
  ticketAmount: integer("ticket_amount").notNull(),
  type: varchar("type", {
    length: 20,
    enum: ACCESS_TYPE_OPTIONS,
  }).notNull(),

  // common optional
  image: text("image"),

  // misc
  boost: integer("boost").notNull().default(0),

  isPinned: boolean("is_pinned"),
  isBonusOnly: boolean("is_bonus_only").notNull().default(false),
});

export const accessesRelations = relations(accesses, ({ many }) => ({
  accessTickets: many(accessTickets),
  accessCollaborators: many(accessCollaborators),
  accessBonusGiveawayTickets: many(accessBonusGiveawayTickets),
  accessVouchers: many(accessVouchers),
  accessTypeConcerts: many(accessTypeConcert),
  accessTypeMerch: many(accessTypeMerch),
  accessTypeSong: many(accessTypeSong),
  accessBonusGiveaways: many(accessBonusGiveaways),
  accessBonusDirects: many(accessBonusDirects),
}));
