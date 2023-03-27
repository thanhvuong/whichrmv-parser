import { XMLParser, XMLValidator } from "fast-xml-parser";
import { location } from "./location";

export const feedUrl =
  "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";

export type ApiResponseWaitTime = string;
export type TransformedWaitTime = number;
export type RmvWaitTimeResponse =
  | "Closed"
  | "Unavailable"
  | ApiResponseWaitTime
  | TransformedWaitTime;

export interface RmvJsonBranch {
  town: string;
  licensing: RmvWaitTimeResponse;
  registration: RmvWaitTimeResponse;
}

export interface XmlParseResult {
  branches: {
    branch: RmvJsonBranch[];
  };
}

export interface RmvBranchType {
  town: string;
  licensing: number;
  registration: number;
  address?: string;
  lat?: number;
  lon?: number;
  phone?: string;
}

export const formatWaitTime = (waitTime: RmvWaitTimeResponse): number => {
  if (waitTime === "Closed") {
    return -1;
  }

  if (waitTime === "Unavailable") {
    return -2;
  }

  if (typeof waitTime === "number") {
    throw new Error("Wait time is already formatted as a number");
  }

  const colonIndex = waitTime.indexOf(":");
  if (colonIndex === -1) {
    throw new Error("Invalid wait time format: must include a colon");
  }

  const timeSegments = waitTime.split(":");
  if (timeSegments.length !== 3) {
    throw new Error(
      "Invalid wait time format: must include hours, minutes, and seconds"
    );
  }

  const [hours, minutes, seconds] = timeSegments.map((segment) =>
    parseInt(segment, 10)
  );
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error(
      "Invalid wait time format: must include numeric values for hours, minutes, and seconds"
    );
  }

  const waitTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
  return waitTimeInSeconds;
};

export const reformatWaitTime = (waitTime: ApiResponseWaitTime) => {
  const timeSegments = waitTime.split(":").map(Number);
  const hasNonZeroSegment = timeSegments.some((segment) => segment !== 0);

  if (!hasNonZeroSegment) {
    return "0";
  }

  const formattedSegments = timeSegments.map((segment, index) => {
    const suffix = ["h", "m", "s"][index];
    return segment ? `${segment}${suffix} ` : "";
  });

  return formattedSegments.join("").trim();
};

export const convertTimeSpanToString = (timeSpan: number) => {
  const milliseconds = timeSpan * 1000;
  const date = new Date(milliseconds);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const formattedTimeSpan = `${hours}:${minutes}:${seconds}`;
  return reformatWaitTime(formattedTimeSpan);
};

export const parseWaitTimes = async () => {
  const res = await fetch(feedUrl, {
    method: "GET",
  });
  const xml = await res.text();
  const parser = new XMLParser({
    ignoreDeclaration: true,
  });

  const parseXML = <T extends XmlParseResult>(xml: string): Promise<T> =>
    new Promise((resolve, reject) => {
      try {
        if (!XMLValidator.validate(xml)) {
          reject(new Error("XML is not valid"));
        }
        const parsed = parser.parse(xml);
        resolve(parsed);
      } catch (e) {
        reject(new Error("Error when parsing XML"));
      }
    });

  const jsonObj = await parseXML(xml);
  const branchData: RmvJsonBranch[] = jsonObj?.branches?.branch ?? [];

  if (branchData.length < 1) {
    throw new Error("No RMV data");
  }

  const branches: RmvBranchType[] = branchData.map((branch) => {
    const branchMetadata = location[branch?.town] ?? {};
    return {
      ...branch,
      address: branchMetadata.address ?? "",
      lat: branchMetadata.lat ?? 0,
      lon: branchMetadata.lon ?? 0,
      phone: branchMetadata.phone ?? "",
      licensing: formatWaitTime(branch.licensing),
      registration: formatWaitTime(branch.registration),
    };
  });

  return branches;
};
