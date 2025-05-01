import { atom } from "jotai";
import type { Problems } from "../types/problems";
import { atomFamily } from "jotai/utils";

const loadProblems = async () => {
    const response = await fetch("/problems.json");
    if (!response.ok) throw new Error("Failed loading problems.");
    const json = await response.json();
    return json as Problems;
};

const problemsAtom = atom(loadProblems());

export const problemSelector = atomFamily((problemId: string) =>
    atom(async (get) => (await get(problemsAtom))[problemId]),
);
