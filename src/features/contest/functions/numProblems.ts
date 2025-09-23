import type { ContestType } from "../types/contestType";

export const getNumProblems = (contestType: ContestType): number => {
    switch (contestType) {
        case "abc":
            return 8;
        case "arc":
            return 7;
        case "agc":
            return 10;
        default:
            throw new Error(`Unknown value: ${(contestType as { type: "__invalid__" }).type}`);
    }
};

export const getGridColsClassName = (contestType: ContestType): string => {
    switch (contestType) {
        case "abc":
            return "w-[112.5%] grid-cols-9";
        case "arc":
            return "w-[114%] grid-cols-8";
        case "agc":
            return "w-[157%] grid-cols-11";
        default:
            throw new Error(`Unknown value: ${(contestType as { type: "__invalid__" }).type}`);
    }
};
