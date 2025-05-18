import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { headerCellClassNames } from "../../../../common/headerCellClassNames";

export type ContestsTableHeaderProps = {
    readonly numProblems: number;
};

export const ContestsTableHeader = ({ numProblems }: ContestsTableHeaderProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <thead className="contents">
            <tr className="contents">
                <th className={headerCellClassNames}>{t("contestsTableHeader.contestLabel")}</th>
                {new Array(numProblems).fill(0).map((_, i) => (
                    <th
                        key={i}
                        className={headerCellClassNames}
                    >{`${t("contestsTableHeader.problemLabel")}${(i + 1).toString()}`}</th>
                ))}
            </tr>
        </thead>
    );
};
