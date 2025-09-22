import { type PerformanceFromScoreTableProps } from "./PerformanceFromScoreTable";
import { PerformanceFromScoreTableRowContainer } from "../performanceFromScoreTableRow";
import type { StatsByScore } from "../../types/statsByScore";

export const usePerformanceFromScoreTable = (
    statsByScore: ReadonlyArray<[number, StatsByScore]>,
    problemScores: readonly number[],
): PerformanceFromScoreTableProps => {
    const rows = statsByScore.map(([score, stats]) => (
        <PerformanceFromScoreTableRowContainer
            key={score}
            score={score}
            statsByScore={stats}
            problemScores={problemScores}
        />
    ));

    return { rows };
};
