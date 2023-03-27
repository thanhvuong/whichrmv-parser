export declare const feedUrl = "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";
export type WaitTime = string;
export type RmvWaitTimeResponse = "Closed" | "Unavailable" | WaitTime;
export interface XmlParseResult {
    [key: string]: any;
}
export interface RmvJsonBranch {
    town: string;
    licensing: RmvWaitTimeResponse;
    registration: RmvWaitTimeResponse;
}
export interface RmvBranchType extends RmvJsonBranch {
    address?: string;
    lat?: number;
    lon?: number;
    phone?: string;
}
export declare const formatWaitTime: (waitTime: RmvWaitTimeResponse) => number;
export declare const reformatWaitTime: (waitTime: WaitTime) => string;
export declare const convertTimeSpanToString: (timeSpan: number) => string;
export declare const parseWaitTimes: () => Promise<RmvBranchType[]>;
//# sourceMappingURL=index.d.ts.map