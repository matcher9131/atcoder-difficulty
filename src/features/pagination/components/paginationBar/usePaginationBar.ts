import { useAtom } from "jotai";
import type { PaginationBarProps } from "./PaginationBar";
import { paginationMinMaxValueAtom, paginationValueAtom } from "../../model/paginations";
import type { PaginationKey } from "../../types/paginationKey";
import { range, thinnedRange } from "../../../../utils/array";

export const usePaginationBar = (stateKey: PaginationKey): PaginationBarProps => {
    const [value, setValue] = useAtom(paginationValueAtom(stateKey));
    const [[min, max]] = useAtom(paginationMinMaxValueAtom(stateKey));

    const usesNegativeIndex = min < 0;
    const showsAll = max - min <= 10;
    const pageIndices = showsAll ? range(min, max - min) : thinnedRange(min, value, max);

    return {
        items: pageIndices.map((i) => ({
            displayIndex: `${usesNegativeIndex ? i : i + 1}`,
            isSelected: value === i,
            onClick: () => {
                setValue(i);
            },
        })),
        onClickDecrement: () => {
            setValue((i) => (i > min ? i - 1 : i));
        },
        onClickIncrement: () => {
            setValue((i) => (i < max - 1 ? i + 1 : i));
        },
    };
};
