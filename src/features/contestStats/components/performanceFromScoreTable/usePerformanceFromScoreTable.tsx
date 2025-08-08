import { useAtomValue } from "jotai";
import { type PerformanceFromScoreTableProps } from "./PerformanceFromScoreTable";
import { selectedContestAtom } from "../../models/selectedContest";
import { contestStatsAtom } from "../../models/contestStats";
import { PerformanceFromScoreTableRowContainer } from "../performanceFromScoreTableRow";

export const usePerformanceFromScoreTable = (): PerformanceFromScoreTableProps => {
    const contestId = useAtomValue(selectedContestAtom);
    const contestStatsLoadable = useAtomValue(contestStatsAtom(contestId));
    const contestStats = contestStatsLoadable.state === "hasData" ? contestStatsLoadable.data : null;
    const statsByScore = contestStats?.ss ?? [];

    const rows = statsByScore.map(([score, stats]) => (
        <PerformanceFromScoreTableRowContainer
            key={score}
            score={score}
            statsByScore={stats}
            problemScores={contestStats?.s ?? []}
        />
    ));

    return { rows };
};
