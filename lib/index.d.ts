export declare const feedUrl = "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";
export type WaitTime = string;
export type RmvWaitTimeResponse = "Closed" | "Unavailable" | WaitTime;
export interface XmlParseResult {
    [key: string]: any;
}
export declare const formatWaitTime: (waitTime: RmvWaitTimeResponse) => number;
export declare const reformatWaitTime: (waitTime: WaitTime) => string;
export declare const convertTimeSpanToString: (timeSpan: number) => string;
export declare const parseWaitTimes: () => Promise<any>;
//# sourceMappingURL=index.d.ts.map