import { PerformanceFromScoreTableRow } from "./PerformanceFromScoreTableRow";
import type { ReactNode } from "react";
import type { StatsByScore } from "../../types/statsByScore";
import { usePerformanceFromScoreTableRow } from "./usePerformanceFromScoreTableRow";

type PerformanceFromScoreTableRowContainerProps = {
    readonly score: number;
    readonly statsByScore: StatsByScore;
    readonly problemScores: readonly number[];
};

export const PerformanceFromScoreTableRowContainer = ({
    score,
    statsByScore,
    problemScores,
}: PerformanceFromScoreTableRowContainerProps): ReactNode => {
    const props = usePerformanceFromScoreTableRow(score, statsByScore, problemScores);
    return <PerformanceFromScoreTableRow {...props} />;
};
