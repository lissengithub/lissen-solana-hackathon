import {
  AccessBonusTypeOptions,
  AccessTypeOptions,
} from "./experiences.constants";

const CONCERT_LABEL = "Concert";
const MERCH_LABEL = "Merch";
// const SERVICE_TALK_VIDEO_LABEL = "Talk (Video)";
const SONG_LABEL = "Unreleased Song";
const EXPERIENCE_LABEL = "Experience";
const CONTENT_LABEL = "Content";
type ExperienceOption = {
  label: string;
  value: AccessTypeOptions;
  enabled: boolean;
};

export const getAccessTypeDisplayValue = (accessType: AccessTypeOptions) => {
  switch (accessType) {
    case "concert":
      return CONCERT_LABEL;

    // case "service_talk_video":
    //   return SERVICE_TALK_VIDEO_LABEL;

    case "merch":
      return MERCH_LABEL;

    case "song":
      return SONG_LABEL;

    case "experience":
      return EXPERIENCE_LABEL;

    case "content":
      return CONTENT_LABEL;

    default:
      return "";
  }
};

export const EXPERIENCE_TYPES: ExperienceOption[] = [
  {
    label: getAccessTypeDisplayValue("concert"),
    value: "concert",
    enabled: true,
  },
  {
    label: getAccessTypeDisplayValue("merch"),
    value: "merch",
    enabled: true,
  },
  // {
  //   label: getExperienceTypeDisplayValue("service_talk_video"),
  //   value: "service_talk_video",
  //   enabled: false,
  // },
  {
    label: getAccessTypeDisplayValue("song"),
    value: "song",
    enabled: true,
  },
];

export const BONUS_TYPES: {
  label: string;
  value: AccessBonusTypeOptions;
}[] = [
  {
    label: "Giveaway",
    value: "giveaway",
  },
  {
    label: "Direct",
    value: "direct",
  },
];
