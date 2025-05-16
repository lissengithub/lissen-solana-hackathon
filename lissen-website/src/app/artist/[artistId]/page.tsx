import { notFound } from "next/navigation";
import { trpcUtils } from "@/lib/trpc";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import ArtistsEligibleGames from "./ArtistsEligibleGames";
import { headers } from "next/headers";

export default async function ArtistPage({
  params,
}: {
  params: { artistId: string };
}) {
  headers();
  const artist = await trpcUtils.fml.artists.getById.fetch({
    scArtistId: params.artistId,
  });

  if (!artist) {
    notFound();
  }

  return (
    <main className="container mt-28">
      {/* Artist Header */}
      <section className="flex flex-col items-center md:flex-row md:items-center md:gap-8 mb-8">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0 shadow-lg">
          {artist.image && (
            <AvatarImage
              src={artist.image}
              alt={`${artist.name}'s profile picture`}
            />
          )}
          <AvatarFallback className="text-4xl">
            {artist.name ? artist.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left mb-2">
            {artist.name}
          </h1>
          {/* More artist details could go here, aligned with the name */}
          <section className="mt-4">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              {artist.instagramHandle && (
                <a
                  href={`https://instagram.com/${artist.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  aria-label={`Link to ${artist.name}'s Instagram profile`}
                >
                  <Icon name="instagramColored" className="scale-150" />
                </a>
              )}
              {artist.tiktokHandle && (
                <a
                  href={`https://tiktok.com/@${artist.tiktokHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 border-2 border-transparent focus:outline-none focus:border-pink-500 focus:border-opacity-50"
                  aria-label={`Link to ${artist.name}'s TikTok profile`}
                >
                  <Icon name="tiktok" className="scale-150" />
                </a>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* Eligible Games */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Eligible Games</h2>
        <ArtistsEligibleGames scArtistId={params.artistId} />
      </section>
    </main>
  );
}
