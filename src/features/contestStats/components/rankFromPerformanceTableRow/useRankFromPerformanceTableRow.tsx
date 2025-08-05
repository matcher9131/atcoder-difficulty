import { scoreToPatterns } from "../../functions/scoreToPatterns";
import type { StatsByPerformance } from "../../types/statsByPerformance";
import { type RankFromPerformanceTableRowProps } from "./RankFromPerformanceTableRow";

export const useRankFromPerformanceTableRow = (
    performance: number,
    statsByPerformance: StatsByPerformance,
    problemScores: readonly number[],
): RankFromPerformanceTableRowProps => {
    const { s: score, t, r: rank } = statsByPerformance;
    const time = `${Math.floor(t / 60).toFixed(0)} : ${(t % 60).toFixed(0).padStart(2, "0")}`;
    const patterns = scoreToPatterns(score, problemScores);

    return {
        performance,
        score,
        patterns,
        time,
        rank,
    };
};
