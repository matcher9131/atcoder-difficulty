import type { ReactNode } from "react";
import { PaginationBarContainer } from "../../../pagination/components/paginationBar";
import { ContestsTableContainer } from "../../../contest/components/contestsTable";

// export type ProblemsTabProps = {};

export const ProblemsTab = (): ReactNode => {
    return (
        <div className="tabs tabs-lift">
            <input type="radio" name="problems_tab" className="tab" aria-label="ABC" defaultChecked />
            <div className="tab-content bg-base-100 border-base-300 p-4">
                <PaginationBarContainer stateKey="abc" />
                <ContestsTableContainer contestType="abc" />
            </div>
            <input type="radio" name="problems_tab" className="tab" aria-label="ARC" />
            <div className="tab-content bg-base-100 border-base-300 p-4">
                <PaginationBarContainer stateKey="arc" />
                <ContestsTableContainer contestType="arc" />
            </div>
            <input type="radio" name="problems_tab" className="tab" aria-label="AGC" />
            <div className="tab-content bg-base-100 border-base-300 p-4">
                <PaginationBarContainer stateKey="agc" />
                <ContestsTableContainer contestType="agc" />
            </div>
        </div>
    );
};
