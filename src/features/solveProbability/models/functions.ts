import type { ProblemSolveProbability } from "../types/problemSolveProbability";

const safeSigmoid = (x: number): number => {
    return x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
};

const stddev = 600;

export const irt2pl = (ability: number, discrimination: number, difficulty: number) =>
    safeSigmoid(discrimination * ((ability - difficulty) / stddev));

export const compareSolveProbability = (x: ProblemSolveProbability, y: ProblemSolveProbability): number => {
    return x.solveProbability - y.solveProbability;
};
