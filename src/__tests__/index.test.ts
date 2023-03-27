import {
  feedUrl,
  formatWaitTime,
  parseWaitTimes,
  reformatWaitTime,
  convertTimeSpanToString,
} from "../index";

const mockData = `<?xml version="1.0" encoding="UTF-8"?><branches><branch><town>Attleboro</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Boston</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Braintree</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Brockton</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Chicopee</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Danvers</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>East Hampton</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Fall River</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Greenfield</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Haverhill</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Lawrence</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Leominster</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Lowell</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Marthas Vineyard</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Milford</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Nantucket</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Natick</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>New Bedford</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>N Adams</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Pittsfield</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Plymouth</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Revere</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Roslindale</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Yarmouth</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Southbridge</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Springfield</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Taunton</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Watertown</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Wilmington</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch><branch><town>Worcester</town><licensing>Unavailable</licensing><registration>Unavailable</registration></branch></branches>`;

describe("index", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("feedUrl should be feed url", () => {
    expect(feedUrl).toBe(
      "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index"
    );
  });

  test("formatWaitTime() should handle Closed", () => {
    expect(formatWaitTime("Closed")).toBe(-1);
  });

  test("formatWaitTime() should handle Unavailable", () => {
    expect(formatWaitTime("Unavailable")).toBe(-2);
  });

  test("formatWaitTime() should handle RMV wait time", () => {
    expect(formatWaitTime("01:23:45")).toBe(5025);
  });

  test("formatWaitTime() should handle zero wait time", () => {
    expect(formatWaitTime("00:00:00")).toBe(0);
  });

  test("reformatWaitTime() should return string", () => {
    expect(reformatWaitTime("01:23:45")).toBe("1h 23m 45s");
  });

  test("convertTimeSpanToString() should convert timespan to string", () => {
    expect(convertTimeSpanToString(5025)).toBe("1h 23m 45s");
  });

  test("parseWaitTimes() should return data", async () => {
    expect.assertions(2);

    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(mockData),
    };
    const mockFetch = jest
      .fn()
      .mockResolvedValue(mockResponse as unknown as Response);

    global.fetch = mockFetch;

    const waitTimes = await parseWaitTimes();
    expect(waitTimes.length).toBeGreaterThan(0);
    expect(waitTimes[0].town).toBe("Attleboro");
  });
});
