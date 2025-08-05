import { useAtomValue } from "jotai";
import { type RankFromPerformanceTableProps } from "./RankFromPerformanceTable";
import { contestStatsAtom } from "../../models/contestStats";
import { selectedContestAtom } from "../../models/selectedContest";
import { RankFromPerformanceTableRowContainer } from "../rankFromPerformanceTableRow/RankFromPerformanceTableRowContainer";

export const useRankFromPerformanceTable = (): RankFromPerformanceTableProps => {
    const contestId = useAtomValue(selectedContestAtom);
    const contestStatsLoadable = useAtomValue(contestStatsAtom(contestId));
    if (contestStatsLoadable.state !== "hasData") throw new Error(`Cannot get stats of ${contestId}.`);
    const contestStats = contestStatsLoadable.data;
    const statsByPerformance = contestStats?.sp ?? [];

    const rows = statsByPerformance.map(([performance, stats]) => (
        <RankFromPerformanceTableRowContainer
            key={performance}
            performance={performance}
            statsByPerformance={stats}
            problemScores={contestStats?.s ?? []}
        />
    ));

    return { rows };
};
