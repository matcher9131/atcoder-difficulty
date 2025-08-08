import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type RankFromPerformanceTableProps = {
    readonly rows: readonly ReactNode[];
};

export const RankFromPerformanceTable = ({ rows }: RankFromPerformanceTableProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <table className="w-full tab-content grid grid-cols-5">
            <thead className="contents">
                <tr className="contents">
                    <th>{t("contestStatsDialog.performanceLabel")}</th>
                    <th>{t("contestStatsDialog.scoreLabel")}</th>
                    <th>{t("contestStatsDialog.problemPatternsLabel")}</th>
                    <th>{t("contestStatsDialog.timeLabel")}</th>
                    <th>{t("contestStatsDialog.rankLabel")}</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
