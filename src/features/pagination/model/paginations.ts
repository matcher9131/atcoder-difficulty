import { atom, type Atom } from "jotai";
import { contestIdsByTypeAtom } from "../../contest/dict/contests";
import type { PaginationKey } from "../types/paginationKey";

const abcPaginationValueAtom = atom(0);
const arcPaginationValueAtom = atom(0);
const agcPaginationValueAtom = atom(0);

export const paginationValueAtom = (key: PaginationKey): ReturnType<typeof atom<number>> => {
    switch (key) {
        case "abc":
            return abcPaginationValueAtom;
        case "arc":
            return arcPaginationValueAtom;
        case "agc":
            return agcPaginationValueAtom;
        default:
            throw new Error(`Unknown key: ${(key as { type: "__invalid__" }).type}`);
    }
};

const abcPaginationMaxValueAtom = atom((get) => Math.ceil(get(contestIdsByTypeAtom("abc")).length / 100));
const arcPaginationMaxValueAtom = atom((get) => Math.ceil(get(contestIdsByTypeAtom("arc")).length / 100));
const agcPaginationMaxValueAtom = atom((get) => Math.ceil(get(contestIdsByTypeAtom("agc")).length / 100));

export const paginationMaxValueAtom = (key: PaginationKey): Atom<number> => {
    switch (key) {
        case "abc":
            return abcPaginationMaxValueAtom;
        case "arc":
            return arcPaginationMaxValueAtom;
        case "agc":
            return agcPaginationMaxValueAtom;
        default:
            throw new Error(`Unknown key: ${(key as { type: "__invalid__" }).type}`);
    }
};
