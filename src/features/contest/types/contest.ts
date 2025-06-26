export type Contest = {
    readonly id: string;
    readonly m: number | "inf";
    readonly s: readonly number[];
    // Stats by score
    readonly ss: ReadonlyArray<{
        readonly s: number;
        readonly p: number;
        readonly r: number;
    }>;
    // Stats by performance
    readonly sp: ReadonlyArray<{
        readonly p: number;
        readonly r: number;
        readonly s: number;
        readonly t: number;
    }>;
};
