import type { ReactNode } from "react";
import { ContestsTabContent } from "../contestsTabContent";
import { SolveProbabilityTabContentContainer } from "../solveProbabilityTabContent/";

export const ProblemsTab = (): ReactNode => {
    return (
        <div className="tabs tabs-lift">
            <input type="radio" name="problems_tab" className="tab" aria-label="ABC" defaultChecked />
            <ContestsTabContent contestType="abc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="ARC" />
            <ContestsTabContent contestType="arc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="AGC" />
            <ContestsTabContent contestType="agc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="Solve Probability" />
            <SolveProbabilityTabContentContainer />
        </div>
    );
};
