export declare const feedUrl = "https://dotfeeds.state.ma.us/api/RMVBranchWaitTime/Index";
export type ApiResponseWaitTime = string;
export type TransformedWaitTime = number;
export type RmvWaitTimeResponse = "Closed" | "Unavailable" | ApiResponseWaitTime | TransformedWaitTime;
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
export declare const formatWaitTime: (waitTime: RmvWaitTimeResponse) => number;
export declare const reformatWaitTime: (waitTime: ApiResponseWaitTime) => string;
export declare const convertTimeSpanToString: (timeSpan: number) => string;
export declare const parseWaitTimes: () => Promise<RmvBranchType[]>;
//# sourceMappingURL=index.d.ts.map