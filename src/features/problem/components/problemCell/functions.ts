import { capitalize } from "../../../../utils/string";

export const getProblemIndex = (problemId: string): string => {
    return capitalize(problemId.substring(problemId.lastIndexOf("_") + 1));
};

export const toPercent = (x: number): string => {
    return x > 1 ? "" : x < 0 ? "NaN" : x >= 0.995 ? ">99%" : x < 0.005 ? "<1%" : `${(x * 100).toFixed(0)}%`;
};
