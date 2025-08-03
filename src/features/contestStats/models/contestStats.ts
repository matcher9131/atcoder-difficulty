import { atom } from "jotai";
import { atomFamily, atomWithDefault, loadable } from "jotai/utils";
import type { ContestStats } from "../types/contestStats";
import { contestDateAtom, contestStatsDateLastOfChunkAtom } from "../../contest/dict/contests";

const loadContestStatsChunk = async (chunkIndex: number): Promise<Record<string, Omit<ContestStats, "id">>> => {
    const filenameWithoutExtension = `contest_stat${chunkIndex.toString()}`;
    const module = (await import(`../../../assets/contest_stats/${filenameWithoutExtension}.json`)) as {
        default: Record<string, Omit<ContestStats, "id">>;
    };
    return module.default;
};

const contestStatsChunkAtom = atomFamily((chunkIndex: number) =>
    atomWithDefault(async () => {
        const chunk = await loadContestStatsChunk(chunkIndex);
        return new Map(Object.entries(chunk));
    }),
);

export const contestStatsAtom = atomFamily((contestId: string) =>
    loadable(
        atom(async (get) => {
            const contestDate = get(contestDateAtom(contestId));

            let chunkIndex = 0;
            const dates = get(contestStatsDateLastOfChunkAtom);
            for (; chunkIndex < dates.length; ++chunkIndex) {
                if (contestDate <= dates[chunkIndex]) break;
            }
            const contestStatsChunk = await get(contestStatsChunkAtom(chunkIndex));
            const contestStats = contestStatsChunk.get(contestId);
            if (contestStats == null) throw new Error(`Invalid contestId: ${contestId}`);
            return { id: contestId, ...contestStats };
        }),
    ),
);
