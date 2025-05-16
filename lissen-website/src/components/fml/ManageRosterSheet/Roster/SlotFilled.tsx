"use client";

import Image from "next/image";
import { cn, getImageUrlWithSize } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { X } from "lucide-react";

interface SlotFilledProps {
  scArtistId: string;
  selected?: boolean;
  className?: string;
  onRemove?: (scArtistId: string) => void;
  keyboardVisible: boolean;
}

export function SlotFilled({
  scArtistId,
  selected,
  className,
  onRemove,
  keyboardVisible,
}: SlotFilledProps) {
  const { data: artist } = trpc.fml.artists.getById.useQuery({
    scArtistId,
  });

  if (!artist) {
    return null;
  }

  return (
    <div className="relative">
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(scArtistId);
          }}
          className="absolute top-[-8px] right-[-8px] z-20 p-1 bg-white rounded-full text-black hover:bg-gray-200 transition-colors shadow-md"
          aria-label="Remove artist"
        >
          <X size={14} className="sm:w-4 sm:h-4" />
        </button>
      )}
      <div
        className={cn(
          "flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 max-w-full rounded-xl overflow-hidden bg-[#1F2428] border border-white/10 relative",
          className,
          keyboardVisible ? "rounded-full" : "",
        )}
      >
        {/* Artist Image */}
        <div
          className={cn(
            "aspect-[179/246] w-full h-full relative",
            keyboardVisible ? "aspect-square" : "",
          )}
        >
          <Image
            src={
              artist.image
                ? getImageUrlWithSize(artist.image, "medium")
                : "/images/avatar-fallback.webp"
            }
            alt={artist.name}
            fill
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
              selected &&
                "bg-gradient-to-t from-blue-500 to-50% to-transparent",
            )}
          />
        </div>

        {/* Artist Name */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm truncate text-center">
            {artist.name}
          </h3>
        </div>
      </div>
    </div>
  );
}
