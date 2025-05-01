import type { Problem } from "./problem";

export type Problems = {
    readonly [problemId: string]: Problem;
};
