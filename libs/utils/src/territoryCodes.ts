import { Deal } from "@libs/types/song-ingest";

export const VALID_TERRITORY_CODES = ["GB", "Worldwide"] as const;

export type ValidTerritoryCode = (typeof VALID_TERRITORY_CODES)[number];

export type ValidTerritoryValue = {
  [key in ValidTerritoryCode]?: string;
};

export type ValidTerritoryDeals = {
  [key in ValidTerritoryCode]: Deal;
};

export const matchTerritoryCode = (
  countryCode: string | string[] | null | undefined,
): ValidTerritoryCode => {
  if (!countryCode) return "Worldwide";

  let inputCode: string;
  if (Array.isArray(countryCode)) {
    if (countryCode.length === 0) return "Worldwide";
    inputCode = countryCode[0];
  } else {
    inputCode = countryCode;
  }

  const index = VALID_TERRITORY_CODES.indexOf(inputCode as any);
  if (index !== -1) {
    return VALID_TERRITORY_CODES[index];
  }

  return "Worldwide";
};

export const mappedTerritoryCode = (
  territoryCode: ValidTerritoryCode,
): ValidTerritoryCode => {
  if (territoryCode === "Worldwide") return "GB";

  return territoryCode;
};

export const getDateForTerritory = (
  territoryCode: ValidTerritoryCode,
): Date => {
  let serverTime;

  if (territoryCode === "Worldwide") {
    serverTime = new Date();
  } else {
    // TODO: Convert territoryCode to a timezone and apply
    // offset to Date so that serverTime is country specific.
    serverTime = new Date();
  }

  serverTime.setUTCHours(0, 0, 0, 0);
  return serverTime;
};

export const getAvailableTerritoryCodes = (
  deals: ValidTerritoryDeals,
): ValidTerritoryCode[] => {
  const territoryCodes: ValidTerritoryCode[] = [];

  for (const key in deals) {
    const territoryCode = key as ValidTerritoryCode;
    const deal = deals[territoryCode];
    const dateForTerritory = getDateForTerritory(territoryCode);
    if (
      new Date(deal.startDate) <= dateForTerritory &&
      (!deal.endDate || new Date(deal.endDate) >= dateForTerritory)
    ) {
      territoryCodes.push(territoryCode);
    }
  }

  return territoryCodes;
};

export const readTerritoryValue = (
  field: ValidTerritoryValue | null | undefined,
  countryCode: string | null | undefined,
) => {
  if (!field) return "";
  if (!countryCode) return field.Worldwide ?? Object.values(field)?.[0] ?? "";
  return (
    field[countryCode as keyof ValidTerritoryValue] ??
    //TODO: this is a hack to keep old catalog in prod working, to remove when new catalog is in prod
    ((field as any).default as string | undefined) ??
    field.Worldwide ??
    Object.values(field)?.[0] ??
    ""
  );
};
