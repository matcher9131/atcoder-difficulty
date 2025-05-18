import { useAtom } from "jotai";
import type { PaginationBarProps } from "./PaginationBar";
import { paginationMinMaxValueAtom, paginationValueAtom } from "../../model/paginations";
import type { PaginationKey } from "../../types/paginationKey";
import { lowerBound, range, thinnedRange } from "../../../../utils/array";

const toZeroInserted = (arr: number[]): number[] => {
    const i = lowerBound(arr, (x) => x, 0);
    return arr[i] === 0 ? [...arr] : arr.toSpliced(i, 0, 0);
};

export const usePaginationBar = (stateKey: PaginationKey, scrollsToTop: boolean): PaginationBarProps => {
    const [value, setValue] = useAtom(paginationValueAtom(stateKey));
    const [[min, max]] = useAtom(paginationMinMaxValueAtom(stateKey));

    const usesNegativeIndex = min < 0;
    const showsAll = max - min <= 10;
    const pageIndices = showsAll ? range(min, max - min) : toZeroInserted(thinnedRange(min, value, max));
    const scroll = scrollsToTop
        ? () => {
              window.scroll({ top: 0, behavior: "smooth" });
          }
        : () => {};

    return {
        items: pageIndices.map((i) => ({
            displayIndex: usesNegativeIndex ? i.toString() : (i + 1).toString(),
            isSelected: value === i,
            onClick: () => {
                setValue(i);
                scroll();
            },
        })),
        onClickDecrement: () => {
            setValue((i) => (i > min ? i - 1 : i));
            scroll();
        },
        onClickIncrement: () => {
            setValue((i) => (i < max - 1 ? i + 1 : i));
            scroll();
        },
    };
};
