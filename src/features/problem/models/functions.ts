import type { ProblemSolveProbability } from "../types/problemSolveProbability";

const stddev = 600;

export const irt2pl = (ability: number, discrimination: number, difficulty: number) =>
    1 / (1 + Math.exp((-discrimination * (ability - difficulty)) / stddev));

export const compareSolveProbability = (x: ProblemSolveProbability, y: ProblemSolveProbability): number => {
    return x.solveProbability - y.solveProbability;
};
