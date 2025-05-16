"use client";

import { trpc, trpcUtils } from "@/lib/trpc";
import type { RouterOutputs } from "@/lib/trpc";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMyRoster } from "@/hooks/fml/useMyRoster";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Activity, Heart, Share2, ArrowUp } from "lucide-react";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useLoginModal } from "@/components/LoginModal";
import { useAuth } from "@/lib/firebase/auth-context";
const FEED_LIMIT = 25;
const NEW_ITEMS_POLL_INTERVAL = 2 * 60 * 1000; // Poll every 2 minutes

// Define the type for a single feed item based on the backend output
type FeedItem = RouterOutputs["fml"]["feed"]["get"]["items"][number];

export default function Feed({ leagueId }: { leagueId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestKnownLogIdForPollingRef = useRef<number>(0);
  const [pendingItems, setPendingItems] = useState<FeedItem[]>([]);

  const utils = trpc.useUtils();

  const {
    data: infiniteData,
    fetchNextPage, // This will now always fetch older items
    isLoading: isLoadingInfinite, // Initial loading
  } = trpc.fml.feed.get.useInfiniteQuery(
    { leagueId, limit: FEED_LIMIT }, // Initial query, no cursor
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        // lastPage.nextPageCursor is the logId of the oldest item in lastPage (or null/undefined)
        return lastPage.nextPageCursor; // This will be passed as the `cursor` in the next request's input
      },
    },
  );

  const allItemsFlatFromInfiniteQuery = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.items) || [],
    [infiniteData],
  );
  const displayItems = allItemsFlatFromInfiniteQuery; // Items are newest first by default from backend

  latestKnownLogIdForPollingRef.current =
    displayItems.length > 0 ? displayItems[0].logId : 0; // Newest item's ID

  const getNewerMutation = trpc.fml.feed.getNewer.useMutation({
    onSuccess: (newerItemsResult) => {
      if (!newerItemsResult || newerItemsResult.items.length === 0) return;
      setPendingItems((current) => {
        const combined = [
          ...newerItemsResult.items.filter(
            (item) =>
              !allItemsFlatFromInfiniteQuery.some(
                (existing) => existing.logId === item.logId,
              ) && !current.some((c) => c.logId === item.logId),
          ),
          ...current,
        ];
        const uniqueItems = Array.from(
          new Map(combined.map((item) => [item.logId, item])).values(),
        );
        return uniqueItems;
      });
    },
  });

  useEffect(() => {
    // event listener for window focus
    const handleFocus = () => {
      getNewerMutation.mutate({
        leagueId,
        latestKnownLogId: latestKnownLogIdForPollingRef.current,
        limit: FEED_LIMIT * 2,
      });
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [getNewerMutation, leagueId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        latestKnownLogIdForPollingRef.current === 0 ||
        getNewerMutation.isPending
      ) {
        return;
      }

      getNewerMutation.mutate({
        leagueId,
        latestKnownLogId: latestKnownLogIdForPollingRef.current,
        limit: FEED_LIMIT * 2,
      });
    }, NEW_ITEMS_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [getNewerMutation, leagueId]);

  const {
    query: { data: myRoster },
  } = useMyRoster(leagueId);

  const isInitiallyLoading = isLoadingInfinite && displayItems.length === 0;

  // Effect to reset feed state when leagueId changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
    setPendingItems([]);
  }, [leagueId]);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Loading more items...");
          fetchNextPage().catch(() => {});
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, observerTarget]);

  const viewNewActivity = () => {
    // Only now update the actual feed with pending items
    if (pendingItems.length > 0) {
      utils.fml.feed.get.setInfiniteData(
        { leagueId, limit: FEED_LIMIT },
        (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: pendingItems, // Already newest first
                  nextPageCursor: null,
                },
              ],
              pageParams: [null],
            };
          }
          const pages = oldData.pages;
          const updatedFirstPageItems = [
            ...pendingItems, // Prepend new items (already newest first)
            ...pages[0].items,
          ];
          const uniqueUpdatedFirstPageItems = Array.from(
            new Map(
              updatedFirstPageItems.map((item) => [item.logId, item]),
            ).values(),
          );
          const newPages = [
            { ...pages[0], items: uniqueUpdatedFirstPageItems },
            ...pages.slice(1),
          ];
          return { ...oldData, pages: newPages };
        },
      );

      // Clear pending items
      setPendingItems([]);
    } else {
      console.log("No new items to view");
    }

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* New Activity button - shows when there are pending items */}
      {pendingItems.length > 0 && (
        <div className="sticky top-[17rem] left-0 right-0 z-50  mx-auto">
          <button
            onClick={viewNewActivity}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium transition-all hover:bg-primary/90 mx-auto animate-in slide-in-from-top"
          >
            <ArrowUp size={16} />
            New Activity
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-grow flex flex-col no-scrollbar">
        {/* Loading indicator for initial load (appears at the top) */}
        {isInitiallyLoading && (
          <div className="text-center py-10 text-muted-foreground flex-shrink-0">
            <Activity className="animate-spin h-8 w-8 mx-auto" />
          </div>
        )}

        {/* Message when no items and not loading (appears at the top) */}
        {!isInitiallyLoading && displayItems.length === 0 && (
          <div className="text-center py-10 text-muted-foreground flex-shrink-0">
            No feed items yet.
          </div>
        )}

        {/* Items list - rendered in ASC order (newest at top, oldest at bottom) */}
        <div>
          {displayItems.map((item: FeedItem) => (
            <FeedCard
              key={item.logId}
              item={item}
              isMyRosterItem={
                myRoster?.some(
                  (rosterItem) =>
                    rosterItem.scArtistId === item.artist.scArtistId,
                ) ?? false
              }
              leagueId={leagueId}
            />
          ))}
          <div ref={observerTarget}></div>
        </div>
      </div>
    </div>
  );
}

interface FeedCardProps {
  item: FeedItem;
  isMyRosterItem: boolean;
  className?: string;
  leagueId: string;
}

const FeedCard = ({
  item,
  isMyRosterItem,
  className,
  leagueId,
}: FeedCardProps) => {
  const isPlatformInstagram = item.platformName === "instagram";
  const platformIconName = isPlatformInstagram ? "instagram" : "tiktok";
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const { showLogin } = useLoginModal();

  // Query to check if the item is liked
  const { data: likedItem } = trpc.fml.feed.getLiked.useQuery(
    { logId: item.logId },
    { enabled: !!item.logId && !!user, refetchOnWindowFocus: false },
  );

  const { isLiked, count } = likedItem ?? {
    isLiked: item.isLiked ?? false,
    count: item.likeCount ?? 0,
  };

  // Mutation for toggling like state with simple optimistic update
  const likeMutation = trpc.fml.feed.toggleLike.useMutation({
    onMutate: () => {
      trpcUtils.fml.feed.getLiked.setData({ logId: item.logId }, (old) => {
        if (!old) return { logId: item.logId, isLiked: true, count: 1 };

        return {
          ...old,
          isLiked: !old.isLiked,
          count: !old.isLiked ? old.count + 1 : old.count - 1,
        };
      });
    },
    onSuccess: () => {
      trpcUtils.gems.getGems.invalidate().catch((error) => {
        console.error("Error invalidating gems", error);
      });
    },
  });

  const handleLikeToggle = () => {
    if (user === null) {
      showLogin();
      return;
    }

    likeMutation.mutate({ logId: item.logId, leagueId: leagueId });
  };

  useEffect(() => {
    // Trigger the animation shortly after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const getEngagementText = () => {
    switch (item.metricType) {
      case "follower_delta":
        return `${item.deltaValue > 0 ? "gained" : "lost"} ${Math.abs(item.deltaValue)} followers`; // Removed "on platform"
      case "follower_progress":
        return `is now ${item.deltaValue}% of the way to reaching their next follower goal`;
      case "post_delta":
        return item.deltaValue === 1
          ? `Has ${item.contentType === "video" ? "uploaded" : "added"} a new ${item.contentType ?? "post"}`
          : item.deltaValue > 1
            ? `Has ${item.contentType === "video" ? "uploaded" : "added"} ${item.deltaValue} new ${item.contentType ?? "post"}s`
            : "";
      case "post_progress":
        return `is now ${item.deltaValue}% of the way to reaching their next post goal`;
      default:
        return `had new activity`; // Simplified
    }
  };

  // Handle share functionality
  const handleShare = () => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: `${item.artist.name} on Lissen`,
          text: `Check out ${item.artist.name}'s activity on Lissen!`,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch((err) => console.log("Error copying to clipboard:", err));
    }
  };

  if (
    item.metricType !== "follower_delta" &&
    item.metricType !== "follower_progress"
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full shadow-sm overflow-hidden transition-[transform,opacity] duration-500 ease-out border-b border-gray-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        isMyRosterItem
          ? "bg-gradient-to-b from-primary to-secondary bg-right bg-[length:4px_100%] bg-no-repeat"
          : "",
        className,
      )}
    >
      <div className="p-3 sm:p-4">
        {/* Header: Avatar, Name, Platform Icon */}
        <div className="flex items-start">
          <Link
            href={`/artist/${item.artist.scArtistId}`}
            className="mr-2 sm:mr-3"
          >
            <Avatar className="h-6 w-6 sm:h-10 sm:w-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src={item.artist.image ?? "/images/avatar-fallback.webp"}
                alt={item.artist.name ?? "Artist Avatar"}
              />
            </Avatar>
          </Link>

          <div className="flex-1 flex flex-col justify-center gap-1 sm:gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Link
                  href={`/artist/${item.artist.scArtistId}`}
                  className="font-semibold hover:underline text-xs sm:text-sm"
                >
                  {item.artist.name}
                </Link>
                <div className="flex items-center text-muted-foreground text-[10px] sm:text-xs">
                  <Link
                    href={item.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    <Icon
                      name={platformIconName}
                      className="mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-white"
                    />
                    <span>
                      {isPlatformInstagram
                        ? item.artist.instagramHandle
                        : item.artist.tiktokHandle}
                    </span>
                  </Link>
                  <span className="mx-1">·</span>
                  <span className="whitespace-nowrap">
                    {formatRelativeTime(item.scrapeTs)}
                  </span>
                </div>
              </div>

              {/* Points Awarded */}
              {item.pointsAwarded > 0 && (
                <div
                  className={cn(
                    "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap ml-1 sm:ml-2",
                    item.pointsAwarded > 0
                      ? "bg-green-100 text-green-700"
                      : item.pointsAwarded < 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700",
                  )}
                >
                  +{item.pointsAwarded}
                  {Math.abs(item.pointsAwarded) === 1 ? " pt" : " pts"}
                </div>
              )}
            </div>
            {/* Content */}
            <div className="mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm first-letter:uppercase">
                {getEngagementText()}
              </p>
            </div>
            {/* Footer */}
            <div
              className={cn(
                "flex flex-row items-center justify-between text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2",
              )}
            >
              {item.contentLink ? (
                <Link
                  href={item.contentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <span>
                    View {item.deltaValue > 1 ? "latest" : ""}{" "}
                    {item.contentType} on{" "}
                    {isPlatformInstagram ? "Instagram" : "TikTok"}
                  </span>
                  <Icon
                    name="externalLink"
                    className="ml-1 h-2.5 w-2.5 hidden sm:inline sm:h-3 sm:w-3"
                  />
                </Link>
              ) : (
                <span />
              )}

              {/* Interaction buttons */}
              <div className="flex items-center self-end gap-3 sm:gap-4">
                {/* Like button */}
                <button
                  onClick={handleLikeToggle}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  aria-label="Like"
                  disabled={likeMutation.isPending}
                >
                  <Heart
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4 transition-colors",
                      isLiked && user
                        ? "fill-red-500 text-red-500"
                        : "fill-none",
                      likeMutation.isPending && "opacity-50",
                    )}
                  />
                  <span className="min-w-3">{count}</span>
                </button>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
