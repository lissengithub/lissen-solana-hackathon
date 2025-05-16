import { ValidTerritoryCode } from "./territoryCodes";

export * from "./territoryCodes";

export * from "./experiences";
export * from "./experiences.constants";

export * from "./stats.bigquery";

export * from "./videocall.constants";

export const TODAYS_TOP_HITS_ID = "todays_top_hits";

export const getTodaysTopHitsId = (territoryCode: ValidTerritoryCode) =>
  `${territoryCode.toLocaleLowerCase()}_${TODAYS_TOP_HITS_ID}`;

export const isTodaysTopHitsId = (
  id: string,
  territoryCode: ValidTerritoryCode,
) => id === getTodaysTopHitsId(territoryCode);
