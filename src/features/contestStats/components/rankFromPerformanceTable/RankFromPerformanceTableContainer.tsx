import type { ReactNode } from "react";
import { useRankFromPerformanceTable } from "./useRankFromPerformanceTable";
import { RankFromPerformanceTable } from "./RankFromPerformanceTable";
import type { StatsByPerformance } from "../../types/statsByPerformance";

type RankFromPerformanceTableContainerProps = {
    readonly statsByPerformance: ReadonlyArray<[number, StatsByPerformance]>;
    readonly problemScores: readonly number[];
};

export const RankFromPerformanceTableContainer = ({
    statsByPerformance,
    problemScores,
}: RankFromPerformanceTableContainerProps): ReactNode => {
    const props = useRankFromPerformanceTable(statsByPerformance, problemScores);
    return <RankFromPerformanceTable {...props} />;
};
