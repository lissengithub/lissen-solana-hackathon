import { ValidTerritoryCode } from "@libs/utils";
import { SQL, and, arrayOverlaps } from "drizzle-orm";

// eslint-disable-next-line no-restricted-syntax -- OVERRIDE used to extend existing ValidTerritoryCode type
export type OverridableTerritoryCode = ValidTerritoryCode | "OVERRIDE";

export interface QueryConfiguration {
  excludeWorldwideTerritoryCode: boolean;
  territoryCode: OverridableTerritoryCode;
}

export type Query = Partial<Record<string, any>>;

export type QueryModifier = (
  table: any,
  queryConfiguration: QueryConfiguration,
  query?: Query,
) => Query | undefined;

const getCombinedWhere = (
  whereA: SQL | undefined,
  whereB?: unknown,
): SQL | ((...args: any) => SQL | undefined) | undefined => {
  if (whereB === undefined) {
    return whereA;
  } else if (typeof whereB === "function") {
    return (...args: any) => and(whereA, whereB(...args));
  } else if (whereB instanceof SQL) {
    return and(whereA, whereB);
  } else {
    throw new Error(`Invalid where property: ${whereB}`);
  }
};

export const territoryCodeQueryModifier = (
  table: any,
  queryConfiguration: QueryConfiguration,
  query?: Query,
): Query | undefined => {
  const { excludeWorldwideTerritoryCode, territoryCode } = queryConfiguration;

  if (
    // eslint-disable-next-line no-restricted-syntax -- OVERRIDE check required to allow returning unmodified query
    territoryCode === "OVERRIDE" ||
    (excludeWorldwideTerritoryCode && territoryCode === "Worldwide")
  ) {
    return query;
  }

  if (table["tableConfig"]["columns"]?.territories) {
    const territoryCodes = [territoryCode];

    if (!excludeWorldwideTerritoryCode && territoryCode !== "Worldwide") {
      territoryCodes.push("Worldwide");
    }

    return {
      ...query,
      where: getCombinedWhere(
        // Note: This assumes that the territories column is an array of strings!
        arrayOverlaps(
          table["tableConfig"]["columns"].territories,
          territoryCodes,
        ),
        query?.where,
      ),
    };
  }

  return query;
};
