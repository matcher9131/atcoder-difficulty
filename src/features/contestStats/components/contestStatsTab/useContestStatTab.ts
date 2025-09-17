// TODO:
// usePerformanceFromScoreTable, useRankFromPerformanceTable, useContestDistributionGraphで別々にloadableを読みに行っているので非効率
// useContestStatsTab内でcontestAtomを読み、ContestStatsTabContainerで各コンテナコンポーネントに1.の返り値を渡す方針で

import { useAtomValue } from "jotai";
import { selectedContestAtom } from "../../models/selectedContest";
import { contestStatsAtom } from "../../models/contestStats";
import type { ContestStatsTabProps } from "./ContestStatsTab";

export const useContestStatsTab = (): ContestStatsTabProps | "loading" | "hasError" => {
    const contestId = useAtomValue(selectedContestAtom);
    const contestStatsLoadable = useAtomValue(contestStatsAtom(contestId));
    if (contestStatsLoadable.state !== "hasData") return contestStatsLoadable.state;

    const contestStats = contestStatsLoadable.data;
    console.log(`contestId = ${contestId}`);
    console.log(contestStats);

    return {
        statsByScore: contestStats?.ss ?? [],
        statsByPerformance: contestStats?.sp ?? [],
        problemScores: contestStats?.s ?? [],
    };
};
