import { type RankFromPerformanceTableProps } from "./RankFromPerformanceTable";
import { RankFromPerformanceTableRowContainer } from "../rankFromPerformanceTableRow/";
import type { StatsByPerformance } from "../../types/statsByPerformance";

export const useRankFromPerformanceTable = (
    statsByPerformance: ReadonlyArray<[number, StatsByPerformance]>,
    problemScores: readonly number[],
): RankFromPerformanceTableProps => {
    const rows = statsByPerformance.map(([performance, stats]) => (
        <RankFromPerformanceTableRowContainer
            key={performance}
            performance={performance}
            statsByPerformance={stats}
            problemScores={problemScores}
        />
    ));

    return { rows };
};
