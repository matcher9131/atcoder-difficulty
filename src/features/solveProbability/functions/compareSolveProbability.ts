import type { ProblemSolveProbability } from "../types/problemSolveProbability";

export const compareSolveProbability = (x: ProblemSolveProbability, y: ProblemSolveProbability): number => {
    return x.solveProbability - y.solveProbability;
};
