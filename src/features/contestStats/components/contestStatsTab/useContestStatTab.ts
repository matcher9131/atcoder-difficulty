import { useAtomValue } from "jotai";
import { selectedContestAtom } from "../../models/selectedContest";
import { contestStatsAtom } from "../../models/contestStats";
import type { ContestStatsTabId, ContestStatsTabProps } from "./ContestStatsTab";
import { decodeContestDistribution } from "../../functions/decode";
import { useState, type ChangeEvent } from "react";

export const useContestStatsTab = (): ContestStatsTabProps | "loading" | "hasError" => {
    const [selectedTabId, setSelectedTabId] = useState<ContestStatsTabId>("distribution");

    const contestId = useAtomValue(selectedContestAtom);
    const contestStatsLoadable = useAtomValue(contestStatsAtom(contestId));
    if (contestStatsLoadable.state !== "hasData") return contestStatsLoadable.state;

    const contestStats = contestStatsLoadable.data;
    if (contestStats == null) return "hasError";
    const ratedDistribution = decodeContestDistribution(contestStats.fr[0], contestStats.fr[1]);
    const unratedDistribution = decodeContestDistribution(contestStats.fu[0], contestStats.fu[1]);

    const handleSelectedTabChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSelectedTabId(e.target.value as ContestStatsTabId);
    };

    return {
        contestId,
        ratedDistribution,
        unratedDistribution,
        statsByScore: contestStats.ss,
        statsByPerformance: contestStats.sp,
        problemScores: contestStats.s,
        selectedTabId,
        onSelectedTabChanged: handleSelectedTabChange,
    };
};
