export type Contest = {
    readonly id: string;
    readonly m: number | "inf";
    readonly s: readonly number[];
    // Stats by score
    readonly ss: ReadonlyArray<
        readonly [
            number,
            {
                readonly p: number;
                readonly r: number;
            } | null,
        ]
    >;
    // Stats by performance
    readonly sp: ReadonlyArray<
        readonly [
            number,
            {
                readonly r: number;
                readonly s: number;
                readonly t: number;
            } | null,
        ]
    >;
};
