import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProdEnv = () =>
  process.env.NEXT_PUBLIC_PROJECT_ID === "lissenprod";

type ImageSize = "small" | "medium" | "large" | "xLarge";

export const getImageUrlWithSize = (
  url: string | undefined | null,
  imageSize: ImageSize,
) => {
  if (!url) return "";

  if (!url.includes("lissen.live")) {
    return url;
  }

  let size = "";

  switch (imageSize) {
    case "small":
      size = "_size=128";
      break;
    case "medium":
      size = "_size=256";
      break;
    case "large":
      size = "_size=512";
      break;
    case "xLarge":
      size = "_size=1024";
      break;
  }

  if (url.includes("_size=")) {
    return url.split("_size=").at(0) + size;
  }

  return url + size;
};

export function formatRelativeTime(isoDateString: string | null): string {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else {
    return `${days}d`;
  }
}
