import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PerformanceFromScoreTableContainer } from "../performanceFromScoreTable";
import { RankFromPerformanceTableContainer } from "../rankFromPerformanceTable";
import type { StatsByScore } from "../../types/statsByScore";
import type { StatsByPerformance } from "../../types/statsByPerformance";

export type ContestStatsTabProps = {
    readonly statsByScore: ReadonlyArray<[number, StatsByScore]>;
    readonly statsByPerformance: ReadonlyArray<[number, StatsByPerformance]>;
    readonly problemScores: readonly number[];
};

export const ContestStatsTab = ({
    statsByScore,
    statsByPerformance,
    problemScores,
}: ContestStatsTabProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="w-full p-2 tabs tabs-lift">
            <input
                type="radio"
                name="contest_stats_tab"
                className="tab"
                aria-label={t("contestStatsDialog.tabLabels.performanceByScore")}
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
                <PerformanceFromScoreTableContainer statsByScore={statsByScore} problemScores={problemScores} />
            </div>
            <input
                type="radio"
                name="contest_stats_tab"
                className="tab"
                aria-label={t("contestStatsDialog.tabLabels.rankByPerformance")}
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
                <RankFromPerformanceTableContainer
                    statsByPerformance={statsByPerformance}
                    problemScores={problemScores}
                />
            </div>
        </div>
    );
};
