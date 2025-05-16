"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/firebase/auth-context";
import { useLoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { RouterOutputs, trpc, trpcUtils } from "@/lib/trpc";
import ReactPlayer from "react-player/lazy";
import { Play, Pause, Lock } from "lucide-react"; // Add SkipForward, SkipBack if you implement those
import { Slider } from "@/components/ui/slider"; // Assuming this path is correct for your ShadCN/UI slider
import { toast } from "sonner";

// --- tRPC Hook Definitions (Inline for Prototype) ---
// Adjust procedure paths if they differ, e.g., trpc.user.getCDNKey.useQuery
const useCdnKey = () => {
  const query = trpc.user.getCDNKey.useQuery(undefined, {
    staleTime: 1000 * 60 * 55, // 55 minutes
    refetchOnWindowFocus: false,
  });
  return query;
};

const useSongsByPlaylistId = (playlistId: string) => {
  const query = trpc.catalog.songs.getByPlaylistIds.useQuery([playlistId], {
    enabled: !!playlistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return query;
};

type Song = RouterOutputs["catalog"]["songs"]["getByPlaylistIds"][number];

// const HARDCODED_PLAYLIST_ID = "your-actual-playlist-id"; // <<<< IMPORTANT: SET YOUR ACTUAL PLAYLIST ID HERE
const HARDCODED_PLAYLIST_ID = "555560e9-0848-416a-b31b-b75128a8a95d"; // Example ID, replace with your actual one!

// --- Main Page Component ---
export default function SongsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showLogin } = useLoginModal();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Loading authentication...
      </div>
    );
  }

  if (!user) {
    return <LoginPromptUI onLoginClick={showLogin} />;
  }

  return <SongsPageLoggedIn />;
}

// --- Login Prompt UI (Simplified from previous version) ---
const LoginPromptUI = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <div className="relative mt-24 min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-background text-foreground p-4">
      <title>Login to Listen | Songs</title>
      <div className="absolute inset-0 overflow-hidden grayscale blur-md opacity-30">
        <div className="container mx-auto p-4 md:p-8 h-full flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-muted rounded"></div>
                    <div className="w-1/2 h-3 bg-muted-foreground/50 rounded"></div>
                  </div>
                </div>
              ))}
          </div>
          <div className="md:w-2/3 bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-full">
            <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
            <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
            <div className="w-full h-2 bg-muted-foreground/50 rounded mb-4"></div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="w-10 h-10 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 border border-border bg-card/80 rounded-2xl p-7 md:p-10 backdrop-blur-lg text-center shadow-xl text-card-foreground">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Unlock Your Music
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Log in to access your personalized song experience.
        </p>
        <Button
          onClick={onLoginClick}
          className="px-8 py-3 text-lg font-semibold"
          variant="default"
        >
          Login / Sign Up
        </Button>
      </div>
    </div>
  );
};

// --- Logged In UI ---
const SongsPageLoggedIn = () => {
  const {
    data: songs,
    isLoading: songsLoading,
    error: songsError,
    refetch: refetchSongs,
  } = useSongsByPlaylistId(HARDCODED_PLAYLIST_ID);

  const {
    data: cdnKeyData,
    isLoading: cdnKeyLoading,
    error: cdnKeyError,
  } = useCdnKey();

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const currentSong = songs?.find((s) => s.id === selectedSongId);

  const playerRef = useRef<ReactPlayer>(null);

  const signedUrl = useMemo(() => {
    const songUrlOnline = currentSong?.urlOnline;

    if (!songUrlOnline || !cdnKeyData?.bunnyCDNPath) return "";

    // If it's a test stream, use it directly
    if (songUrlOnline.includes("test-streams.mux.dev")) {
      return songUrlOnline;
    }

    // If it's already a local proxy path, don't modify further
    if (songUrlOnline.startsWith("/dev-cdn-proxy/")) {
      return songUrlOnline;
    }

    // This logic attempts to mimic the lissen-app's signUrl more closely.
    // It assumes `songUrlOnline` is a base URL (e.g., "https://somewhere.com/audio/track/hls.m3u8")
    // and `cdnKeyData.bunnyCDNPath` is the segment to PREPEND to the PATH of that URL.
    // The original CORS error URL was: https://cdn.lissenprod.lissen.live/live/bcdn_token=...expires=.../audio/...
    // This suggests that `cdnKeyData.bunnyCDNPath` should resolve to something like "live/bcdn_token=...expires=..."
    // And the original `songUrlOnline` might be "https://cdn.lissenprod.lissen.live/audio/track/hls.m3u8"
    // OR `songUrlOnline` is just "/audio/track/hls.m3u8"

    let finalPathToProxy = "";

    try {
      // Attempt to parse songUrlOnline to see if it's a full URL from the target CDN
      const parsedSongUrl = new URL(songUrlOnline);

      if (parsedSongUrl.hostname === "cdn.lissenprod.lissen.live") {
        // If songUrlOnline is from the target CDN, take its pathname
        // e.g., if songUrlOnline = "https://cdn.lissenprod.lissen.live/audio/track/hls.m3u8", pathname = "/audio/track/hls.m3u8"
        let resourcePathname = parsedSongUrl.pathname; // Should start with '/'
        resourcePathname = resourcePathname.startsWith("/")
          ? resourcePathname
          : "/" + resourcePathname;

        // Prepend cdnKeyData.bunnyCDNPath. Ensure no double slashes.
        const pathPrefix = cdnKeyData.bunnyCDNPath.endsWith("/")
          ? cdnKeyData.bunnyCDNPath.slice(0, -1)
          : cdnKeyData.bunnyCDNPath;

        finalPathToProxy = `${pathPrefix}${resourcePathname}`;
      } else {
        // If songUrlOnline is a full URL but not from cdn.lissenprod.lissen.live, it might be an error or different source.
        // For now, we'll assume it won't be proxied if it's not from the target CDN.
        // Or, if songUrlOnline was meant to be a relative path like "/audio/track/hls.m3u8"
        // This case needs clarification on what songUrlOnline contains.
        // Falling back to previous simpler concatenation if not target CDN host.
        const pathPrefix = cdnKeyData.bunnyCDNPath.endsWith("/")
          ? cdnKeyData.bunnyCDNPath.slice(0, -1)
          : cdnKeyData.bunnyCDNPath;
        const resourcePath = songUrlOnline.startsWith("/")
          ? songUrlOnline
          : "/" + songUrlOnline;
        finalPathToProxy = `${pathPrefix}${resourcePath}`;
      }
    } catch (e) {
      // songUrlOnline is not a full valid URL, assume it's a relative path like "/audio/track/hls.m3u8"
      // or just "audio/track/hls.m3u8"
      let resourcePath = songUrlOnline;
      if (!resourcePath.startsWith("/")) {
        resourcePath = "/" + resourcePath;
      }
      const pathPrefix = cdnKeyData.bunnyCDNPath.endsWith("/")
        ? cdnKeyData.bunnyCDNPath.slice(0, -1)
        : cdnKeyData.bunnyCDNPath;
      finalPathToProxy = `${pathPrefix}${resourcePath}`;
    }

    // Remove leading slash for the proxy if finalPathToProxy has one, as /dev-cdn-proxy/ will add one.
    const cleanFinalPath = finalPathToProxy.startsWith("/")
      ? finalPathToProxy.substring(1)
      : finalPathToProxy;
    return `/dev-cdn-proxy/${cleanFinalPath}`;
  }, [currentSong, cdnKeyData]);

  useEffect(() => {
    // Auto-select first song when playlist loads and player is ready, if no song is current
    if (songs && songs.length > 0 && !currentSong && isPlayerReady) {
      setSelectedSongId(songs[0].id); // Optional: auto-play or just select first song
    }
  }, [songs, currentSong, isPlayerReady]);

  const handlePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    } else if (songs && songs.length > 0) {
      const firstPlayable = songs.find((s) => !s.private) || songs[0];
      if (firstPlayable.private) {
        setSelectedSongId(firstPlayable.id);
        setIsPlaying(false);
      } else {
        setSelectedSongId(firstPlayable.id);
        setIsPlaying(true);
      }
    }
  };

  const handleSongSelect = (song: Song) => {
    if (song.private && !song.unlocked) {
      setSelectedSongId(song.id);
      setIsPlaying(false);
      return;
    }

    if (currentSong?.id === song.id) {
      handlePlayPause();
    } else {
      setSelectedSongId(song.id);
      setIsPlaying(true);
      setPlayedSeconds(0);
    }
  };

  const handleProgress = (progress: { playedSeconds: number }) => {
    if (!seeking) {
      setPlayedSeconds(progress.playedSeconds);
    }
  };

  const handleDuration = (newDuration: number) => {
    setDuration(newDuration);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayedSeconds(value[0]);
  };

  const handleSeekMouseUp = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value[0]);
    }
    setSeeking(false);
  };

  const handleEnded = () => {
    const currentIndex = songs?.findIndex((s) => s.id === currentSong?.id);
    if (
      songs &&
      currentIndex !== undefined &&
      currentIndex < songs.length - 1
    ) {
      handleSongSelect(songs[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds || 0);
    return date.toISOString().slice(14, 19); // MM:SS format
  };

  const { mutateAsync: unlockSong } = trpc.sol.unlockSong.useMutation();

  if (songsLoading || cdnKeyLoading)
    return (
      <div className="mt-24 p-8 text-center text-foreground">
        Loading music data...
      </div>
    );
  if (songsError || cdnKeyError)
    return (
      <div className="mt-24 p-8 text-center text-red-500">
        Error loading data. {songsError?.message || cdnKeyError?.message}
      </div>
    );
  if (!songs || songs.length === 0)
    return (
      <div className="mt-24 p-8 text-center text-foreground">
        No songs available in this playlist.
      </div>
    );

  const handleUnlockAttempt = async () => {
    if (currentSong?.private && !currentSong.unlocked) {
      setIsUnlocking(true);
      try {
        const result = await unlockSong({ songId: currentSong.id });
        console.log("result", result);
        toast.success("Song unlocked");
        await refetchSongs();
        trpcUtils.gems.getGems.invalidate().catch((e) => {
          console.error("Error invalidating getGems", e);
        });
      } catch (error) {
        console.error("Error unlocking song", error);
        toast.error("Error unlocking song");
      } finally {
        setIsUnlocking(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 text-foreground">
      <title>
        {currentSong ? `${currentSong.title} | Lissen Player` : "Lissen Songs"}
      </title>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Song List (Left on Desktop) */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-2 order-1 md:order-none">
          {/* <h2 className="text-2xl font-bold mb-4">Up Next</h2> */}
          {songs.slice(0, 5).map((songItem) => (
            <SongListItem
              key={songItem.id}
              song={songItem as Song} // Cast if TS complains, ensure Song interface is correct
              onClick={() => handleSongSelect(songItem as Song)}
              isActive={currentSong?.id === songItem.id}
              isPlaying={currentSong?.id === songItem.id && isPlaying}
            />
          ))}
        </div>

        {/* Music Player (Right on Desktop, Bottom fixed on Mobile) */}
        <div
          className={`w-full md:w-2/3 lg:w-3/4 order-2 md:order-none md:sticky md:top-28 self-start 
                        fixed bottom-0 left-0 right-0 md:relative bg-background md:bg-transparent border-t border-border md:border-none p-4 md:p-0 z-50 
                        ${currentSong?.private && !currentSong?.unlocked ? "relative" : ""}`}
        >
          {/* Player Content Area - Gets blurred if songToUnlock is set */}
          <div
            className={`${currentSong?.private && !currentSong?.unlocked ? "blur-md grayscale brightness-50 pointer-events-none" : ""} transition-all duration-300`}
          >
            {currentSong ? (
              <div className="bg-card/80 md:bg-card/30 border border-border md:border-white/10 rounded-xl p-3 md:p-6 shadow-xl backdrop-blur-md">
                <div className="flex flex-col md:items-center md:text-center">
                  {/* Mobile: Image left, info right. Desktop: Image center, info below */}
                  <div className="flex md:flex-col items-center w-full">
                    <div className="w-16 h-16 md:w-40 md:h-40 lg:w-60 lg:h-60 rounded-md md:rounded-lg overflow-hidden relative bg-muted shrink-0 md:mb-6">
                      {currentSong.albumImage ? (
                        <Image
                          src={currentSong.albumImage}
                          alt={currentSong.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Art
                        </div>
                      )}
                    </div>
                    <div className="ml-3 md:ml-0 flex-grow overflow-hidden">
                      <h3 className="text-md md:text-2xl lg:text-3xl font-bold text-foreground truncate md:text-center">
                        {currentSong.title}
                      </h3>
                      <p className="text-xs md:text-md lg:text-lg text-muted-foreground truncate md:text-center">
                        {currentSong.artistNames.join(", ")} -{" "}
                        {currentSong.albumTitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-2 md:my-4 flex items-center gap-2 md:gap-3">
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {formatTime(playedSeconds)}
                  </span>
                  <Slider
                    // @ts-expect-error -- something is broken with the types for slider
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={[playedSeconds]}
                    onValueChange={handleSeekChange}
                    onValueCommit={handleSeekMouseUp}
                    className="w-full"
                    disabled={!isPlayerReady || !currentSong}
                  />
                  <span className="text-xs text-muted-foreground w-10 text-left">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-4 md:gap-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-10 h-10 md:w-12 md:h-12 transition-transform active:scale-95 disabled:opacity-50"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    disabled={!isPlayerReady || !currentSong}
                  >
                    {isPlaying ? (
                      <Pause size={20} md-size={24} />
                    ) : (
                      <Play size={20} md-size={24} className="ml-0.5 md:ml-1" />
                    )}
                  </Button>
                </div>

                <div style={{ display: "none" }}>
                  {" "}
                  {/* Hidden ReactPlayer */}
                  {signedUrl && (
                    <ReactPlayer
                      ref={playerRef}
                      url={signedUrl}
                      playing={isPlaying}
                      controls={false}
                      onReady={() => setIsPlayerReady(true)}
                      onProgress={handleProgress}
                      onDuration={handleDuration}
                      onEnded={handleEnded}
                      onError={(e: any) => {
                        console.error(
                          "ReactPlayer Error:",
                          e,
                          "URL:",
                          signedUrl,
                        );
                        setIsPlayerReady(true); // Allow retry or next song attempt
                      }}
                      config={{
                        file: {
                          forceHLS: true,
                        },
                      }}
                      width="0%"
                      height="0%"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card/30 border border-border rounded-xl p-6 shadow-xl backdrop-blur-md min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center text-center">
                <Image
                  src="/images/logo.svg"
                  alt="Lissen"
                  width={100}
                  height={28}
                  className="opacity-50 mb-4"
                />
                <p className="text-xl text-muted-foreground">
                  Select a song to start listening.
                </p>
              </div>
            )}
          </div>

          {/* Unlock Song Modal/Overlay - Appears on top of the blurred player */}
          {currentSong?.private && !currentSong?.unlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4 md:rounded-xl">
              <div
                className="relative text-center p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md border-2 border-transparent"
                style={{
                  background:
                    "linear-gradient(rgb(23 23 23 / 0.8), rgb(23 23 23 / 0.8)) padding-box, linear-gradient(101deg, #00F0FF 6.27%, #5773FF 52.05%, #FF007A 90.92%) border-box",
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  Unlock Exclusive Song
                </h3>
                {currentSong.albumImage && (
                  <Image
                    src={currentSong.albumImage}
                    alt={currentSong.title}
                    width={80}
                    height={80}
                    className="rounded-md mx-auto my-4 shadow-lg"
                  />
                )}
                <p className="text-lg text-white/90 mb-1">
                  {currentSong.title}
                </p>
                <p className="text-sm text-white/60 mb-4">
                  by {currentSong.artistNames.join(", ")}
                </p>

                <Button
                  onClick={handleUnlockAttempt}
                  className="w-full font-semibold py-3 text-md"
                  disabled={isUnlocking}
                  style={{
                    background:
                      "linear-gradient(101deg, #00F0FF 6.27%, #5773FF 52.05%, #FF007A 90.92%)",
                    border: "none",
                  }}
                >
                  {isUnlocking ? "Unlocking..." : "Unlock for 10 Gems"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Song List Item Component ---
const SongListItem = ({
  song,
  onClick,
  isActive,
  isPlaying,
}: {
  song: Song;
  onClick: () => void;
  isActive: boolean;
  isPlaying: boolean;
}) => {
  const isPrivateAndLocked = !!song.private && !song.unlocked;
  const showExclusiveBadge = !!song.private; // Show badge if private, regardless of unlocked state

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out text-left group relative
                  ${isActive && !isPrivateAndLocked ? "bg-primary/20 hover:bg-primary/30" : "bg-muted/40 hover:bg-muted/70"}
                  ${isActive && !isPrivateAndLocked ? "ring-1 ring-primary/70" : ""}
                  ${isActive && isPrivateAndLocked ? "ring-1 ring-yellow-500/70" : ""}
                  `}
    >
      <div className="w-12 h-12 rounded overflow-hidden relative bg-muted shrink-0">
        {song.albumImage ? (
          <Image
            src={song.albumImage}
            alt={song.title}
            layout="fill"
            objectFit="cover"
            className={`transition-transform duration-300 group-hover:scale-105 ${isPrivateAndLocked && isActive ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No Art
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p
          className={`font-semibold truncate ${isActive && !isPrivateAndLocked ? "text-primary" : "text-foreground"}`}
        >
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {song.artistNames.join(", ")}
        </p>
      </div>

      {/* Right Aligned Area for Badge and/or Icons */}
      <div className="flex items-center shrink-0 ml-auto space-x-2">
        {showExclusiveBadge && (
          <div
            className="px-2 py-1 text-xs font-bold text-white rounded-md shrink-0"
            style={{
              background:
                "linear-gradient(101deg, #00F0FF 6.27%, #5773FF 52.05%, #FF007A 90.92%)",
              boxShadow:
                "0px 1px 5px 0px rgba(0, 240, 255, 0.30), 0px 1px 5px 0px rgba(255, 0, 122, 0.30)",
            }}
          >
            EXCLUSIVE
          </div>
        )}

        {isPrivateAndLocked && (
          <Lock size={20} className="text-yellow-500 shrink-0" />
        )}

        {!isPrivateAndLocked &&
          isActive && // Only show Play/Pause for non-locked AND active songs
          (isPlaying ? (
            <Pause size={20} className="text-primary shrink-0" />
          ) : (
            <Play size={20} className="text-primary shrink-0" />
          ))}
      </div>
    </button>
  );
};
