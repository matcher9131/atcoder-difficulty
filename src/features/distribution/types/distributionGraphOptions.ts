type Scale = {
    readonly min: number;
    readonly max: number;
    readonly ticks: {
        readonly stepSize: number;
    };
};

export type DistributionGraphOptions = {
    readonly scales: {
        readonly x: Scale;
        readonly y: Scale;
    };
};
