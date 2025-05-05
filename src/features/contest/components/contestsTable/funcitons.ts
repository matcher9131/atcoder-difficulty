import type { ContestType } from "../../types/contestType";

export const getNumProblems = (contestType: ContestType): number => {
    switch (contestType) {
        case "abc":
            return 8;
        case "arc":
            return 7;
        case "agc":
            return 10;
        default:
            throw new Error(
                `Unknown value: ${(contestType as { type: "__invalid__" }).type}`,
            );
    }
};
