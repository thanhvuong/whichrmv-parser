import fetch from 'isomorphic-unfetch';
import { parse, validate } from 'fast-xml-parser';
import { location } from './location';

export const feedUrl = 'https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index';

export const locationsMap = () => {
  return location;
};

export const formatWaitTime = waitTime => {
  if (waitTime === 'Closed') {
    return -1;
  }

  if (waitTime === 'Unavailable') {
    return -2;
  }

  try {
    const timeSegment = waitTime.split(':');
    if (!+timeSegment[0] && !+timeSegment[1] && !+timeSegment[2]) {
      return 0;
    }
    const hour = +timeSegment[0] ? `${+timeSegment[0]}h ` : '';
    const min = +timeSegment[1] ? `${+timeSegment[1]}m ` : '';
    const sec = +timeSegment[2] ? `${+timeSegment[2]}s` : '';
    const wait = `${hour}${min}${sec}`.trim();
    return wait;
  } catch (e) {
    throw new Error(`Something broke. ${e}`);
  }
};

export const parseWaitTimes = async () => {
  const res = await fetch(feedUrl, {
    method: 'GET',
  });
  const xml = await res.text();

  if (!validate(xml)) {
    throw new Error('XML is not valid');
  }

  const jsonObj = await parse(xml);

  if (jsonObj.branches.branch.length < 1) {
    throw new Error('No RMV data');
  }

  const branches = jsonObj.branches.branch.map(branch => {
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
