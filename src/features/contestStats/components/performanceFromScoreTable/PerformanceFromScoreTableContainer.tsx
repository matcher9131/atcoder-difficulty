import type { ReactNode } from "react";
import { usePerformanceFromScoreTable } from "./usePerformanceFromScoreTable";
import { PerformanceFromScoreTable } from "./PerformanceFromScoreTable";
import type { StatsByScore } from "../../types/statsByScore";

type PerformanceFromScoreTableContainerProps = {
    readonly statsByScore: ReadonlyArray<[number, StatsByScore]>;
    readonly problemScores: readonly number[];
};

export const PerformanceFromScoreTableContainer = ({
    statsByScore,
    problemScores,
}: PerformanceFromScoreTableContainerProps): ReactNode => {
    const props = usePerformanceFromScoreTable(statsByScore, problemScores);
    return <PerformanceFromScoreTable {...props} />;
};
