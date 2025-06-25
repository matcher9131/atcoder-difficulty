export type Contest = {
    readonly id: string;
    readonly m: number | "inf";
    readonly s: readonly number[];
    // Dict by score
    readonly ds: ReadonlyArray<{
        readonly s: number;
        readonly p: number;
        readonly r: number;
    }>;
    // Dict by performance
    readonly dp: ReadonlyArray<{
        readonly p: number;
        readonly r: number;
        readonly s: number;
        readonly t: number;
    }>;
};
