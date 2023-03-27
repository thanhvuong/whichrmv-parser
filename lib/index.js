"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWaitTimes = exports.convertTimeSpanToString = exports.reformatWaitTime = exports.formatWaitTime = exports.feedUrl = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const location_1 = require("./location");
exports.feedUrl = "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";
const formatWaitTime = (waitTime) => {
    if (waitTime === "Closed") {
        return -1;
    }
    if (waitTime === "Unavailable") {
        return -2;
    }
    const colonIndex = waitTime.indexOf(":");
    if (colonIndex === -1) {
        throw new Error("Invalid wait time format: must include a colon");
    }
    const timeSegments = waitTime.split(":");
    if (timeSegments.length !== 3) {
        throw new Error("Invalid wait time format: must include hours, minutes, and seconds");
    }
    const [hours, minutes, seconds] = timeSegments.map(segment => parseInt(segment, 10));
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        throw new Error("Invalid wait time format: must include numeric values for hours, minutes, and seconds");
    }
    const waitTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
    return waitTimeInSeconds;
};
exports.formatWaitTime = formatWaitTime;
const reformatWaitTime = (waitTime) => {
    const timeSegments = waitTime.split(":").map(Number);
    const hasNonZeroSegment = timeSegments.some(segment => segment !== 0);
    if (!hasNonZeroSegment) {
        return "0";
    }
    const formattedSegments = timeSegments.map((segment, index) => {
        const suffix = ["h", "m", "s"][index];
        return segment ? `${segment}${suffix} ` : "";
    });
    return formattedSegments.join("").trim();
};
exports.reformatWaitTime = reformatWaitTime;
const convertTimeSpanToString = (timeSpan) => {
    const milliseconds = timeSpan * 1000;
    const date = new Date(milliseconds);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const formattedTimeSpan = `${hours}:${minutes}:${seconds}`;
    return (0, exports.reformatWaitTime)(formattedTimeSpan);
};
exports.convertTimeSpanToString = convertTimeSpanToString;
const parseWaitTimes = async () => {
    var _a, _b;
    const res = await fetch(exports.feedUrl, {
        method: "GET",
    });
    const xml = await res.text();
    const parser = new fast_xml_parser_1.XMLParser();
    const parseXML = (xml) => new Promise((resolve, reject) => {
        try {
            if (!fast_xml_parser_1.XMLValidator.validate(xml)) {
                reject(new Error("XML is not valid"));
            }
            const parsed = parser.parse(xml);
            resolve(parsed);
        }
        catch (e) {
            reject(new Error("Error when parsing XML"));
        }
    });
    const jsonObj = await parseXML(xml);
    const branchData = (_b = (_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.branches) === null || _a === void 0 ? void 0 : _a.branch) !== null && _b !== void 0 ? _b : [];
    if (branchData.length < 1) {
        throw new Error("No RMV data");
    }
    const branches = branchData.map((branch) => {
        if (location_1.location[branch.town]) {
            const { address, lat, lon, phone } = location_1.location[branch.town];
            branch.address = address;
            branch.lat = lat;
            branch.lon = lon;
            branch.phone = phone;
        }
        return {
            ...branch,
            licensing: (0, exports.formatWaitTime)(branch.licensing),
            registration: (0, exports.formatWaitTime)(branch.registration),
        };
    });
    return branches;
};
exports.parseWaitTimes = parseWaitTimes;
//# sourceMappingURL=index.js.map