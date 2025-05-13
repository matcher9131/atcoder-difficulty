import type { ReactNode } from "react";
import type { ContestType } from "../../../contest/types/contestType";
import { PaginationBarContainer } from "../../../pagination/components/paginationBar";
import { ContestsTableContainer } from "../../../contest/components/contestsTable";
import { ItemsPerPageSelectorContainer } from "../../../pagination/components/itemsPerPageSelector";

export type ContestsTabContentProps = {
    readonly contestType: ContestType;
};

export const ContestsTabContent = ({ contestType }: ContestsTabContentProps): ReactNode => {
    return (
        <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
            <ItemsPerPageSelectorContainer stateKey={contestType} />
            <PaginationBarContainer stateKey={contestType} />
            <ContestsTableContainer contestType={contestType} />
            <PaginationBarContainer stateKey={contestType} scrollsToTop={true} />
        </div>
    );
};
