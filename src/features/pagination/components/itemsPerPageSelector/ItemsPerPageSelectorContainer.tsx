import type { ReactNode } from "react";
import { useItemsPerPageSelector } from "./useItemsPerPageSelector";
import { ItemsPerPageSelector } from "./ItemsPerPageSelector";
import type { PaginationKey } from "../../types/paginationKey";

type ItemsPerPageSelectorContainerProps = {
    readonly stateKey: PaginationKey;
};

export const ItemsPerPageSelectorContainer = ({ stateKey }: ItemsPerPageSelectorContainerProps): ReactNode => {
    const props = useItemsPerPageSelector(stateKey);
    return <ItemsPerPageSelector {...props} />;
};
