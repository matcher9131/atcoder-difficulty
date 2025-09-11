import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { problemsAtom } from "./atom";

export const problemSelector = atomFamily((problemId: string) =>
    atom((get) => get(problemsAtom).find((problem) => problem.id === problemId)),
);

export const numProblemsAtom = atom((get) => get(problemsAtom).length);

export const contestProblemIdsAtom = atomFamily((contestId: string) =>
    atom((get) => get(problemsAtom).flatMap(({ id }) => (id.substring(0, id.indexOf("/")) === contestId ? [id] : []))),
);
