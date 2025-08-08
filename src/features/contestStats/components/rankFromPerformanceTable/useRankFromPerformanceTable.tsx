import { useAtomValue } from "jotai";
import { type RankFromPerformanceTableProps } from "./RankFromPerformanceTable";
import { contestStatsAtom } from "../../models/contestStats";
import { selectedContestAtom } from "../../models/selectedContest";
import { RankFromPerformanceTableRowContainer } from "../rankFromPerformanceTableRow/";

export const useRankFromPerformanceTable = (): RankFromPerformanceTableProps => {
    const contestId = useAtomValue(selectedContestAtom);
    const contestStatsLoadable = useAtomValue(contestStatsAtom(contestId));
    const contestStats = contestStatsLoadable.state === "hasData" ? contestStatsLoadable.data : null;
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
