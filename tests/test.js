import {
  feedUrl,
  formatWaitTime,
  locationsMap,
  parseWaitTimes,
  reformatWaitTime,
  convertTimeSpanToString
} from '../index';
import { location } from '../location';

test('feedUrl should be feed url', () => {
  expect(feedUrl).toBe('https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index');
});

test('locationsMap() should return locations map', () => {
  expect(locationsMap()).toBe(location);
});

test('formatWaitTime() should handle Closed', () => {
  expect(formatWaitTime('Closed')).toBe(-1);
});

test('formatWaitTime() should handle Unavailable', () => {
  expect(formatWaitTime('Unavailable')).toBe(-2);
});

test('formatWaitTime() should handle RMV wait time', () => {
  expect(formatWaitTime('01:23:45')).toBe(5025);
});

test('formatWaitTime() should handle zero wait time', () => {
  expect(formatWaitTime('00:00:00')).toBe(0);
});

test('reformatWaitTime() should return string', () => {
  expect(reformatWaitTime('01:23:45')).toBe('1h 23m 45s');
});

test('convertTimeSpanToString() should convert timespan to string', () => {
  expect(convertTimeSpanToString(5025)).toBe('1h 23m 45s');
});

test('parseWaitTimes() should return data', async () => {
  expect.assertions(2);
  const waitTimes = await parseWaitTimes();
  expect(waitTimes.length).toBeGreaterThan(0);
  expect(waitTimes[0].town).toBe('Attleboro');
});

// test.only('demo', async () => {
//   const waitTimes = await parseWaitTimes();
//   console.log('demo', waitTimes)
// })
