import { atom, type Atom } from "jotai";
import { contestIdsByTypeAtom } from "../../contest/dict/contests";
import type { PaginationKey } from "../types/paginationKey";
import { solveProbabilitiesMiddleIndexAtom } from "../../solveProbability/models/solveProbabilities";
import { numProblemsAtom } from "../../problem/dict/problems";

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
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("abc")).length / 100)] as const,
);
const arcPaginationMaxValueAtom = atom(
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("arc")).length / 100)] as const,
);
const agcPaginationMaxValueAtom = atom(
    (get) => [0 as number, Math.ceil(get(contestIdsByTypeAtom("agc")).length / 100)] as const,
);
const solveProbabilityPaginationMinMaxValueAtom = atom((get) => {
    const mid = get(solveProbabilitiesMiddleIndexAtom);
    return [-Math.ceil((mid - 50) / 100), Math.ceil((get(numProblemsAtom) - (mid + 50)) / 100) + 1] as const;
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
