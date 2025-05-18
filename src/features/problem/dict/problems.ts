import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { Problem } from "../types/problem";
import problemsUrl from "../../../assets/problems.json?url";

const loadProblems = async (): Promise<readonly Problem[]> => {
    const response = await fetch(problemsUrl);
    if (!response.ok) throw new Error("Failed loading problems.");
    const json = (await response.json()) as Record<string, Omit<Problem, "id">>;
    return Object.entries(json).map(([id, rest]) => ({ id, ...rest }));
};

export const problemsAtom = atom(await loadProblems());

export const problemSelector = atomFamily((problemId: string) =>
    atom((get) => get(problemsAtom).find((problem) => problem.id === problemId)),
);

export const numProblemsAtom = atom((get) => get(problemsAtom).length);

export const contestProblemIdsAtom = atomFamily((contestId: string) =>
    atom((get) => get(problemsAtom).flatMap(({ id }) => (id.substring(0, id.indexOf("/")) === contestId ? [id] : []))),
);
