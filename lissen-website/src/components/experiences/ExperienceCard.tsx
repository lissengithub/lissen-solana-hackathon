import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { Experience } from "./ExperiencesList";
import { getImageUrlWithSize } from "@/lib/utils";

const ExperienceCard = ({
  id,
  image,
  title,
  date,
  genre,
  accentCode = "1",
}: {
  id: string;
  image: string;
  title: string;
  date: string;
  genre?: string;
  accentCode: Experience["accentCode"];
}) => {
  return (
    <Link href={`/experiences/${id}`} className="relative w-full">
      <div
        className="absolute top-[4px] left-[4px] rounded-2xl aspect-[0.7] w-full" 
        style={{ background: `var(--experience-accent-gradient-${accentCode})` }}
      />

      <div className={`
        relative
        rounded-2xl overflow-hidden min-w-[300px]
        border-[0.5px]
      `}
        style={{ borderColor: `var(--experience-accent-${accentCode})`}}
      >
        <Image 
          src={getImageUrlWithSize(image, "medium")}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover aspect-[0.7]"
        />

        <div className={`
          absolute bottom-0 w-full h-full flex flex-col gap-2 items-center justify-end pb-4
          bg-gradient-to-t from-black to-transparent to-60%
        `}>
          <h3 className="text-3xl md:text-4xl font-black text-white font-residenzGrotesk text-center">{title}</h3>

          <p className="text-white uppercase">
            <span className="opacity-80 font-medium text-xs md:text-sm">
              {dayjs(date).format('dddd')}
            </span>
            <span className="font-black text-sm md:text-lg ml-1 font-residenzGrotesk">
              {dayjs(date).format('MMM D')}
            </span>
          </p>

          {genre && (
            <p className={`
              text-[10px] md:text-xs text-white font-medium rounded-full px-2 py-1 tracking-tight
              border-[0.2px] border-primary 
              bg-primary/20
              shadow-[0_0.6px_0px_0px_hsl(var(--primary))]
            `}>
              {genre}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ExperienceCard;
