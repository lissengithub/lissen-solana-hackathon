export const ACCESS_TYPE_OPTIONS = [
  "concert",
  "merch",
  "content",
  "song",
  "experience",
] as const;

export const EXPERIENCE_TYPE_OPTIONS = [
  "concert",
  "merch",
  "bonus",
  "song",
] as const;

export const ACCESS_BONUS_TYPE_OPTIONS = ["direct", "giveaway"] as const;

export type AccessTypeOptions = (typeof ACCESS_TYPE_OPTIONS)[number];
export type AccessBonusTypeOptions = (typeof ACCESS_BONUS_TYPE_OPTIONS)[number];
