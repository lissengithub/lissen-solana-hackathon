import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  useFMLArtistList,
  type FMLArtistList,
} from "@/hooks/fml/useFMLArtistList";
import { cn, getImageUrlWithSize } from "@/lib/utils";
import { Search } from "lucide-react";

interface ArtistCardProps {
  artist: FMLArtistList[number];
  selected?: boolean;
  onSelect: () => void;
}

export default function ArtistsList({
  setSelectedArtist,
  leagueId,
  keyboardVisible,
}: {
  setSelectedArtist: (artistId: string) => void;
  leagueId: string;
  keyboardVisible: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { query, artists } = useFMLArtistList({
    searchTerm,
    leagueId,
  });
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          query.hasNextPage &&
          !query.isFetchingNextPage
        ) {
          query.fetchNextPage().catch((error) => {
            console.error(error);
          });
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [query]);

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-4 sticky top-0 z-50 bg-neutral-900 pb-2">
        <div className="flex items-center">
          <Search className="w-4 h-4 text-white ml-3 -mr-7 z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artists..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-lg bg-white/20 focus:outline-none"
          />
        </div>
      </div>

      {/* Artists Grid */}
      <div
        className={cn(
          "grid grid-cols-3 lg:grid-cols-4 gap-2 pb-4 overflow-y-auto",
          keyboardVisible && "pb-[250px]",
        )}
      >
        {artists.map((artist) => (
          <ArtistCard
            key={artist.scArtistId}
            artist={artist}
            onSelect={() => setSelectedArtist(artist.scArtistId)}
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-10 w-full" />
    </div>
  );
}

const ArtistCard = ({ artist, selected, onSelect }: ArtistCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative group overflow-hidden bg-white/5 border border-gray-500/20 hover:border-blue-500/50 transition-all aspect-[179/246] rounded-2xl cursor-pointer flex-none",
        selected && "border-blue-500",
      )}
    >
      {/* Artist Image */}
      <div className="aspect-[179/246] w-full h-full relative">
        <Image
          src={
            artist.artistImage
              ? getImageUrlWithSize(artist.artistImage, "medium")
              : "/images/avatar-fallback.webp"
          }
          alt={artist.artistName}
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
            selected && "bg-gradient-to-t from-blue-500 to-50% to-transparent",
          )}
        />
      </div>

      {/* Artist Name */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-bold text-sm truncate text-center">
          {artist.artistName}
        </h3>
      </div>
    </div>
  );
};
