import type { ReactNode } from "react";
import type { StatsByPerformance } from "../../types/statsByPerformance";
import { useRankFromPerformanceTableRow } from "./useRankFromPerformanceTableRow";
import { RankFromPerformanceTableRow } from "./RankFromPerformanceTableRow";

type RankFromPerformanceTableRowContainerProps = {
    readonly performance: number;
    readonly statsByPerformance: StatsByPerformance;
    readonly problemScores: readonly number[];
};

export const RankFromPerformanceTableRowContainer = ({
    performance,
    statsByPerformance,
    problemScores,
}: RankFromPerformanceTableRowContainerProps): ReactNode => {
    const props = useRankFromPerformanceTableRow(performance, statsByPerformance, problemScores);
    return <RankFromPerformanceTableRow {...props} />;
};
