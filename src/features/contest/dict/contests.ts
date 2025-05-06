import { atom } from "jotai";
import type { Contests } from "../types/contest";
import { atomFamily } from "jotai/utils";
import type { ContestType } from "../types/contestType";

const loadContets = async (): Promise<Contests> => {
    const response = await fetch("/contests.json");
    if (!response.ok) throw new Error("Failed loading contests.");
    const json = await response.json();
    return Object.fromEntries(json as ReadonlyArray<[string, number | "inf"]>);
};

const contestsAtom = atom(await loadContets());

export const contestMaxRatingAtom = atomFamily((contestId: string) => atom((get) => get(contestsAtom)[contestId]));

const abcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating !== "inf" && maxRating < 2000;
    });
});

const arcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating !== "inf" && maxRating >= 2000;
    });
});

const agcLikeContestIdsAtom = atom((get) => {
    const contests = get(contestsAtom);
    return Object.keys(contests).filter((id) => {
        const maxRating = contests[id];
        return maxRating === "inf";
    });
});

export const contestIdsByTypeAtom = (contestType: ContestType) => {
    switch (contestType) {
        case "abc":
            return abcLikeContestIdsAtom;
        case "arc":
            return arcLikeContestIdsAtom;
        case "agc":
            return agcLikeContestIdsAtom;
        default:
            throw new Error(`Unknown value: ${(contestType as { type: "__invalid__" }).type}`);
    }
};
