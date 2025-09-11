import type { Problem } from "../../problem/types/problem";

export type SolveProbability = {
    readonly solveProbability: number;
};

export type ProblemSolveProbability = Problem & SolveProbability;
