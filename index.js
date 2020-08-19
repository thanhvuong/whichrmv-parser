import fetch from "isomorphic-unfetch";
import { parse, validate } from "fast-xml-parser";
import { location } from "./location";

const feedUrl = "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";

const formatWaitTime = (waitTime) => {
  if (waitTime === "Closed") {
    return -1;
  }

  if (waitTime === "Unavailable") {
    return -2;
  }

  try {
    const timeSegment = waitTime.split(":");
    if (!+timeSegment[0] && !+timeSegment[1] && !+timeSegment[2]) {
      return 0;
    }
    const waitTimeInSeconds =
      +timeSegment[0] * 60 * 60 + +timeSegment[1] * 60 + +timeSegment[2];
    return waitTimeInSeconds;
  } catch (e) {
    throw new Error("Error formatting wait time.", e);
  }
};

const reformatWaitTime = (waitTime) => {
  try {
    const timeSegment = waitTime.split(":");
    if (!+timeSegment[0] && !+timeSegment[1] && !+timeSegment[2]) {
      return 0;
    }
    const hour = +timeSegment[0] ? `${+timeSegment[0]}h ` : "";
    const min = +timeSegment[1] ? `${+timeSegment[1]}m ` : "";
    const sec = +timeSegment[2] ? `${+timeSegment[2]}s` : "";
    const wait = `${hour}${min}${sec}`.trim();
    return wait;
  } catch (e) {
    throw new Error("Error reformatting wait time.", e);
  }
};

const convertTimeSpanToString = (timeSpan) => {
  try {
    const convertedTimeSpan = new Date(1000 * timeSpan)
      .toISOString()
      .substr(11, 8);
    return reformatWaitTime(convertedTimeSpan);
  } catch (e) {
    throw new Error("Error converting Timespan to string.", e);
  }
};

const parseWaitTimes = async () => {
  const res = await fetch(feedUrl, {
    method: "GET",
  });
  const xml = await res.text();

  const parseXML = (xml) =>
    new Promise((resolve, reject) => {
      try {
        if (!validate(xml)) {
          reject(new Error("XML is not valid"));
        }
        const parsed = parse(xml);
        resolve(parsed);
      } catch (e) {
        reject(new Error("Error when parsing XML", e));
      }
    });

  const jsonObj = await parseXML(xml);
  const branchData = jsonObj.branches.branch || [];

  if (branchData.length < 1) {
    throw new Error("No RMV data");
  }

  const branches = branchData.map((branch) => {
    if (location[branch.town]) {
      const { address, lat, lon, phone } = location[branch.town];
      branch.address = address;
      branch.lat = lat;
      branch.lon = lon;
      branch.phone = phone;
    }
    return {
      ...branch,
      licensing: formatWaitTime(branch.licensing),
      registration: formatWaitTime(branch.registration),
    };
  });
  return branches;
};

export {
  convertTimeSpanToString,
  feedUrl,
  formatWaitTime,
  parseWaitTimes,
  reformatWaitTime,
};
