/* eslint-disable @typescript-eslint/ban-types */
import {
  SongIngestReleaseProperties,
  SongIngestReleaseSchema,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore - upstream packages are failing without ignore, cant figure it out
} from "@libs/types/song-ingest";
import { RevenueCat } from "./revenuecat";

type Ticket = {
  concertDate: string;
  concertTime: string;
  artistName: string;
  location: string | null;
  redeemCode: string;
};

type NotifyExistingUserManager = {
  type: "existing-user-manager";
  artistName: string;
  appUrl: string;
};

type NotifyNewUserManager = {
  type: "new-user-manager";
  artistName: string;
  loginUrl: string;
  password: string;
};

type NotifyNewTickets = {
  type: "new-tickets";
  tickets: Ticket[];
  password: string | undefined;
  artistName: string;
  location: string | null;
};

type NotifyWonBonus = {
  type: "won-bonus";
  prize: string;
  imageUrl: string | null;
};

type NotifyWonRaffle = {
  type: "won-raffle";
  title: string;
  message: string;
  url: string;
};

type NotifyNewInboxItem = {
  type: "new-inbox-item";
  title: string;
  message: string;
  url: string;
};

type NotifyWonContest = {
  type: "won-contest";
  contestName: string;
  prize: string;
  rank: number;
};

export type PubSubMessages = {
  "user-created-db": {
    consumerId: string;
    userId: string;
  };
  "song-onboarding-get-content-from-v1-prod": {
    songId: string;
  };
  "user-subscription-updated": {
    userId: string[];
    data: RevenueCat.Event;
  };
  "recommendations-generate-platform": {};
  "recommendations-process-action-events": {};
  "recommendations-process-user-actions": {
    user_id: string;
    start: string;
    end: string;
  };
  "recommendations-update-user-recommendations": {
    user_id: string;
  };
  "generate-blurhash": {
    resourceType:
      | "albums"
      | "playlists"
      | "genres"
      | "users"
      | "artists"
      | "subgenres"
      | "experiences";
    resourceId: string;
  };
  "stats-songs-all-time": {};
  "process-experience-raffle-draws": {};
  "ghost-network": {};
  "update-inboxes": {};
  "song-ingest-process-release": {
    properties: SongIngestReleaseProperties;
    release: SongIngestReleaseSchema;
  };
  "song-ingest-process-song": {
    properties: SongIngestReleaseProperties;
    song: Omit<SongIngestReleaseSchema["tracks"][0], "rightsControllers"> & {
      rightsControllers: { id: string; reference: string; share: string }[];
      albumId: string;
      genreId?: string;
      mainArtistIds: string[];
      featuredArtistIds: string[];
      releaseLabelId?: string;
    };
  };
  "song-ingest-trigger-pipeline": {};
  "import-denormalized-data-to-postgres": {};
  "error-event-forwarder": {};
  // send to harmix fingerprinting service
  "tracks-topic": {
    track_id: string;
    audio_path: string;
    timestamp: number;
  };
  "trigger-topic": {
    type: "batch_processing_trigger";
    timestamp: number;
  };
  notify: { email: string } & (
    | NotifyNewTickets
    | NotifyExistingUserManager
    | NotifyNewUserManager
    | NotifyWonBonus
    | NotifyWonRaffle
    | NotifyNewInboxItem
    | NotifyWonContest
  );
  "process-contest-winners": {};
};

export type PubSubMessage<T extends keyof PubSubMessages> = {
  topic: T;
  payload: PubSubMessages[T];
};
