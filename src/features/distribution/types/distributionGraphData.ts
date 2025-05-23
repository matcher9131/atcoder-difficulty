// I want to make the types of member array readonly, but Chart component in react-chartjs-2 only accepts non-readonly objects
export type DistributionGraphData = {
    readonly labels: number[];
    readonly datasets: Array<{
        readonly label: string;
        readonly data: ReadonlyArray<readonly [number, number]>;
        readonly type: "bar" | "line";
        readonly borderColor?: string;
        readonly backgroundColor?: string;
    }>;
};
