import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type ContestsTableHeaderProps = {
    readonly numProblems: number;
};

export const ContestsTableHeader = ({ numProblems }: ContestsTableHeaderProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <thead className="contents">
            <tr className="contents">
                <th>{t("contestsTableHeader.contestLabel")}</th>
                {new Array(numProblems).fill(0).map((_, i) => (
                    <th key={i}>{`${t("contestsTableHeader.problemLabel")}${i + 1}`}</th>
                ))}
            </tr>
        </thead>
    );
};
