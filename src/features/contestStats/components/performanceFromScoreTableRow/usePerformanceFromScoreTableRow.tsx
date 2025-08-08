import { RatingWithIconContainer } from "../../../rating/components/ratingWithIcon";
import { adjustLowRating } from "../../../rating/functions/adjustLowRating";
import { scoreToPatterns } from "../../functions/scoreToPatterns";
import type { StatsByScore } from "../../types/statsByScore";
import { type PerformanceFromScoreTableRowProps } from "./PerformanceFromScoreTableRow";

export const usePerformanceFromScoreTableRow = (
    score: number,
    statsByScore: StatsByScore,
    problemScores: readonly number[],
): PerformanceFromScoreTableRowProps => {
    const patterns = scoreToPatterns(score, problemScores);
    const { r: rank, p } = statsByScore;
    const performance = <RatingWithIconContainer rating={Math.round(adjustLowRating(p))} />;

    return {
        score,
        patterns,
        rank,
        performance,
    };
};
