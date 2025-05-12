import { ContestHeaderCellContainer } from "../../../contest/components/contestHeaderCell";
import { ProblemCellContainer } from "../../../problem/components/problemCell";
import { splitProblemId } from "../../../problem/functions/split";
import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import type { SolveProbabilityRowProps } from "./SolveProbabilityRow";

export const useSolveProbabilityRow = (problem: ProblemSolveProbability): SolveProbabilityRowProps => {
    const [contestId] = splitProblemId(problem.id);
    const contestHeaderCell = <ContestHeaderCellContainer contestId={contestId} />;
    const problemId = problem.id;
    const problemCell = <ProblemCellContainer problemId={problemId} showsParameters={false} showsProblemIndex={true} />;
    const difficulty = `${problem.d?.[1] ?? "NaN"}`;
    const solveProbability =
        problem.solveProbability < 0
            ? "NaN"
            : problem.solveProbability > 0.999
              ? "99.9%"
              : problem.solveProbability < 0.001
                ? "0.1%"
                : `${(problem.solveProbability * 100).toFixed(1)}%`;
    return {
        contestHeaderCell,
        problemCell,
        difficulty,
        solveProbability,
    };
};
