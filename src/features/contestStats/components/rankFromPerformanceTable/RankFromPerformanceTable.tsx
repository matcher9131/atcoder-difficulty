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
                    <th>{t("contestStatsDialog.tableHeaderLabels.performance")}</th>
                    <th>{t("contestStatsDialog.tableHeaderLabels.score")}</th>
                    <th>{t("contestStatsDialog.tableHeaderLabels.problemPatterns")}</th>
                    <th>{t("contestStatsDialog.tableHeaderLabels.time")}</th>
                    <th>{t("contestStatsDialog.tableHeaderLabels.rank")}</th>
                </tr>
            </thead>
            <tbody className="contents">{rows}</tbody>
        </table>
    );
};
