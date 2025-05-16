// prettier-ignore
export type CurrentTerritoryCode = ("AD" | "AE" | "AF" | "AG" | "AI" | "AL" | "AM" | "AN" | "AO" | "AQ" | "AR" | "AS" | "AT" | "AU" | "AW" | "AX" | "AZ" | "BA" | "BB" | "BD" | "BE" | "BF" | "BG" | "BH" | "BI" | "BJ" | "BL" | "BM" | "BN" | "BO" | "BQ" | "BR" | "BS" | "BT" | "BV" | "BW" | "BY" | "BZ" | "CA" | "CC" | "CD" | "CF" | "CG" | "CH" | "CI" | "CK" | "CL" | "CM" | "CN" | "CO" | "CR" | "CS" | "CU" | "CV" | "CW" | "CX" | "CY" | "CZ" | "DE" | "DJ" | "DK" | "DM" | "DO" | "DZ" | "EC" | "EE" | "EG" | "EH" | "ER" | "ES" | "ES-CE" | "ES-CN" | "ES-ML" | "ET" | "FI" | "FJ" | "FK" | "FM" | "FO" | "FR" | "GA" | "GB" | "GD" | "GE" | "GF" | "GG" | "GH" | "GI" | "GL" | "GM" | "GN" | "GP" | "GQ" | "GR" | "GS" | "GT" | "GU" | "GW" | "GY" | "HK" | "HM" | "HN" | "HR" | "HT" | "HU" | "ID" | "IE" | "IL" | "IM" | "IN" | "IO" | "IQ" | "IR" | "IS" | "IT" | "JE" | "JM" | "JO" | "JP" | "KE" | "KG" | "KH" | "KI" | "KM" | "KN" | "KP" | "KR" | "KW" | "KY" | "KZ" | "LA" | "LB" | "LC" | "LI" | "LK" | "LR" | "LS" | "LT" | "LU" | "LV" | "LY" | "MA" | "MC" | "MD" | "ME" | "MF" | "MG" | "MH" | "MK" | "ML" | "MM" | "MN" | "MO" | "MP" | "MQ" | "MR" | "MS" | "MT" | "MU" | "MV" | "MW" | "MX" | "MY" | "MZ" | "NA" | "NC" | "NE" | "NF" | "NG" | "NI" | "NL" | "NO" | "NP" | "NR" | "NU" | "NZ" | "OM" | "PA" | "PE" | "PF" | "PG" | "PH" | "PK" | "PL" | "PM" | "PN" | "PR" | "PS" | "PT" | "PW" | "PY" | "QA" | "RE" | "RO" | "RS" | "RU" | "RW" | "SA" | "SB" | "SC" | "SD" | "SE" | "SG" | "SH" | "SI" | "SJ" | "SK" | "SL" | "SM" | "SN" | "SO" | "SR" | "SS" | "ST" | "SV" | "SX" | "SY" | "SZ" | "TC" | "TD" | "TF" | "TG" | "TH" | "TJ" | "TK" | "TL" | "TM" | "TN" | "TO" | "TR" | "TT" | "TV" | "TW" | "TZ" | "UA" | "UG" | "UM" | "US" | "UY" | "UZ" | "VA" | "VC" | "VE" | "VG" | "VI" | "VN" | "VU" | "WF" | "WS" | "YE" | "YT" | "ZA" | "ZM" | "ZW" | "4" | "8" | "12" | "20" | "24" | "28" | "31" | "32" | "36" | "40" | "44" | "48" | "50" | "51" | "52" | "56" | "64" | "68" | "70" | "72" | "76" | "84" | "90" | "96" | "100" | "104" | "108" | "112" | "116" | "120" | "124" | "132" | "140" | "144" | "148" | "152" | "156" | "158" | "170" | "174" | "178" | "180" | "188" | "191" | "192" | "196" | "200" | "203" | "204" | "208" | "212" | "214" | "218" | "222" | "226" | "230" | "231" | "232" | "233" | "242" | "246" | "250" | "258" | "262" | "266" | "268" | "270" | "276" | "278" | "280" | "288" | "296" | "300" | "308" | "320" | "324" | "328" | "332" | "336" | "340" | "344" | "348" | "352" | "356" | "360" | "364" | "368" | "372" | "376" | "380" | "384" | "388" | "392" | "398" | "400" | "404" | "408" | "410" | "414" | "417" | "418" | "422" | "426" | "428" | "430" | "434" | "438" | "440" | "442" | "446" | "450" | "454" | "458" | "462" | "466" | "470" | "478" | "480" | "484" | "492" | "496" | "498" | "499" | "504" | "508" | "512" | "516" | "520" | "524" | "528" | "540" | "548" | "554" | "558" | "562" | "566" | "578" | "583" | "584" | "585" | "586" | "591" | "598" | "600" | "604" | "608" | "616" | "620" | "624" | "626" | "630" | "634" | "642" | "643" | "646" | "659" | "662" | "670" | "674" | "678" | "682" | "686" | "688" | "690" | "694" | "702" | "703" | "704" | "705" | "706" | "710" | "716" | "720" | "724" | "728" | "729" | "732" | "736" | "740" | "748" | "752" | "756" | "760" | "762" | "764" | "768" | "776" | "780" | "784" | "788" | "792" | "795" | "798" | "800" | "804" | "807" | "810" | "818" | "826" | "834" | "840" | "854" | "858" | "860" | "862" | "882" | "886" | "887" | "890" | "891" | "894" | "2100" | "2101" | "2102" | "2103" | "2104" | "2105" | "2106" | "2107" | "2108" | "2109" | "2110" | "2111" | "2112" | "2113" | "2114" | "2115" | "2116" | "2117" | "2118" | "2119" | "2120" | "2121" | "2122" | "2123" | "2124" | "2125" | "2126" | "2127" | "2128" | "2129" | "2130" | "2131" | "2132" | "2133" | "2134" | "2136" | "XK" | "Worldwide");

export type TerritoryValue = {
  [key in CurrentTerritoryCode]?: string;
};

export type LanguageValue = { default: string } & {
  [key: string]: string;
};

export type Deal = {
  commercialModelType: string;
  endDate: string | undefined | null;
  startDate: string;
  useType: string;
};

export type TerritoryDeals = {
  [key in CurrentTerritoryCode]: Deal;
};

export type Artist = {
  type: "MainArtist" | "FeaturedArtist";
  name: TerritoryValue;
  ext_reference: string;
};

export type Release = {
  ext_id: string;
  cLine: string;
  artists: Array<Artist>;
  artistsDisplayText: TerritoryValue;
  type: string;
  title: TerritoryValue;
  labels: TerritoryValue;
  duration?: string;
  genre: string;
  subgenre: string;
  advisory: TerritoryValue;
  images: Array<{
    type: string;
    advisory: TerritoryValue;
    uri: {
      uri: string | undefined;
    }[];
  }>;
  availableFrom: string;
};

export type Track = {
  sequenceNumber: number;
  isrc: string;
  pLine: string;
  title: TerritoryValue;
  artists: Array<Artist>;
  artistsDisplayText: TerritoryValue;
  url: string;
  advisory: TerritoryValue;
  isInstrumental: boolean;
  language?: string;
  creationDate?: string;
  duration: string;
  rightsControllers: Array<{
    names: TerritoryValue;
    reference: string;
    share?: number;
  }>;
};

export type SongIngestReleaseSchema = {
  _metadata: {
    releaseProfileVersionId: string;
    messageId: string;
    sender: {
      dpid: string;
      name: string | undefined;
    };
    receiver: {
      dpid: string;
      name: string | undefined;
    };
  };
  release: Release;
  tracks: Track[];
  partyList: Array<{
    dpid?: string;
    reference: string;
    names: TerritoryValue;
  }>;
};

export type SongIngestReleaseProperties = {
  rootFolderName: string;
  releaseFolderName: string;
  releaseId: string;
  batchCompleteFile: string;
  metadataFile: string;
};
