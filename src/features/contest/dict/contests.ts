import { atom } from "jotai";
import type { Contests } from "../types/contest";
import { atomFamily } from "jotai/utils";

const loadContets = async (): Promise<Contests> => {
    const response = await fetch("/contests.json");
    if (!response.ok) throw new Error("Failed loading contests.");
    const json = await response.json();
    return Object.fromEntries(json as ReadonlyArray<[string, number | "inf"]>);
};

const contestsAtom = atom(await loadContets());

export const contestMaxRatingAtom = atomFamily((contestId: string) =>
    atom((get) => get(contestsAtom)[contestId]),
);

export const abcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating !== "inf" && maxRating < 2000;
    });
});

export const arcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating !== "inf" && maxRating >= 2000;
    });
});

export const agcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating === "inf";
    });
});
