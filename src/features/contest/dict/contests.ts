import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import type { ContestType } from "../types/contestType";
import contestUrl from "../../../assets/contests.json?url";
import { parseDateOrNull } from "../../../utils/date";
import type { Contest } from "../types/contest";

type ContestsJson = {
    readonly body: Record<string, { readonly d: string; readonly m: number | "inf" }>;
    readonly lastOfChunks: readonly string[];
};

const loadContests = async (): Promise<ContestsJson> => {
    const response = await fetch(contestUrl);
    if (!response.ok) throw new Error("Failed loading contests.");
    return (await response.json()) as ContestsJson;
};

const contestsJsonAtom = atom(await loadContests());

const contestsAtom = atom((get) =>
    Object.entries(get(contestsJsonAtom).body)
        .flatMap(([id, { d, m }]) => {
            const date = parseDateOrNull(d);
            if (date == null) return [];
            return [{ id, d: date, m }];
        })
        .toSorted((x: Contest, y: Contest) => y.d.getTime() - x.d.getTime()),
);

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
