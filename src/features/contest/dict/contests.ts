import { atom } from "jotai";
import type { Contest } from "../types/contest";
import { atomFamily } from "jotai/utils";
import type { ContestType } from "../types/contestType";
import contestUrl from "../../../assets/contests.json?url";

const loadContets = async (): Promise<readonly Contest[]> => {
    const response = await fetch(contestUrl);
    if (!response.ok) throw new Error("Failed loading contests.");
    const json = (await response.json()) as Record<string, Omit<Contest, "id">>;
    return Object.entries(json).map(([id, rest]) => ({ id, ...rest }));
};

const contestsAtom = atom(await loadContets());

export const contestAtom = atomFamily((contestId: string) =>
    atom((get) => get(contestsAtom).find((contest) => contest.id === contestId)),
);

const abcLikeContestIdsAtom = atom((get) =>
    get(contestsAtom).flatMap((contest) => (contest.m !== "inf" && contest.m < 2000 ? [contest.id] : [])),
);

const arcLikeContestIdsAtom = atom((get) =>
    get(contestsAtom).flatMap((contest) => (contest.m !== "inf" && contest.m >= 2000 ? [contest.id] : [])),
);

const agcLikeContestIdsAtom = atom((get) =>
    get(contestsAtom).flatMap((contest) => (contest.m === "inf" ? [contest.id] : [])),
);

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
