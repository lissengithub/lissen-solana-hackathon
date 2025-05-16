'use client'

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import ExperiencesList from "./ExperiencesList";
import Link from "next/link";

export default function UpcomingShows() {
  const { data } = trpc.website.experiences.get.all.useQuery({ limit: 4 });

  return (
    <div className="mt-16">
      <div className="container flex flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-4xl font-black text-white font-residenzGrotesk">
          Upcoming London shows
        </h2>

        <Button variant="outline" className="uppercase text-white font-medium rounded-full border-white" asChild>
          <Link href="/experiences/all">
            See all
          </Link>
        </Button>
      </div>

      <ExperiencesList
        containerClassName="container flex xl:grid xl:grid-cols-4 gap-5 overflow-x-auto overflow-visible no-scrollbar pb-4"
        experiences={data?.data ?? []}
      />
    </div>
  )
}
