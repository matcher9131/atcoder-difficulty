import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { ContestType } from "../types/contestType";
import { contestsAtom, contestsJsonAtom } from "./atom";

const contestAtom = atomFamily((contestId: string) =>
    atom((get) => get(contestsAtom).find((contest) => contest.id === contestId)),
);

export const contestDateAtom = atomFamily((contestId: string) =>
    atom((get) => {
        const contest = get(contestAtom(contestId));
        if (contest == null) throw new Error(`Invalid contestId: ${contestId}`);
        return contest.d;
    }),
);

export const contestMaxRatingAtom = atomFamily((contestId: string) =>
    atom((get) => {
        const contest = get(contestAtom(contestId));
        if (contest == null) throw new Error(`Invalid contestId: ${contestId}`);
        return contest.m;
    }),
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

export const contestStatsDateLastOfChunkAtom = atom((get) =>
    get(contestsJsonAtom).lastOfChunks.map((contestId) => get(contestDateAtom(contestId))),
);
