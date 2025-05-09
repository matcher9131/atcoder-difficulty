import type { ProblemSolveProbability } from "../../types/problemSolveProbability";
import type { SolveProbabilityRowProps } from "./SolveProbabilityRow";

export const useSolveProbabilityRow = (problem: ProblemSolveProbability): SolveProbabilityRowProps => {
    // TODO: Implement converting problemId to contestId
    const contestId = "foo";
    const problemId = problem.id;
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
        contestId,
        problemId,
        difficulty,
        solveProbability,
    };
};
