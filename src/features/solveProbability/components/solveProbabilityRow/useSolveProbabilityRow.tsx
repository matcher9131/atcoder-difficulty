import { ContestHeaderCellContainer } from "../../../contest/components/contestHeaderCell";
import { ProblemCellContainer } from "../../../problem/components/problemCell";
import { splitProblemId } from "../../../problem/functions/split";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import { toPercent } from "./functions";
import type { SolveProbabilityRowProps } from "./SolveProbabilityRow";

export const useSolveProbabilityRow = (problem: ProblemSolveProbability): SolveProbabilityRowProps => {
    const [contestId] = splitProblemId(problem.id);
    const contestHeaderCell = <ContestHeaderCellContainer contestId={contestId} />;
    const problemId = problem.id;
    const problemCell = <ProblemCellContainer problemId={problemId} showsParameters={false} showsProblemIndex={true} />;
    const difficulty = problem.d?.[1]?.toString() ?? "NaN";
    const solveProbability = toPercent(problem.solveProbability);
    return {
        contestHeaderCell,
        problemCell,
        difficulty,
        solveProbability,
    };
};
