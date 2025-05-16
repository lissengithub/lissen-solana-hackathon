import type { BigQueryDate } from "@google-cloud/bigquery";

export type StatsUserActiveDaysRow = {
  user_id: string;
  user_daily_revenue: number;
  days_at_revenue: number;
};

export type StatsUserSongStreamTimeRow = {
  user_id: string;
  song_id: string;
  total_stream_time: number;
  timestamp: string;
  number_of_streams: number;
};

export type StatsUserSongDailyRow = {
  timestamp: string;
  user_id: string;
  song_id: string;
  stream_time: number;
  gross_revenue_per_day: number;
  user_daily_revenue: number;
  user_total_daily_stream_time: number;
  number_of_streams: number;
};

export type StatsUserSongMonthlyRow = {
  month: string;
  user_id: string;
  song_id: string;
  gross_revenue: number;
  gross_active_revenue: number;
  gross_inactive_revenue: number;
  stream_time: number;
  total_monthly_stream_time: number;
  number_of_streams: number;
};

export type StatsUserSongMonthlyAggregateRow = {
  song_id: string;
  royalties: number;
  number_of_streams: number;
  stream_time: number;
  number_of_users: number;
};

export type StatsUserSongDailyAggregateRow = {
  song_id: string;
  royalties: number;
  number_of_streams: number;
  stream_time: number;
  number_of_users: number;
};

export type StatsSongsRoyaltiesMonthlyRow = {
  timestamp: string;
  song_id: string;
  entity_id: string;
  royalties_type: string;
  royalties: number;
  number_of_streams: number;
  stream_time: number;
  number_of_users: number;
};

export type StatsSongsRoyaltiesDailyRow = {
  timestamp: BigQueryDate;
  song_id: string;
  entity_id: string;
  royalties_type: string;
  royalties: number;
  number_of_streams: number;
  stream_time: number;
  number_of_users: number;
};

export type Stats = {
  Revenue: {
    Input: {
      month: string;
      token: string;
    };
    Output: {
      status: string;
      data: {
        your_share: number;
        total_revenue: number;
        songs: {
          title: string;
          artist: string;
          streams: number;
          stream_time: number;
          your_share: number;
          total_royalties: number;
        }[];
        by_date: {
          [date: string]: {
            stream_time: number;
            number_of_users: number;
            number_of_streams: number;
          };
        };
      };
    };
  };
  Leaderboard: {
    Input: {
      from?: string;
      token: string;
    };
    Output: {
      status: string;
      data: {
        name: string;
        stream_time: number;
        image: string;
      }[];
    };
  };
};
