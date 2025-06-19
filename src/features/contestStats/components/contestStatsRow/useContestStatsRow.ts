import type { ContestStatsRowProps } from "./ContestStatsRow";

export const useContestStatsRow = (
    contest_id: string,
    query: { readonly performance: number } | { readonly score: number },
): ContestStatsRowProps => {
    // TODO: Implement functions below
    // Get rank, estimated scores and estimated times by performance
    // Get rank and performance by score (time = ∞)
    throw Error("Not implemented");
};
