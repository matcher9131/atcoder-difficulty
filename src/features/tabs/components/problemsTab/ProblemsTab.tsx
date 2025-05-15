import type { ReactNode } from "react";
import { ContestsTabContent } from "../contestsTabContent";
import { useTranslation } from "react-i18next";

export type ProblemsTabProps = {
    readonly solveProbabilityTabContent: ReactNode;
};

export const ProblemsTab = ({ solveProbabilityTabContent }: ProblemsTabProps): ReactNode => {
    const { t } = useTranslation();
    return (
        <div className="tabs tabs-lift">
            <input type="radio" name="problems_tab" className="tab" aria-label="ABC" defaultChecked />
            <ContestsTabContent contestType="abc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="ARC" />
            <ContestsTabContent contestType="arc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="AGC" />
            <ContestsTabContent contestType="agc" />
            <input
                type="radio"
                name="problems_tab"
                className="tab"
                aria-label={t("problemsTab.solveProbabilityTabLabel")}
            />
            {solveProbabilityTabContent}
        </div>
    );
};
