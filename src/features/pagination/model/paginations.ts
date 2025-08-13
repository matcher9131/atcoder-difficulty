import { atom, type Atom } from "jotai";
import { contestIdsByTypeAtom } from "../../contest/models/getter";
import type { PaginationKey } from "../types/paginationKey";
import { solveProbabilitiesMiddleIndexAtom } from "../../solveProbability/models/solveProbabilities";
import { numProblemsAtom } from "../../problem/dict/problems";
import { itemsPerPageAtom } from "./itemsPerPage";

const abcPaginationValueAtom = atom(0);
const arcPaginationValueAtom = atom(0);
const agcPaginationValueAtom = atom(0);
const solveProbabilityPaginationValueAtom = atom(0);

export const paginationValueAtom = (key: PaginationKey): ReturnType<typeof atom<number>> => {
    switch (key) {
        case "abc":
            return abcPaginationValueAtom;
        case "arc":
            return arcPaginationValueAtom;
        case "agc":
            return agcPaginationValueAtom;
        case "solveProbability":
            return solveProbabilityPaginationValueAtom;
        default:
            throw new Error(`Unknown key: ${(key as { type: "__invalid__" }).type}`);
    }
};

const abcPaginationMaxValueAtom = atom(
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("abc")).length / get(itemsPerPageAtom("abc")))] as const,
);
const arcPaginationMaxValueAtom = atom(
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("arc")).length / get(itemsPerPageAtom("arc")))] as const,
);
const agcPaginationMaxValueAtom = atom(
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("agc")).length / get(itemsPerPageAtom("agc")))] as const,
);
const solveProbabilityPaginationMinMaxValueAtom = atom((get) => {
    const itemsPerPage = get(itemsPerPageAtom("solveProbability"));
    const mid = get(solveProbabilitiesMiddleIndexAtom);
    return [
        -Math.ceil((mid - itemsPerPage / 2) / itemsPerPage),
        Math.ceil((get(numProblemsAtom) - (mid + itemsPerPage / 2)) / itemsPerPage) + 1,
    ] as const;
});

export const paginationMinMaxValueAtom = (key: PaginationKey): Atom<readonly [number, number]> => {
    switch (key) {
        case "abc":
            return abcPaginationMaxValueAtom;
        case "arc":
            return arcPaginationMaxValueAtom;
        case "agc":
            return agcPaginationMaxValueAtom;
        case "solveProbability":
            return solveProbabilityPaginationMinMaxValueAtom;
        default:
            throw new Error(`Unknown key: ${(key as { type: "__invalid__" }).type}`);
    }
};
