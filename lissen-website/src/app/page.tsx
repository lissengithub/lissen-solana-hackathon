import Link from "next/link";
import Image from "next/image";
import GameCard from "@/components/fml/GameCard";

const defaultGame = {
  league: "EDM LEAGUE",
  theme: "Female artist",
  type: "Pop Quiz",
  image: "/images/fml/game-image.webp",
  title: "Women Game",
  prize: "$500 in prize",
  participants: 90,
  timeRemaining: "01d:18h",
};

export default function HomePage() {
  return (
    <main className="text-white pt-24 md:pt-36 lg:overflow-x-hidden">
      <div>
        <title>Lissen</title>

        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[641px] bg-gradient-radial" />

        {/* Hero Section */}
        <section className="flex md:justify-center flex-col md:flex-row md:items-center container">
          <div className="flex flex-col md:gap-4 z-20 flex-3">
            <div className="md:text-7xl text-4xl font-bold text-center md:text-left">
              <h1>Enter the</h1>
              <h1 className="fml-title-gradient xl:whitespace-nowrap pb-4">
                Fantasy Music Leagues
              </h1>
            </div>
            <p className="md:text-xl text-base  max-w-2xl mb:mb-12 mb-8 text-center md:text-left">
              One league per music genre, multiple games to win rewards. Music
              is so back, let&apos;s play together!
            </p>

            <Link
              href="/play"
              className="fml-cta-button inline-block text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-xl hover:opacity-90 transition-opacity self-center md:self-start mb-4 text-center"
            >
              START PLAYING FOR FREE
            </Link>
          </div>
          <div>
            <div className="flex items-center justify-center lg:w-auto">
              <Image
                src="/images/hero-v3.webp"
                alt="Hero Artwork"
                width={1000}
                height={1000}
                className="rounded-lg  object-contain relative mask-image-fade scale-[1.2] -translate-x-2 translate-y-2"
              />
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full container mt-2">
          <div className="bg-zinc-900/16 bg-gradient-to-br from-zinc-900/16 to-zinc-900/80 border border-white/10 backdrop-blur-[30px] rounded-3xl p-6 flex flex-col items-start pb-0">
            <h3 className="text-2xl font-extrabold tracking-tighter leading-8 mb-2">
              Create your team
            </h3>
            <p className="font-normal text-base leading-5 tracking-tight text-white/70">
              One team of 5 artists per league. Their points come from social
              and music apps.
            </p>

            <Image
              src="/images/fml/create-your-team.webp"
              alt="How it works"
              width={800}
              height={800}
              className="rounded-lg object-contain w-full h-full relative"
            />
          </div>

          <div className="bg-zinc-900/16 bg-gradient-to-br from-zinc-900/16 to-zinc-900/80 border border-white/10 backdrop-blur-[30px] rounded-3xl p-6 flex flex-col items-start pb-0">
            <h3 className="text-2xl font-extrabold tracking-tighter leading-8 mb-2">
              Join your favorite games
            </h3>
            <p className="font-normal text-base leading-5 tracking-tight text-white/70">
              Each game has a theme and a daily action, choose your team wisely
              and show your skills.
            </p>

            <div className="flex flex-col gap-2 w-full p-4 pb-0 mask-radial-fade">
              <GameCard game={defaultGame} />
              <GameCard game={defaultGame} />
              <GameCard game={defaultGame} />
            </div>
          </div>

          <div className="bg-zinc-900/16 bg-gradient-to-br from-zinc-900/16 to-zinc-900/80 border border-white/10 backdrop-blur-[30px] rounded-3xl p-6 flex flex-col items-start">
            <h3 className="text-2xl font-extrabold tracking-tighter leading-8 mb-2">
              Play & Win
            </h3>
            <p className="font-normal text-base leading-5 tracking-tight text-white/70">
              You and your friends climb game leaderboards with actions boosting
              your team points!
            </p>

            <div className="w-full">
              <section className="mt-5 w-full">
                <div className="flex flex-1 gap-3 items-center px-4 py-3 text-white rounded-[22px] rotate-[2.02deg] size-full bg-gradient-to-r from-[rgba(80,205,137,0.35)] to-[rgba(80,205,137,0.07)] backdrop-blur-md">
                  <div className="relative shrink-0 self-stretch my-auto w-[42px] h-[42px]">
                    <svg
                      viewBox="0 0 40 40"
                      className="absolute inset-0 w-full h-full"
                    >
                      <path
                        d="M17.5996 1.99767C19.3286 0.832486 21.5935 0.873887 23.275 2.08278L23.4358 2.20376L37.768 13.4099C39.4107 14.6943 40.0712 16.8618 39.4409 18.8346L39.3765 19.0248L33.1473 36.1184C32.4104 38.1407 30.4546 39.459 28.3035 39.3831L10.1215 38.741C8.03765 38.6674 6.22935 37.302 5.57968 35.3355L5.52004 35.1428L0.512094 17.6524C-0.0616918 15.6479 0.677932 13.5058 2.34736 12.2803L2.51266 12.1649L17.5996 1.99767Z"
                        fill="#50CD89"
                        stroke="#206489"
                        strokeWidth="0.625"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-black">
                      2
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 shrink justify-center self-stretch">
                    <h3 className="text-sm font-bold tracking-tight leading-none">
                      Artist points
                    </h3>
                    <p className="mt-2 text-xs tracking-tight leading-4 opacity-70">
                      +2 points for Burna thanks to a follower increase on
                      Instagram, Lissen and TikTok!
                    </p>
                  </div>
                </div>

                <div className="flex overflow-hidden gap-3 items-center px-4 py-3 w-full bg-gradient-to-r from-[rgba(242,153,81,0.4)] to-[#453628]/90 backdrop-blur-md rounded-3xl min-h-[82px] rotate-[-0.8deg]">
                  <div className="overflow-hidden self-stretch px-2.5 my-auto text-lg font-bold tracking-tight leading-none text-black whitespace-nowrap bg-yellow-400 h-[41px] rounded-[40px] w-[41px] flex items-center justify-center">
                    20
                  </div>
                  <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto text-white">
                    <h3 className="text-sm font-bold tracking-tight leading-none">
                      Action points
                    </h3>
                    <p className="mt-2 text-xs tracking-tight leading-4 opacity-70">
                      Today&apos;s pop quiz is live! Answer now to boost your
                      team score and earn 25 points.
                    </p>
                  </div>
                </div>

                <div className="flex overflow-hidden gap-3 items-center mt-3 px-4 py-3 w-full bg-gradient-to-r from-[rgba(47,128,237,0.4)] to-[rgba(47,128,237,0.08)] backdrop-blur-md rounded-3xl min-h-[90px] rotate-[-2deg]">
                  <div className="overflow-hidden gap-1 self-stretch px-0.5 my-auto text-lg font-bold tracking-tight leading-none text-white whitespace-nowrap bg-blue-500 rounded-md h-[41px] min-h-[41px] w-[41px] flex items-center justify-center">
                    12
                  </div>
                  <div className="flex flex-col flex-1 shrink justify-center self-stretch my-auto text-white">
                    <h3 className="text-sm font-bold tracking-tight leading-none">
                      Fan points
                    </h3>
                    <p className="mt-2 text-xs tracking-tight leading-4 opacity-70">
                      You complete actions faster than 98% of other fans: +12
                      points unlocked!
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
