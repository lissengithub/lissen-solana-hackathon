import React from "react";
import { useFmlArtistMetrics } from "@/hooks/fml/useFmlArtistMetrics";
import { formatCompactNumber } from "@/utils/formatting/numbers";
import Icon, { IconName } from "@/components/ui/icon";

interface MetricsGridProps {
  scArtistId: string;
}

const formatPct = (pct: number | null | undefined) => {
  if (pct === null || pct === undefined) return "+0";
  const roundedPct = Math.round(pct);
  if (roundedPct >= 0) return `+${roundedPct}`;
  return `${roundedPct}`;
};

const MetricsGrid: React.FC<MetricsGridProps> = ({ scArtistId }) => {
  const {
    query: { data: metrics },
  } = useFmlArtistMetrics(scArtistId);

  const platformMetrics: {
    iconName: IconName;
    value: number | null | undefined;
    subText: string;
    pct: number | null | undefined;
  }[] = [
    {
      iconName: "lissen",
      value: 0,
      subText: "Lissen Streams",
      pct: 0,
    },
    {
      iconName: "instagramColored",
      value: metrics?.instagramFollowerCount,
      subText: "Instagram Followers",
      pct: metrics?.instagramFollowerPct,
    },
    {
      iconName: "spotify",
      value: metrics?.spotifyFollowerCount,
      subText: "Spotify Followers",
      pct: metrics?.spotifyFollowerPct,
    },
    {
      iconName: "youtubeColored",
      value: metrics?.youtubeViews,
      subText: "YouTube Views",
      pct: metrics?.youtubeViewsPct,
    },
    {
      iconName: "soundcloud",
      value: metrics?.soundcloudFollowerCount,
      subText: "Soundcloud Followers",
      pct: metrics?.soundcloudFollowerPct,
    },
    {
      iconName: "tiktok",
      value: metrics?.tiktokStreams,
      subText: "TikTok Views",
      pct: metrics?.tiktokStreamsPct,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-3">
      {platformMetrics.map((metric, index) => (
        <div
          key={index}
          className="bg-[#1C1F21] rounded-md p-1.5 sm:p-3 flex items-start gap-1 sm:gap-2 border border-[#434647]"
        >
          <div className="w-6 h-6 rounded-full bg-[#434647] flex justify-center items-center aspect-square">
            <Icon name={metric.iconName} className="w-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm sm:text-base font-semibold truncate">
              {metric.value ? formatCompactNumber(metric.value) : "0"}
            </p>
            <p className="text-[#9d9e9e] text-[10px] sm:text-sm truncate">
              {metric.subText}
            </p>
            <p className="text-[#50CD89] text-[10px] sm:text-xs">
              {formatPct(metric.pct)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
