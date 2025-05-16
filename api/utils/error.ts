import { TRPCError } from "@trpc/server";

export class UserNotFoundError extends TRPCError {
  constructor(userId: string) {
    super({
      code: "NOT_FOUND",
      message: `No user found for id: ${userId}`,
    });
  }
}

export class UserManagedEntitiesNotFoundError extends TRPCError {
  constructor(userId: string) {
    super({
      code: "NOT_FOUND",
      message: `No managed entities found for user with id: ${userId}`,
    });
  }
}

export class ArtistsNotFoundError extends TRPCError {
  constructor(artistIds: string[]) {
    super({
      code: "NOT_FOUND",
      message: `No artists found for ids: ${artistIds}`,
    });
  }
}

export class ExperienceNotFoundError extends TRPCError {
  constructor(experienceId: string) {
    super({
      code: "NOT_FOUND",
      message: `No experience found for id: ${experienceId}`,
    });
  }
}

export class AccessNotFoundError extends TRPCError {
  constructor(accessId: string) {
    super({
      code: "NOT_FOUND",
      message: `No access found for id: ${accessId}`,
    });
  }
}

export class PlaylistNotFoundError extends TRPCError {
  constructor(playlistId: string) {
    super({
      code: "NOT_FOUND",
      message: `No playlist found for id: ${playlistId}`,
    });
  }
}

export class PlaylistPermissionError extends TRPCError {
  constructor(userId: string, playlistId: string) {
    super({
      code: "UNAUTHORIZED",
      message: `User with id: ${userId} does not have permission to access playlist with id: ${playlistId}`,
    });
  }
}

export class VideocallNotFoundError extends TRPCError {
  constructor(videocallId?: string) {
    super({
      code: "NOT_FOUND",
      message: videocallId
        ? `Videocall with id: ${videocallId} not found`
        : "Videocall not found",
    });
  }
}
