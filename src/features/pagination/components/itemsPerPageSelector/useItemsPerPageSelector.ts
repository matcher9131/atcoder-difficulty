import { useAtom } from "jotai";
import type { ItemsPerPageSelectorProps } from "./ItemsPerPageSelector";
import type { PaginationKey } from "../../types/paginationKey";
import { itemsPerPageAtom } from "../../model/itemsPerPage";
import { paginationValueAtom } from "../../model/paginations";

export const useItemsPerPageSelector = (stateKey: PaginationKey): ItemsPerPageSelectorProps => {
    const [itemsPerPage, setItemsPerPage] = useAtom(itemsPerPageAtom(stateKey));
    const [, setPaginationValue] = useAtom(paginationValueAtom(stateKey));
    const items = [20, 50, 100].map((n) => ({
        text: n.toString(),
        isSelected: itemsPerPage === n,
        onClick: () => {
            if (itemsPerPage !== n) {
                setItemsPerPage(n);
                setPaginationValue(0);
            }
        },
    }));
    return { items };
};
