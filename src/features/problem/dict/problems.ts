import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { Problem } from "../types/problem";

const loadProblems = async (): Promise<readonly Problem[]> => {
    const response = await fetch("/problems.json");
    if (!response.ok) throw new Error("Failed loading problems.");
    const json: Record<string, Omit<Problem, "id">> = await response.json();
    return Object.entries(json).map(([id, rest]) => ({ id, ...rest }));
};

export const problemsAtom = atom(await loadProblems());

export const problemSelector = atomFamily((problemId: string) =>
    atom((get) => get(problemsAtom).find((problem) => problem.id === problemId)),
);

export const numProblemsAtom = atom((get) => get(problemsAtom).length);

const allProblemIdsAtom = atom((get) => get(problemsAtom).map(({ id }) => id));

export const contestProblemIdsAtom = atomFamily((contestId: string) =>
    atom((get) =>
        get(allProblemIdsAtom).filter((problemId) => problemId.substring(0, problemId.indexOf("/")) === contestId),
    ),
);
