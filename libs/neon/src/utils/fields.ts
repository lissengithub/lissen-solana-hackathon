import { ValidTerritoryCode, ValidTerritoryValue } from "@libs/utils";
import { sql } from "drizzle-orm";
import { customType, varchar } from "drizzle-orm/pg-core";

export const customTimestamp = customType<{
  data: string;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision =
      typeof config?.precision !== "undefined" ? ` (${config.precision})` : "";
    return `timestamp${precision}${
      config?.withTimezone ? " with time zone" : ""
    }`;
  },
  fromDriver(value: string): string {
    return new Date(value).toISOString();
  },
});

export const timestampWithTimezone = (fieldName: string) => {
  return customTimestamp(fieldName, {
    withTimezone: true,
    precision: 6,
  });
};

export const timestamps = {
  createdAt: timestampWithTimezone("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestampWithTimezone("updated_at")
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
};

export const autoId = {
  id: varchar("id", { length: 36 })
    .notNull()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
};

export const ArrayOfStrings = customType<{
  data: string[];
  driverData: string;
  config: { length?: number };
}>({
  toDriver: (value: string[]): string => JSON.stringify(value),
  fromDriver: (value: string): string[] => JSON.parse(value) as string[],
  dataType(config) {
    return typeof config?.length !== "undefined"
      ? `varchar(${config.length})`
      : `varchar`;
  },
});

export const ArrayOfValidTerritoryCodes = customType<{
  data: ValidTerritoryCode[];
  driverData: string;
  config: { length?: number };
}>({
  toDriver: (value: string[]): string => JSON.stringify(value),
  fromDriver: (value: string): ValidTerritoryCode[] =>
    JSON.parse(value) as ValidTerritoryCode[],
  dataType(config) {
    return typeof config?.length !== "undefined"
      ? `varchar(${config.length})`
      : `varchar`;
  },
});

export const ValidTerritoryValueParsed = customType<{
  data: ValidTerritoryValue;
  driverData: string;
  config: { length?: number };
}>({
  toDriver: (value: ValidTerritoryValue): string => JSON.stringify(value),
  fromDriver: (value: string): ValidTerritoryValue =>
    JSON.parse(value) as ValidTerritoryValue,
  dataType(config) {
    return typeof config?.length !== "undefined"
      ? `varchar(${config.length})`
      : `varchar`;
  },
});
