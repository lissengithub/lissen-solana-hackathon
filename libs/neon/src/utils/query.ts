import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  Query,
  QueryConfiguration,
  QueryModifier,
  territoryCodeQueryModifier,
} from "./queryModifiers";

type PartialQueryConfiguration = Omit<
  QueryConfiguration,
  "excludeWorldwideTerritoryCode"
> &
  Partial<Pick<QueryConfiguration, "excludeWorldwideTerritoryCode">>;

//this is what query was
export type OriginalQueryType<TSchema extends Record<string, unknown>> =
  NeonHttpDatabase<TSchema>["query"];

export type QueryTableKey<TSchema extends Record<string, unknown>> =
  keyof OriginalQueryType<TSchema>;

const injectQueryModifiers = (
  queryModifiers: QueryModifier[],
  table: any,
  queryConfiguration: QueryConfiguration,
  query?: Query,
): Query | undefined =>
  queryModifiers.reduce(
    (acculumatedQuery: Query | undefined, current: QueryModifier) =>
      current(table, queryConfiguration, acculumatedQuery),
    query,
  );

export const territorySafeQuery = <TSchema extends Record<string, unknown>>(
  database: NeonHttpDatabase<TSchema>,
): ((
  queryConfiguration: PartialQueryConfiguration,
) => OriginalQueryType<TSchema>) => {
  // Note: We use these maps to prevent recursive injections.
  const injectedFindFirstMap: Partial<Record<QueryTableKey<TSchema>, any>> = {};
  const injectedFindManyMap: Partial<Record<QueryTableKey<TSchema>, any>> = {};

  // Note: Query modifiers are applied via reduce left.
  const queryModifiers: QueryModifier[] = [territoryCodeQueryModifier];

  // Note: We use pass by reference to allow the injected functions to close over this
  // configuration and thus allow it to correctly use the territoryCode that is passed
  // in during call time for query.
  const queryConfiguration: QueryConfiguration = {
    excludeWorldwideTerritoryCode: false,
    territoryCode: "Worldwide",
  };

  return ({
    excludeWorldwideTerritoryCode,
    territoryCode,
  }: PartialQueryConfiguration): OriginalQueryType<TSchema> => {
    queryConfiguration.territoryCode = territoryCode;

    if (excludeWorldwideTerritoryCode !== undefined) {
      queryConfiguration.excludeWorldwideTerritoryCode =
        excludeWorldwideTerritoryCode;
    }

    for (const key in database.query) {
      const queryTableKey = key as QueryTableKey<TSchema>;
      //have to cast to any because ts doesn't resolve the correct type - findFirst and findMany are not on the table
      const table = database.query[queryTableKey] as any;

      if (
        table?.["tableConfig"] &&
        typeof table?.findFirst === "function" &&
        typeof table?.findMany === "function"
      ) {
        const findFirst = table.findFirst;
        const findMany = table.findMany;
        let injectedFindFirst: any = injectedFindFirstMap[queryTableKey];
        let injectedFindMany: any = injectedFindManyMap[queryTableKey];

        if (findFirst !== injectedFindFirst) {
          injectedFindFirst = (query: Query): any =>
            findFirst.call(
              table,
              injectQueryModifiers(
                queryModifiers,
                table,
                queryConfiguration,
                query,
              ),
            );
          injectedFindFirstMap[queryTableKey] = injectedFindFirst;
          table.findFirst = injectedFindFirst;
        }

        if (findMany !== injectedFindMany) {
          injectedFindMany = (query: Query): any =>
            findMany.call(
              table,
              injectQueryModifiers(
                queryModifiers,
                table,
                queryConfiguration,
                query,
              ),
            );
          injectedFindManyMap[queryTableKey] = injectedFindMany;
          table.findMany = injectedFindMany;
        }
      }
    }

    return database.query;
  };
};

type TerritorySafeDatabase<TSchema extends Record<string, unknown>> = Omit<
  NeonHttpDatabase<TSchema>,
  "query"
> & { query: ReturnType<typeof territorySafeQuery<TSchema>> };

export const injectTerritorySafeQuery = <
  TSchema extends Record<string, unknown>,
>(
  database: NeonHttpDatabase<TSchema>,
): TerritorySafeDatabase<TSchema> => {
  const {
    batch,
    $with,
    _,
    execute,
    insert,
    refreshMaterializedView,
    select,
    selectDistinct,
    selectDistinctOn,
    transaction,
    update,
    with: withRenamed, //this is renamed because with is a reserved word in JavaScript
    delete: deleteRenamed, //this is renamed because delete is a reserved word in JavaScript
  } = database;

  return {
    batch: batch.bind(database),
    $with: $with.bind(database),
    _,
    execute: execute.bind(database),
    insert: insert.bind(database),
    refreshMaterializedView: refreshMaterializedView.bind(database),
    select: select.bind(database),
    selectDistinct: selectDistinct.bind(database),
    selectDistinctOn: selectDistinctOn.bind(database),
    transaction: transaction.bind(database),
    update: update.bind(database),
    with: withRenamed.bind(database),
    delete: deleteRenamed.bind(database),
    query: territorySafeQuery(database).bind(database),
  };
};
