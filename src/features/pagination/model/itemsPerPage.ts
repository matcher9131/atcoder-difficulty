import { atom } from "jotai";
import type { PaginationKey } from "../types/paginationKey";

const abcItemsPerPageAtom = atom(20);
const arcItemsPerPageAtom = atom(20);
const agcItemsPerPageAtom = atom(20);
const solveProbabilityItemsPerPageAtom = atom(20);

export const itemsPerPageAtom = (key: PaginationKey): ReturnType<typeof atom<number>> => {
    switch (key) {
        case "abc":
            return abcItemsPerPageAtom;
        case "arc":
            return arcItemsPerPageAtom;
        case "agc":
            return agcItemsPerPageAtom;
        case "solveProbability":
            return solveProbabilityItemsPerPageAtom;
        default:
            throw new Error(`Unknown key: ${(key as { type: "__invalid__" }).type}`);
    }
};
