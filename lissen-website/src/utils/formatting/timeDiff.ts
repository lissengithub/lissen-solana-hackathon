import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const timeDiffText = (isoDateTime: string | undefined) => {
  if (!isoDateTime) return "";
  const target = dayjs(isoDateTime);
  if (!target.isValid()) return "";

  const diffMs = target.diff(dayjs());
  if (diffMs <= 0) return "Ended";

  const dur = dayjs.duration(diffMs);
  const weeks = dur.weeks();
  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  if (weeks >= 1) {
    return `${weeks}w:${days}d:${hours}h`;
  } else if (days >= 1) {
    return `${days}d:${hours}h:${minutes}m`;
  } else if (hours >= 1) {
    return `${hours}h:${minutes}m:${seconds}s`;
  } else if (minutes >= 0) {
    return `${minutes}m:${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};
