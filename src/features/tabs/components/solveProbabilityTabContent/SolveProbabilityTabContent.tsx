import type { ReactNode } from "react";

export type SolveProbabilityTabContentProps = {
    readonly itemsPerPageSelector: ReactNode;
    readonly headerPaginationBar: ReactNode;
    readonly solveProbabilityTable: ReactNode;
    readonly footerPaginationBar: ReactNode;
};

export const SolveProbabilityTabContent = ({
    itemsPerPageSelector,
    headerPaginationBar,
    solveProbabilityTable,
    footerPaginationBar,
}: SolveProbabilityTabContentProps): ReactNode => {
    return (
        <div className="tab-content bg-base-100 border-base-300 p-4 w-full text-center">
            {itemsPerPageSelector}
            {headerPaginationBar}
            {solveProbabilityTable}
            {footerPaginationBar}
        </div>
    );
};
