import { useAtom } from "jotai";
import type { PaginationBarProps } from "./PaginationBar";
import { paginationMaxValueAtom, paginationValueAtom } from "../../model/paginations";
import type { PaginationKey } from "../../types/paginationKey";

export const usePaginationBar = (stateKey: PaginationKey): PaginationBarProps => {
    const [value, setValue] = useAtom(paginationValueAtom(stateKey));
    const [maxValue] = useAtom(paginationMaxValueAtom(stateKey));

    return {
        items: new Array(maxValue).fill(0).map((_, i) => ({
            displayIndex: `${i + 1}`,
            isSelected: value === i,
            onClick: () => {
                setValue(i);
            },
        })),
        onClickDecrement: () => {
            setValue((i) => (i > 0 ? i - 1 : i));
        },
        onClickIncrement: () => {
            setValue((i) => (i < maxValue - 1 ? i + 1 : i));
        },
    };
};
