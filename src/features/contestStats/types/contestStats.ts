import type { StatsByScore } from "./statsByScore";

export type ContestStats = {
    readonly id: string;
    readonly s: readonly number[];
    readonly fr: readonly [string, string];
    readonly fu: readonly [string, string];
    readonly ss: ReadonlyArray<[number, StatsByScore]>;
    readonly sp: ReadonlyArray<[number, { readonly r: number; readonly s: number; readonly t: number }]>;
};
