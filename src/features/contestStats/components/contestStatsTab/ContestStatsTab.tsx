import type { ChangeEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PerformanceFromScoreTableContainer } from "../performanceFromScoreTable";
import { RankFromPerformanceTableContainer } from "../rankFromPerformanceTable";
import type { StatsByScore } from "../../types/statsByScore";
import type { StatsByPerformance } from "../../types/statsByPerformance";
import { ContestDistributionGraphContainer } from "../contestDistributionGraph";
import clsx from "clsx";

export type ContestStatsTabId = "distribution" | "performanceByScore" | "rankByPerformance";

export type ContestStatsTabProps = {
    readonly contestId: string;
    readonly ratedDistribution: readonly number[];
    readonly unratedDistribution: readonly number[];
    readonly statsByScore: ReadonlyArray<[number, StatsByScore]>;
    readonly statsByPerformance: ReadonlyArray<[number, StatsByPerformance]>;
    readonly problemScores: readonly number[];
    readonly selectedTabId: ContestStatsTabId;
    readonly onSelectedTabChanged: ChangeEventHandler<HTMLInputElement>;
};

export const ContestStatsTab = ({
    contestId,
    ratedDistribution,
    unratedDistribution,
    statsByScore,
    statsByPerformance,
    problemScores,
    selectedTabId,
    onSelectedTabChanged,
}: ContestStatsTabProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full flex flex-col p-2">
            <div role="tablist" className="tabs tabs-lift">
                <input
                    type="radio"
                    name="contest_stats_tab"
                    value="distribution"
                    checked={selectedTabId === "distribution"}
                    onChange={onSelectedTabChanged}
                    role="tab"
                    aria-label={t("contestStatsDialog.tabLabels.distribution")}
                    className="tab"
                />
                <input
                    type="radio"
                    name="contest_stats_tab"
                    value="performanceByScore"
                    checked={selectedTabId === "performanceByScore"}
                    onChange={onSelectedTabChanged}
                    role="tab"
                    aria-label={t("contestStatsDialog.tabLabels.performanceByScore")}
                    className="tab"
                />
                <input
                    type="radio"
                    name="contest_stats_tab"
                    value="rankByPerformance"
                    checked={selectedTabId === "rankByPerformance"}
                    onChange={onSelectedTabChanged}
                    role="tab"
                    aria-label={t("contestStatsDialog.tabLabels.rankByPerformance")}
                    className="tab"
                />
            </div>
            <div className="flex-1 min-h-0">
                <div
                    role="tabpanel"
                    className={clsx(
                        selectedTabId !== "distribution" && "hidden",
                        "bg-base-100 border-base-300 p-4 w-full h-full text-center",
                    )}
                >
                    <ContestDistributionGraphContainer
                        contestId={contestId}
                        ratedDistribution={ratedDistribution}
                        unratedDistribution={unratedDistribution}
                    />
                </div>
                <div
                    role="tabpanel"
                    className={clsx(
                        selectedTabId !== "performanceByScore" && "hidden",
                        "bg-base-100 border-base-300 p-2 w-full h-full text-center",
                    )}
                >
                    <PerformanceFromScoreTableContainer statsByScore={statsByScore} problemScores={problemScores} />
                </div>
                <div
                    role="tabpanel"
                    className={clsx(
                        selectedTabId !== "rankByPerformance" && "hidden",
                        "bg-base-100 border-base-300 p-4 w-full text-center",
                    )}
                >
                    <RankFromPerformanceTableContainer
                        statsByPerformance={statsByPerformance}
                        problemScores={problemScores}
                    />
                </div>
            </div>
        </div>
    );
};
