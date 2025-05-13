import type { SolveProbabilityTabContentProps } from "./SolveProbabilityTabContent";
import { PaginationBarContainer } from "../../../pagination/components/paginationBar";
import { SolveProbabilityTableContainer } from "../../../solveProbability/components/solveProbabilityTable";
import { ItemsPerPageSelectorContainer } from "../../../pagination/components/itemsPerPageSelector";

export const useSolveProbabilityTabContent = (): SolveProbabilityTabContentProps => {
    const itemsPerPageSelector = <ItemsPerPageSelectorContainer stateKey="solveProbability" />;
    const headerPaginationBar = <PaginationBarContainer stateKey="solveProbability" />;
    const solveProbabilityTable = <SolveProbabilityTableContainer />;
    const footerPaginationBar = <PaginationBarContainer stateKey="solveProbability" scrollsToTop={true} />;

    return {
        itemsPerPageSelector,
        headerPaginationBar,
        solveProbabilityTable,
        footerPaginationBar,
    };
};
