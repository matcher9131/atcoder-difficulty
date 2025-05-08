import type { Problem } from "./problem";

export type ProblemSolveProbability = Problem & {
    readonly solveProbability: number;
};
