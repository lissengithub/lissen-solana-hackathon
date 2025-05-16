import {
  ACCESS_BONUS_TYPE_OPTIONS,
  ACCESS_TYPE_OPTIONS,
  EXPERIENCE_TYPE_OPTIONS,
} from "@libs/utils";
import { z } from "zod";

export const experienceEventInfoSchema = z.object({
  city: z.string().min(1, "Can't be empty").optional(),
  venue: z.string().min(1, "Can't be empty").optional(),
  duration: z.number().positive().optional(),
});

export const baseExperienceSchema = z.object({
  artistId: z.string(),
  eventInfo: experienceEventInfoSchema,
  id: z.string(),
  ticketAmount: z.number().gt(0),
  type: z.enum(EXPERIENCE_TYPE_OPTIONS),
});

const accessBonusGiveawaySchema = z.object({
  id: z.string(),
  participated: z.boolean(),
  won: z.boolean(),
  totalParticipants: z.number(),
  raffleDate: z.string().datetime(),
  drawn: z.boolean(),
});

const accessCollaboratorSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  image: z.string().nullable(),
});

export const baseAccessSchema = z.object({
  type: z.enum(ACCESS_TYPE_OPTIONS),
  createdAt: z.string(),
  id: z.string(),
  title: z.string(),
  artistId: z.string(),
  extLink: z.string(),
  defaultPrice: z.number(),
  ticketAmount: z.number(),
  image: z.string().nullable(),
  boost: z.number(),
  isPinned: z.boolean().nullable(),
  isBonusOnly: z.boolean(),
  artistName: z.string().trim(),
  artistImage: z.string().nullable(),
  isExternal: z.boolean(),
  bonusGiveaways: z.array(accessBonusGiveawaySchema),
  buttonText: z.string(),
  collaborators: z.array(accessCollaboratorSchema),
  surprise: z.boolean(),
});

export type BaseAccessType = z.infer<typeof baseAccessSchema>;

export const accessTypeConcertSchema = z.object({
  type: z.literal("concert"),
  dateTime: z.string(),
  instructions: z.string().nullable(),
  instructionsImage: z.string().nullable(),
  city: z.string(),
  venue: z.string(),
  userTickets: z
    .array(
      z.object({
        id: z.string(),
        defaultPrice: z.number(),
        purchasePrice: z.number(),
        redeemCode: z.string(),
      }),
    )
    .nullable(),
});

export type AccessTypeConcertType = z.infer<typeof accessTypeConcertSchema>;

export const accessTypeMerchSchema = z.object({
  type: z.literal("merch"),
  item: z.string(),
  instructions: z.string().nullable(),
});

export const accessTypeSongSchema = z.object({
  type: z.literal("song"),
  songId: z.string(),
  songTitle: z.string(),
  albumId: z.string(),
  albumTitle: z.string(),
  albumArtwork: z.string().nullable(),
  albumType: z.enum(["Album", "Single"]),
});

export type AccessTypeSongType = z.infer<typeof accessTypeSongSchema>;

export type AccessTypeMerchType = z.infer<typeof accessTypeMerchSchema>;

export const createExperienceSchema = z.object({
  artistId: z.string(),
  eventInfo: experienceEventInfoSchema,
  id: z.string(),
  ticketAmount: z.number().gt(0),
  type: z.enum(ACCESS_TYPE_OPTIONS),
  artwork: z.string().nullable().optional(),
  collaborators: z.array(z.string()).optional(),
  dateTime: z.string().datetime().optional(),
  defaultPrice: z.string(),
  extLink: z.string(),
  instructions: z.string().nullable().optional(),
  instructionsImage: z.string().nullable().optional(),
  raffleDrawDateTime: z.string().datetime().optional(),
  isPinned: z.boolean().optional(),
  isBonusOnly: z.boolean().optional(),
  boost: z.number().optional().nullable(),
  bonusGemCost: z.number().optional().nullable(),
  bonusRewardCountPerWinner: z.number().optional().nullable(),
  bonusNumberOfWinners: z.number().optional().nullable(),
  bonusStartDate: z.string().datetime().optional(),
  bonusType: z.enum(ACCESS_BONUS_TYPE_OPTIONS).optional(),
  songId: z.string().optional(),
  item: z.string().optional(),
});

export type CreateExperienceType = z.infer<typeof createExperienceSchema>;

// change ticketAmount to not have gt(0) condition. We allow draft experiences to have 0 items
export const draftExperienceSchema = createExperienceSchema.extend({
  ticketAmount: z.number(),
});

export const editExperienceSchema = createExperienceSchema.pick({
  artwork: true,
  collaborators: true,
  dateTime: true,
  defaultPrice: true,
  eventInfo: true,
  extLink: true,
  id: true,
  instructions: true,
  instructionsImage: true,
  isExternal: true,
  raffleDrawDateTime: true,
  ticketAmount: true,
  type: true,
  isPinned: true,
  isBonusOnly: true,
  boost: true,
  bonusGemCost: true,
  bonusRewardCountPerWinner: true,
  bonusNumberOfWinners: true,
  bonusStartDate: true,
  bonusType: true,
  item: true,
});

export const editExperienceOutputSchema = z.union([
  z.object({ status: z.literal("ok") }),
  z.object({ status: z.literal("error"), message: z.string() }),
]);

export const deleteExperienceSchema = z.string();

export const deleteExperienceOutputSchema = z.boolean();

export const listExperiencesSchema = z.object({
  show: z.enum(["all", "joined", "created"]).default("all"),
});

export const myItemSchema = z.object({
  id: z.string(),
  redeemCode: z.string(),
  sourceId: z.string(),
  sourceType: z.enum(["challenge", "gift"]),
  winnerId: z.string(),
  date: z.string(),
  priceOriginal: z.string(),
  priceActual: z.string(),
  experienceId: z.string(),
  type: z.enum(["ticket"]),
});

export const getExperienceSchema = z.string();
export const getAccessSchema = z.string();

export const getAccessOutputSchema = baseAccessSchema.and(
  z.discriminatedUnion("type", [
    accessTypeConcertSchema,
    accessTypeMerchSchema,
    accessTypeSongSchema,
  ]),
);

export const bonusOutputSchema = z.object({
  id: z.string(),
  bonusType: z.enum(["giveaway", "direct"]),
  accessType: z.enum(ACCESS_TYPE_OPTIONS),
  accessId: z.string(),
  artistId: z.string(),
  image: z.string(),
  title: z.string(),
  gemCost: z.number(),
  raffleDrawn: z.boolean(),
  raffleDrawTime: z.string().optional(),
  hasJoined: z.boolean(),
  hasWon: z.boolean(),
  access: getAccessOutputSchema,
});

export type GetBonusType = z.infer<typeof bonusOutputSchema>;

export const getExperienceOutputSchema = baseExperienceSchema.extend({
  artistName: z.string().trim(),
  artistImage: z.string().nullable(),
  blurhash: z.string().nullable(),
  buttonText: z.string(),
  collaborators: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim(),
        image: z.string().nullable(),
        blurhash: z.string().nullable(),
      }),
    )
    .optional(),
  dateTime: z.string().datetime(),
  defaultPrice: z.string(),
  extLink: z.string(),
  image: z.string().nullable(),
  instructions: z.string().nullable(),
  isExternal: z.boolean(),
  location: z.string().nullable(),
  numberOfEntriesForUser: z.number(),
  price: z.number(),
  raffleDrawDateTime: z.string(),
  raffleEntryCost: z.string(),
  wonRaffle: z.boolean(),
  raffleDrawn: z.boolean(),
  surprise: z.boolean(),
  remainingSpots: z.number().nullable(),
  ticketsForUser: z
    .array(
      z.object({
        id: z.string(),
        defaultPrice: z.number(),
        purchasePrice: z.number(),
        redeemCode: z.string(),
      }),
    )
    .nullable(),
  title: z.string(),
  isPinned: z.boolean().optional(),
  raffleParticipants: z.number(),
  access: getAccessOutputSchema,
});

export type GetExperienceType = z.infer<typeof getExperienceOutputSchema>;
export type Access = z.infer<typeof getAccessOutputSchema>;

export const getExperiencesSchema = z.array(z.string()).min(1);

export const getExperiencesOutputSchema = z.array(getExperienceOutputSchema);

export const getExperiencePublicOutputSchema = getExperienceOutputSchema.pick({
  id: true,
  image: true,
  dateTime: true,
  instructions: true,
  price: true,
  isExternal: true,
  extLink: true,
  artistName: true,
  location: true,
  type: true,
});

export const claimItemInputSchema = z.object({
  redeemCode: z.string(),
});

export const claimItemOutputSchema = z.object({
  valid: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string()?.optional(),
    blurhash: z.string()?.optional(),
  }),
  scannedBefore: z.boolean(),
});

// export const recombeeSearchResultSchema = z.object({
//   title: z.string(),
//   isrc: z.string().nullable(),
//   artist_names: z.array(z.string()),
//   active: z.boolean(),
//   artist_images: z.array(z.string()).nullable(),
//   album_image: z.string().nullable(),
// });
