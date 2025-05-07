import type { ReactNode } from "react";
import { ContestsTabContent } from "../contestsTabContent";

export const ProblemsTab = (): ReactNode => {
    return (
        <div className="tabs tabs-lift">
            <input type="radio" name="problems_tab" className="tab" aria-label="ABC" defaultChecked />
            <ContestsTabContent contestType="abc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="ARC" />
            <ContestsTabContent contestType="arc" />
            <input type="radio" name="problems_tab" className="tab" aria-label="AGC" />
            <ContestsTabContent contestType="agc" />
        </div>
    );
};
