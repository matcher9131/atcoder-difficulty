import type { Problem } from "../../problem/types/problem";

export type ProblemSolveProbability = Problem & {
    readonly solveProbability: number;
};
