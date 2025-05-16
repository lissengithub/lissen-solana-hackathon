export const bigqueryDatasets = {
  stats: {
    user_statuses_daily: {
      name: "user_statuses_daily",
      timePartitioning: {
        type: "DAY",
        field: "date",
      },
      schema: {
        fields: [
          { name: "date", type: "DATE" },
          { name: "user_id", type: "STRING" },
          { name: "status", type: "STRING" },
          { name: "daily_revenue", type: "FLOAT" },
        ],
      },
    },
    user_songs_daily: {
      name: "user_songs_daily",
      timePartitioning: {
        type: "DAY",
        field: "timestamp",
      },
      schema: {
        fields: [
          { name: "timestamp", type: "TIMESTAMP" },
          { name: "user_id", type: "STRING" },
          { name: "song_id", type: "STRING" },
          { name: "stream_time", type: "INTEGER" },
          { name: "gross_revenue_per_day", type: "FLOAT" },
          { name: "user_daily_revenue", type: "FLOAT" },
          { name: "user_total_daily_stream_time", type: "INTEGER" },
          { name: "number_of_streams", type: "INTEGER" },
        ],
      },
    },
    user_songs_monthly: {
      name: "user_songs_monthly",
      timePartitioning: {
        type: "MONTH",
        field: "month",
      },
      schema: {
        fields: [
          { name: "month", type: "DATE" },
          { name: "user_id", type: "STRING" },
          { name: "song_id", type: "STRING" },
          { name: "gross_revenue", type: "FLOAT" },
          { name: "gross_active_revenue", type: "FLOAT" },
          { name: "gross_inactive_revenue", type: "FLOAT" },
          { name: "stream_time", type: "FLOAT" },
          { name: "total_monthly_stream_time", type: "FLOAT" },
          { name: "number_of_streams", type: "INTEGER" },
        ],
      },
    },
    songs_royalties_monthly: {
      name: "songs_royalties_monthly",
      timePartitioning: {
        type: "MONTH",
        field: "timestamp",
      },
      schema: {
        fields: [
          { name: "timestamp", type: "DATE" },
          { name: "song_id", type: "STRING" },
          { name: "entity_id", type: "STRING" },
          { name: "royalties_type", type: "STRING" },
          { name: "royalties", type: "FLOAT" },
          { name: "number_of_streams", type: "INTEGER" },
          { name: "stream_time", type: "INTEGER" },
          { name: "number_of_users", type: "INTEGER" },
        ],
      },
    },
    songs_royalties_daily: {
      name: "songs_royalties_daily",
      timePartitioning: {
        type: "MONTH",
        field: "timestamp",
      },
      schema: {
        fields: [
          { name: "timestamp", type: "DATE" },
          { name: "song_id", type: "STRING" },
          { name: "entity_id", type: "STRING" },
          { name: "royalties_type", type: "STRING" },
          { name: "royalties", type: "FLOAT" },
          { name: "number_of_streams", type: "INTEGER" },
          { name: "stream_time", type: "INTEGER" },
          { name: "number_of_users", type: "INTEGER" },
        ],
      },
    },
  },
};
