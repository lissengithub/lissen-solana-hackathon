import ExperienceCard from './ExperienceCard';
import { RouterOutputs } from '@/lib/trpc';

export type Experience = RouterOutputs['website']['experiences']['get']['all']['data'][number];

export default function ExperiencesList({
  containerClassName = "",
  experiences,
}: {
  containerClassName?: string;
  experiences: Experience[];
}) {  
  return (
    <div className={containerClassName}>
      {experiences?.map((show) => {
        return (
          <ExperienceCard
            key={show.id}
            id={show.id}
            image={show.image ?? ''}
            title={show.location?.split(",")[0] ?? ""}
            date={show.dateTime}
            accentCode={show.accentCode}
            // genre={show.genre}
          />
        );
      })}
    </div>
  )
}
