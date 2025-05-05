import { atom } from "jotai";
import type { Problems } from "../types/problems";
import { atomFamily } from "jotai/utils";

const loadProblems = async (): Promise<Problems> => {
    const response = await fetch("/problems.json");
    if (!response.ok) throw new Error("Failed loading problems.");
    const json = await response.json();
    return json as Problems;
};

const problemsAtom = atom(await loadProblems());

export const problemSelector = atomFamily((problemId: string) =>
    atom((get) => get(problemsAtom)[problemId]),
);

const allProblemIdsAtom = atom((get) => Object.keys(get(problemsAtom)));

export const contestProblemIdsAtom = atomFamily((contestId: string) =>
    atom((get) =>
        get(allProblemIdsAtom).filter(
            (problemId) =>
                problemId.substring(0, problemId.lastIndexOf("_")) ===
                contestId,
        ),
    ),
);
