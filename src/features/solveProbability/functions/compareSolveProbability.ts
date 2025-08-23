import type { SolveProbability } from "../types/problemSolveProbability";

export const compareSolveProbability = (x: SolveProbability, y: SolveProbability): number => {
    return x.solveProbability - y.solveProbability;
};
